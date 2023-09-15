import {Account} from '../models/account/account.model';
import SystemError from '../models/error/error.model';
import EventBase from './events';

const deltaTime = 300000; // 5 minutes

export default abstract class Session {
  private static account: Account | undefined;
  static expiredEvent = new EventBase('__session_expired_event__');

  public static async login(password: string) {
    const account = new Account(password);
    const isValid = await account.isValid();
    if (!isValid) {
      return Promise.reject(new SystemError('Contraseña incorrecta'));
    }
    this.account = account;
    return account;
  }

  public static async logout() {
    this.account = undefined;
    this.expiredEvent.emit();
  }

  public static async register(password: string) {
    const account = new Account(password);
    await account.save();
    this.account = account;
    return account;
  }

  public static async isValid() {
    if (!this.account) {
      this.expiredEvent.emit();
      return false;
    } else {
      const isValid = await this.account.isValid();
      if (isValid) {
        const dateNow = Date.now();
        if (dateNow - this.account.updated > deltaTime) {
          // expired
          this.account = undefined;
          this.expiredEvent.emit();
          return false;
        } else {
          this.account.renew();
          return true;
        }
      }
      this.expiredEvent.emit();
      return false;
    }
  }

  public static getAccount() {
    const isValid = this.isValid();
    if (!this.account || !isValid) {
      this.expiredEvent.emit();
      return undefined;
    }
    return this.account;
  }

  public static async previousRegistered() {
    return await Account.previousRegistered();
  }
}
