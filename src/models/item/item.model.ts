import {
  iItemEncrypted,
  iItemEncryptedBit,
  iItemEncryptedField,
} from '../../interfaces/item/item.interface';
import uuid from 'react-native-uuid';
import StockData from '../../services/stock-data';
import EventBase from '../../services/events';
import Crypto, {iCipherObject} from '../../services/crypto';

interface iConstructor {
  id?: string;
  history?: iItemEncryptedBit[];
}

interface iFilter {
  search: string;
  order?: 'title' | 'creation';
  orderType?: 'asc' | 'desc';
}

type iItemEncryptedBitEdit = Pick<iItemEncryptedBit, 'fields'>;

const ITEM_LIST_KEY = '__item_list_key_81a8e194-589a-48a5-915e-ee6aafdf46ff_';

export class ItemEncrypted implements iItemEncrypted {
  title = '';
  password: string;
  id: string;
  history: iItemEncryptedBit[];
  promise = Promise.resolve();
  indexItemBit = -2;

  constructor(password: string, params?: iConstructor) {
    this.password = password;
    this.id = params?.id || uuid.v4().toString();
    this.history = params?.history || [];
    if (params?.id) {
      this.promise = this.load(params?.id);
    }
  }

  getInterface() {
    return {
      id: this.id,
      history: this.history,
    };
  }

  async save() {
    return StockData.set(this.id, JSON.stringify(this.getInterface()));
  }

  async load(id: string) {
    const dataRaw = await StockData.get(id);
    if (dataRaw) {
      const data = JSON.parse(dataRaw) as iItemEncrypted;
      this.history = data.history;
      const item = this.getRecentHistory();
      if (item) {
        const value = await this.getFirstFieldDecrypted(item);
        this.title = value;
      }
    }
  }

  async editBit(bit: iItemEncryptedBitEdit) {
    const b: iItemEncryptedBit = {
      id: uuid.v4().toString(),
      creation: Date.now(),
      fields: bit.fields,
    };
    this.title = b.fields[0].value;
    const itemEncrypted = await this.encryptItem(b);
    this.history.push(itemEncrypted);
    return this.save();
  }

  setTitle(title?: string) {
    const history = this.getRecentHistory();
    if (history) {
      this.title = title || history.fields[0].value;
    }
  }

  async deleteBit(id: string) {
    this.history = this.history.filter(h => h.id !== id);
    return this.save();
  }

  async delete() {
    const id = this.id;
    this.id = '';
    this.history = [];
    return StockData.delete(id);
  }

  getHistory(index: number) {
    if (index < 0 || index >= this.history.length) {
      return null;
    }
    return this.history[index];
  }

  getRecentHistory() {
    return this.history[this.history.length - 1];
  }

  async getFirstFieldDecrypted(item: iItemEncryptedBit) {
    const value = item.fields[0].value;
    return this.decrypt(value, this.password);
  }

  async getAllFieldsDecrypted(
    item: iItemEncryptedBit,
  ): Promise<iItemEncryptedField[]> {
    const promises = [...item.fields].map(async field => {
      const value = await this.decrypt(field.value, this.password);
      const f = {...field};
      f.value = value;
      return f;
    });
    return Promise.all(promises);
  }

  async encryptItem(item: iItemEncryptedBit) {
    const promises = item.fields.map(async field => {
      const cipher = await this.encrypt(field.value, this.password);
      field.value = cipher;
    });

    return Promise.all(promises).then(() => item);
  }

  private getDefaultIndexItemBit(modifier = 0) {
    if (this.indexItemBit === -1) {
      this.indexItemBit = 0;
    } else if (
      this.indexItemBit === -2 ||
      this.indexItemBit >= this.history.length
    ) {
      this.indexItemBit = this.history.length - 1;
    }
    this.indexItemBit += modifier;
    return this.indexItemBit;
  }

  /**
   * Retorna el item actual con los campos decifrados
   * @param reset Si es verdadero, vuelve a poner el index en el último item modificado.
   * @returns iItemEncryptedBit | null
   */
  async getCurrentItemBitDecrypted(
    reset = false,
  ): Promise<iItemEncryptedBit | null> {
    if (reset) {
      this.resetIndexItemBit();
    }
    return await this.decryptItemBitByIndex(this.getDefaultIndexItemBit());
  }

  async getPreviousItemBitDecrypted(): Promise<iItemEncryptedBit | null> {
    return await this.decryptItemBitByIndex(this.getDefaultIndexItemBit(-1));
  }

  async getNextItemBitDecrypted(): Promise<iItemEncryptedBit | null> {
    return await this.decryptItemBitByIndex(this.getDefaultIndexItemBit(1));
  }

  hasPrevious() {
    return this.indexItemBit > 0;
  }

  hasNext() {
    return this.indexItemBit < this.history.length - 1;
  }

  private async decryptItemBitByIndex(index: number) {
    const bit = this.getHistory(index);
    if (bit) {
      const fields = await this.getAllFieldsDecrypted(bit);
      return {...bit, fields};
    }
    return null;
  }

  private resetIndexItemBit() {
    this.indexItemBit = -2;
  }

  private async decrypt(value: string, password: string) {
    if (!value) {
      return '';
    }
    const cipher = JSON.parse(value) as iCipherObject;
    return Crypto.decrypt(password, cipher);
  }

  private async encrypt(value: string, password: string) {
    const cipher = await Crypto.encrypt(password, value);
    return JSON.stringify(cipher);
  }
}

export class ItemEncryptedList {
  key: string;
  listIds: string[] = [];
  list: ItemEncrypted[] = [];
  updateEvent: EventBase;

  constructor(key = ITEM_LIST_KEY) {
    this.key = key;
    this.updateEvent = new EventBase('__ILU__' + key);
  }

  async save() {
    await StockData.set(this.key, JSON.stringify(this.listIds));
    this.updateEvent.emit();
  }

  async load(password: string) {
    const dataRaw = await StockData.get(this.key);
    if (dataRaw) {
      this.listIds = JSON.parse(dataRaw) as string[];
      const promises = this.listIds.map(async id => {
        const item = new ItemEncrypted(password, {id});
        await item.promise;
        return item;
      });

      return Promise.all(promises).then(items => {
        this.list = items;
      });
    }
  }

  async add(item: ItemEncrypted) {
    if (item.id) {
      this.listIds.push(item.id);
      this.list.push(item);
      await this.save();
      await item.save();
    }
  }

  async edit(item: ItemEncrypted) {
    this.list = this.list.map(i => (i.id === item.id ? item : i));
    await this.save();
    await item.save();
  }

  get(id: string) {
    return this.list.filter(i => i.id === id)[0];
  }

  async delete(id: string) {
    this.listIds = this.listIds.filter(_id => _id !== id);
    let itemToDelete: ItemEncrypted | undefined;
    this.list = this.list.filter(item => {
      if (item.id === id) {
        itemToDelete = item;
        return false;
      }
      return true;
    });

    if (itemToDelete) {
      await itemToDelete.delete();
    }
    return this.save();
  }

  async clearList() {
    await StockData.delete(this.key);
    this.updateEvent.emit();
  }

  filter(params?: iFilter) {
    let list = this.list;

    if (params?.search) {
      list = list.filter(
        e =>
          e.title
            .toLowerCase()
            .indexOf(params.search.toLocaleLowerCase().trim()) >= 0,
      );
    }

    return list;
  }
}
