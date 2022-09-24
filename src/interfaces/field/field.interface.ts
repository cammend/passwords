export enum FieldType {
  TEXT = 'text',
  PASSWORD = 'password',
}

export interface iFieldItem {
  uuid: string;
  title: string;
  value?: string;
  type?: FieldType;
  removable?: boolean;
}
