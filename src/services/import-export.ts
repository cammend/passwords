import {format, parse} from 'date-fns';
import {FieldType} from '../interfaces/field/field.interface';
import {
  iItemEncryptedBit,
  iItemEncryptedField,
} from '../interfaces/item/item.interface';
import SystemError from '../models/error/error.model';
import {ItemEncrypted} from '../models/item/item.model';
import {ItemListState} from '../state/item-list/item-list.state';
import Crypto, {iCipherObject} from './crypto';
import ExternalStorage from './external-storage';
import uuid from 'react-native-uuid';
import {TITLE_FIRST_FIELD} from '../components/item/add-item';

const FILE_CIPHER_EXPORTED = 'Contraseñas_cifradas_%.txt';
const FILE_NO_CIPHER_EXPORTED = 'Contraseñas_sin_cifrado_%.txt';

const FORMAT_DATE_CREATION = 'dd/MM/yyyy HH:mm:ss';

const LINE_FIRST_ITEM = 2; // line 3 - 1
const SEPARATOR_CIPHER = '==@';
const IV_LENGTH = 32;
const FIELD_ITEM_LINE_STARTS_WITH = '		++++ ';
const ITEM_SEP_FIELD_DATA = ': ';
const VALUE_SEP_CIPHER_DATA = '@';
const MAIN_ITEM_LINE_STARTS_WITH = '++++ ITEM: ';
const HISTORY_ITEM_LINE_STARTS_WITH = '	++++ Creation:';

const getFilename = (decrypted = true) => {
  const date = new Date();
  const formatDate = format(date, 'yyyy_MM_dd_HH_mm_ss');
  const baseStr = decrypted ? FILE_NO_CIPHER_EXPORTED : FILE_CIPHER_EXPORTED;
  return baseStr.replace('%', formatDate);
};

export default abstract class ImportExport {
  public static async export(decrypted = true) {
    try {
      const data = await this.getTextToExport(ItemListState.list, decrypted);
      const pathDirectory = await ExternalStorage.tryCreateAppDirectory();
      const filename = getFilename(decrypted);
      await ExternalStorage.createTextFile(pathDirectory, filename, data);
    } catch (error) {
      return Promise.reject(
        new SystemError('Ocurrió un error en la exportación de items'),
      );
    }
  }

  public static async loadDataFromFile() {
    try {
      let data = await ExternalStorage.filePickerReadTextFile();
      data = data.trim();
      if (!data.startsWith('++++ ITEM:')) {
        return Promise.reject(
          new SystemError(
            'El archivo seleccionado no es un archivo de importación correcto',
          ),
        );
      } else {
        const lines = data.split('\n');
        const firstItem = lines[LINE_FIRST_ITEM];

        if (!firstItem) {
          return Promise.reject(
            new SystemError(
              'El archivo seleccionado no tiene elementos de importación',
            ),
          );
        }

        let isEncrypted = false;
        const indexOf = firstItem.indexOf(SEPARATOR_CIPHER);
        const iv = firstItem.substring(indexOf + SEPARATOR_CIPHER.length);
        if (IV_LENGTH === iv.length && firstItem.endsWith(iv)) {
          isEncrypted = true;
        }

        return Promise.resolve({
          isEncrypted,
          lines,
        });
      }
    } catch (error) {
      return Promise.reject(
        new SystemError('Ocurrió un error en la importación de items'),
      );
    }
  }

