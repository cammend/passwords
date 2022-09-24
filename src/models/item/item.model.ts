import {
  iItemEncrypted,
  iItemEncryptedBit,
} from '../../interfaces/item/item.interface';
import uuid from 'react-native-uuid';
import StockData from '../../services/stock-data';
import EventBase from '../../services/events';

interface iConstructor {
  id?: string;
  history?: iItemEncryptedBit[];
}

type iItemEncryptedBitEdit = Pick<iItemEncryptedBit, 'fields'>;

const ITEM_LIST_KEY = '__item_list_key_81a8e194-589a-48a5-915e-ee6aafdf46ff_';

export class ItemEncrypted implements iItemEncrypted {
  id: string;
  history: iItemEncryptedBit[];
  promise = Promise.resolve();

  constructor(params?: iConstructor) {
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
    }
  }

  async editBit(bit: iItemEncryptedBitEdit) {
    const b: iItemEncryptedBit = {
      id: uuid.v4().toString(),
      creation: Date.now(),
      fields: bit.fields,
    };
    this.history.push(b);
    return this.save();
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
}

export class ItemEncryptedList {
  key: string;
  listIds: string[] = [];
  list: ItemEncrypted[] = [];
  event: EventBase;

  constructor(key = ITEM_LIST_KEY) {
    this.key = key;
    this.event = new EventBase('__ILU__' + key);
  }

  async save() {
    await StockData.set(this.key, JSON.stringify(this.listIds));
    this.event.emit();
  }

  async load() {
    const dataRaw = await StockData.get(this.key);
    if (dataRaw) {
      this.listIds = JSON.parse(dataRaw) as string[];
      const promises = this.listIds.map(async id => {
        const item = new ItemEncrypted({id});
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
}
