import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import FilePickerManager from 'react-native-file-picker';

const PATH_SEP = '/';

const ROOT_PATH = RNFS.ExternalStorageDirectoryPath;
const DOWNLOAD_PATH = RNFS.DownloadDirectoryPath;
const FOLDER_APP = 'Contraseñas';

export default abstract class ExternalStorage {
  public static getResultPath(path: string): string {
    return path.replace(ROOT_PATH + PATH_SEP, '');
  }

  public static async requestPermission(): Promise<void> {
    const error = () =>
      Promise.reject(
        new Error(
          'No se obtuvieron permisos para usar el almacenamiento externo',
        ),
      );
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Almacenamiento externo',
          message: 'Permisos para escribir archivos en almacenamiento externo',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        },
      );
      const status = granted === PermissionsAndroid.RESULTS.GRANTED;
      if (status) {
        return Promise.resolve();
      } else {
        return error();
      }
    } catch (err) {
      return error();
    }
  }

  public static createDirectory(
    name: string,
    path: string = '',
  ): Promise<string> {
    try {
      return new Promise(async (resolve, reject) => {
        const fullpath = path + PATH_SEP + name;
        ExternalStorage.requestPermission()
          .then(() => RNFS.mkdir(fullpath))
          .then(() => {
            resolve(fullpath);
          }, reject);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static async tryCreateAppDirectory(): Promise<string> {
    return this.createDirectory(FOLDER_APP, ROOT_PATH).catch(() =>
      this.createDirectory(FOLDER_APP, DOWNLOAD_PATH),
    );
  }

  public static createTextFile(
    pathDirectory: string,
    filename: string,
    content: string,
  ): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const fullpath = pathDirectory + PATH_SEP + filename;
        ExternalStorage.requestPermission()
          .then(() => RNFS.writeFile(fullpath, content))
          .then(() => {
            resolve(fullpath);
          }, reject);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static readTextFile(path: string): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        ExternalStorage.requestPermission()
          .then(() => RNFS.readFile(path, 'utf8'))
          .then(text => resolve(text), reject);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public static filePickerReadTextFile(): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        FilePickerManager.showFilePicker(result => {
          if (result.error) {
            return reject(result.error);
          }
          if (result.didCancel) {
            return resolve('');
          }
          ExternalStorage.readTextFile(result.uri)
            .then(content => resolve(content))
            .catch(e => reject(e));
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
