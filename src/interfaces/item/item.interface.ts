import {iFieldItem} from '../field/field.interface';

type FieldItemType = Omit<iFieldItem, 'removable'>;

export interface iItemEncryptedField extends FieldItemType {
  value: string;
}

export interface iItemEncryptedBit {
  id: string;
  fields: iItemEncryptedField[];
  creation: number;
}

export interface iItemEncrypted {
  id: string;
  history: iItemEncryptedBit[];
}
