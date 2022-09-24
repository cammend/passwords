import crypto from 'crypto';

const algorithm = 'aes-192-cbc';

export default abstract class Cryptos {
  public static encrypt(
    password: string,
    dataToEncrypt: string,
  ): Promise<string> {
    return this.cryptoScrypt(dataToEncrypt, password);
  }

  public static decrypt(
    password: string,
    encryptedData: string,
  ): Promise<string> {
    return this.cryptoDecrypt(encryptedData, password);
  }

  public static encryptObject(password: string, dataToEncrypt: any) {
    const d = JSON.stringify(dataToEncrypt);
    return this.encrypt(password, d);
  }

  public static decryptObject<S>(password: string, encryptedData: string) {
    return this.decrypt(password, encryptedData).then(
      result => JSON.parse(result) as S,
    );
  }

  public static sha256(data: string): string {
    return this.hashSHA256(data);
  }

  private static cryptoScrypt(
    dataToEncrypt: string,
    password: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // legacy way
        var cipher = crypto.createCipher(algorithm, password);
        var crypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
        crypted += cipher.final('hex');
        resolve(crypted);
      } catch (error) {
        reject(error);
      }
    });
  }

  private static cryptoDecrypt(
    encryptedData: string,
    password: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // legacy way
        var decipher = crypto.createDecipher(algorithm, password);
        var dec = decipher.update(encryptedData, 'hex', 'utf8');
        dec += decipher.final('utf8');
        resolve(dec);
      } catch (error) {
        reject(error);
      }
    });
  }

  private static hashSHA256(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