  public static async getImportItemsFromDataLines(
    lines: string[],
    password: string,
    passwordEncryptedItems?: string,
  ) {
    try {
      const itemList: ItemEncrypted[] = [];
      let item: ItemEncrypted = new ItemEncrypted(password);
      let itemHistory: iItemEncryptedBit | null;

      const _processLineByLine = async (
        _lines: string[],
        index = 0,
      ): Promise<any> => {
        let line = _lines[index];
        if (!line) {
          return Promise.resolve();
        }

        const isMainItem = line.startsWith(MAIN_ITEM_LINE_STARTS_WITH);
        const isHistoryItem = line.startsWith(HISTORY_ITEM_LINE_STARTS_WITH);
        const isFieldItem = line.startsWith(FIELD_ITEM_LINE_STARTS_WITH);

        // clean line
        line = line
          .replace(MAIN_ITEM_LINE_STARTS_WITH, '')
          .replace(HISTORY_ITEM_LINE_STARTS_WITH, '')
          .replace(FIELD_ITEM_LINE_STARTS_WITH, '');

        if (isMainItem) {
          item = new ItemEncrypted(password);
          itemList.push(item);
          return _processLineByLine(_lines, ++index);
        }

        if (isHistoryItem) {
          itemHistory = {
            id: uuid.v4().toString(),
            creation: parse(
              line.trim(),
              FORMAT_DATE_CREATION,
              new Date(),
            ).getTime(),
            fields: [],
          };

          item.history.push(itemHistory);
          return _processLineByLine(_lines, ++index);
        }

        if (!itemHistory) {
          return _processLineByLine(_lines, ++index);
        }

        if (isFieldItem) {
          const itemData = line.split(ITEM_SEP_FIELD_DATA);
          const itemValue = itemData[1];
          let itemField = itemData[0];

          // plain value
          let plainValue = itemValue;

          if (passwordEncryptedItems) {
            // creando el objet "iCipherObject" del archivo de importación
            const valueData = itemValue.split(VALUE_SEP_CIPHER_DATA);
            const cipher = valueData[0];
            const iv = valueData[1];
            const cipherObject: iCipherObject = {cipher, iv};

            // Desifrando la información
            plainValue = await Crypto.decrypt(
              passwordEncryptedItems,
              cipherObject,
            ).catch(() => {
              return Promise.reject(
                new SystemError(
                  'No se pudieron desencriptar los items. Pruebe con otra contraseña.',
                ),
              );
            });
          }

          // Obteniendo el tipo de campo
          itemField = itemField.trim().replace(']', ''); // remove ]
          const fieldType: any = itemField.substring(
            itemField.indexOf('[') + 1,
          );

          // Obteniendo el título (nombre) del campo
          const fieldTitle = itemField.substring(0, itemField.indexOf('['));

          // cifrando el contenido con la nueva contraseña
          const cipherObject = await Crypto.encrypt(password, plainValue);
          const crypted = JSON.stringify(cipherObject);

          const itemEncrypted: iItemEncryptedField = {
            value: crypted,
            uuid: uuid.v4().toString(),
            title: fieldTitle,
            type: fieldType,
          };

          itemHistory.fields.push(itemEncrypted);

          if (fieldTitle === TITLE_FIRST_FIELD) {
            item.setTitle(plainValue);
          }
        }

        return _processLineByLine(_lines, ++index);
      };

      await _processLineByLine(lines);

      console.log('itemList', JSON.stringify(itemList));

      const promises = itemList.map(async newItem => {
        await ItemListState.add(newItem);
      });

      await Promise.all(promises);
    } catch (error) {
      if (error instanceof SystemError) {
        return Promise.reject(error);
      }
      return Promise.reject(
        new SystemError('Ocurrió procesando el archivo de items'),
      );
    }
  }

  public static async getTextToExport(
    items: ItemEncrypted[],
    decrypted = false,
  ): Promise<string> {
    let text = '\n';

    const _decipher = async (
      item: ItemEncrypted,
      historyList: iItemEncryptedBit[],
      index = 0,
    ) => {
      const history = historyList[index];
      if (!history) {
        return;
      }

      const date = new Date();
      date.setTime(history.creation);
      const dateString = format(date, FORMAT_DATE_CREATION);

      text += `\t++++ Creation:${dateString}\n`;
      let fields = history.fields;
      if (decrypted) {
        fields = await item.getAllFieldsDecrypted(history);
      }
      fields.forEach(field => {
        const fieldValue = decrypted
          ? field.value
          : (JSON.parse(field.value) as iCipherObject);

        let value = '';
        if (typeof fieldValue === 'string') {
          value = fieldValue;
        } else {
          value = `${fieldValue.cipher}@${fieldValue.iv}`;
        }

        text += `\t\t++++ ${field.title}[${
          field.type || FieldType.TEXT
        }]: ${value}\n`;
      });

      await _decipher(item, historyList, ++index);
    };

    const _listDecrypt = async (list: ItemEncrypted[], index = 0) => {
      const item = list[index];
      if (!item) {
        return;
      }
      text += `++++ ITEM: ${item.id} +++++++++++++++++++++++++++++++++++++++\n`;
      await _decipher(item, item.history);
      await _listDecrypt(list, ++index);
    };

    await _listDecrypt(items);

    return text;
  }
}
