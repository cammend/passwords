import Aes from 'react-native-aes-crypto';

const ALGORITHM = 'aes-256-cbc';
const SALT = '8651129590d1436a87c790cec96e0aae';
const RAND = '46cf173f4da745ed9ab173eb9c2ca054';

export interface iCipherObject {
  cipher: string;
  iv: string;
}

export default abstract class Crypto {
  public static async encrypt(
    password: string,
    dataToEncrypt: string,
  ): Promise<iCipherObject> {
    const key = await this.aesGenerateKey(password);
    return this.aesEncrypt(dataToEncrypt, key);
  }

  public static async decrypt(
    password: string,
    encryptedData: iCipherObject,
  ): Promise<string> {
    const key = await this.aesGenerateKey(password);
    return this.aesDecrypt(encryptedData, key);
  }

  public static encryptObject(password: string, dataToEncrypt: any) {
    const d = JSON.stringify(dataToEncrypt);
    return this.encrypt(password, d);
  }

  public static decryptObject<S>(
    password: string,
    encryptedData: iCipherObject,
  ) {
    return this.decrypt(password, encryptedData).then(
      result => JSON.parse(result) as S,
    );
  }

  public static async hash256(text: string) {
    const key = await this.aesGenerateKey(RAND);
    return this.hmac256(text, key);
  }

  public static aesGenerateKey(
    password: string,
    salt = SALT,
    cost = 5000,
    length = 256,
  ) {
    return Aes.pbkdf2(password, salt, cost, length);
  }

  public static aesEncrypt(text: string, key: string): Promise<iCipherObject> {
    return Aes.randomKey(16).then(iv => {
      return Aes.encrypt(text, key, iv, ALGORITHM).then(cipher => ({
        cipher,
        iv,
      }));
    });
  }

  public static aesDecrypt(data: iCipherObject, key: string) {
    return Aes.decrypt(data.cipher, key, data.iv, ALGORITHM);
  }

  public static hmac256(cipher: string, key: string) {
    return Aes.hmac256(cipher, key);
  }
}
