import {iError} from '../../interfaces/error/error.interface';

export default class SystemError implements iError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  throw() {
    throw new Error(this.message);
  }
}
