export enum ErrorCode {}

export interface iError {
  message: string;
  detail?: string;
  code?: ErrorCode;
}
