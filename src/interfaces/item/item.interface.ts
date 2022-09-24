export interface iItemEncryptedField {
  id: string;
  name: string;
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
