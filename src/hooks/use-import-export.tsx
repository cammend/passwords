import SystemError from '../models/error/error.model';
import ImportExport from '../services/import-export';
import Session from '../services/session';
import {DialogAcceptCancelControllerState} from '../state/dialog/dialog-accept-cancel.state';
import {SnackControllerState} from '../state/snack/snack.state';

export default function useImportExport() {
  const exportItems = (decrypted = true) => {
    return ImportExport.export(decrypted)
      .then(() => {
        SnackControllerState.showSuccess({
          message: 'Items exportados correctamente',
        });
      })
      .catch((error: SystemError) => {
        SnackControllerState.showError({
          message: error.message,
        });
      });
  };

  const importItems = () => {
    return ImportExport.loadDataFromFile()
      .then(async data => {
        console.log('\n\n---- INICIANDO EXPORTACIÓN ----');
        const account = await Session.getAccount();

        if (!account) {
          return SnackControllerState.showError({
            message: 'Sessión caducada',
          });
        }

        const password = account.password;

        if (data.isEncrypted) {
          const dialog = await DialogAcceptCancelControllerState.showInfo({
            title: 'Contraseña',
            message:
              'Ingrese la contraseña de desifrado de los items. ' +
              'Si no se ingresa una contraseña, se usará la contraseña actual.',
            inputLabel: 'Contraseña',
          });

          if (!dialog.accept) {
            return SnackControllerState.showError({
              message: 'Importación cancelada',
            });
          }

          const passwordEncryptedItems = dialog.inputValue || password;

          await ImportExport.getImportItemsFromDataLines(
            data.lines,
            password,
            passwordEncryptedItems,
          );
        } else {
          await ImportExport.getImportItemsFromDataLines(data.lines, password);
        }

        SnackControllerState.showSuccess({
          message: 'Items exportados correctamente',
        });

        console.log('---- TERMINANDO EXPORTACIÓN ----\n\n');
      })
      .catch((error: SystemError) => {
        SnackControllerState.showError({
          message: error.message,
        });
      });
  };

  return {
    exportItems,
    importItems,
  };
}
