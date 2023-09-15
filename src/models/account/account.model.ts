import Crypto from '../../services/crypto';
import StockData from '../../services/stock-data';

const USER_PASSWORD_KEY = '__user_password_key__';

export class Account {
  readonly password: string;
  updated: number;

  constructor(password: string) {
    this.password = password;
    this.updated = Date.now();
  }

  async isValid() {
    const encryptedPasswordOld = await StockData.get(USER_PASSWORD_KEY);
    const encryptedPasswordNew = await Crypto.hash256(this.password);
    return encryptedPasswordOld === encryptedPasswordNew;
  }

  async save() {
    const encryptedPassword = await Crypto.hash256(this.password);
    await StockData.set(USER_PASSWORD_KEY, encryptedPassword);
  }

  renew() {
    this.updated = Date.now();
  }

  static async previousRegistered() {
    return !!(await StockData.get(USER_PASSWORD_KEY));
  }

  static async remove() {
    await StockData.delete(USER_PASSWORD_KEY);
  }
}
