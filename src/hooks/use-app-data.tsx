import {Account} from '../models/account/account.model';
import Session from '../services/session';
import {DialogAcceptCancelControllerState} from '../state/dialog/dialog-accept-cancel.state';
import {ItemListState} from '../state/item-list/item-list.state';
import {SnackControllerState} from '../state/snack/snack.state';

export default function useAppData() {
  const removeAppData = () => {
    return DialogAcceptCancelControllerState.showError({
      title: 'Eliminar datos de aplicación',
      message:
        '¿Seguro de eliminar todos los datos de aplicación?. ' +
        'Esto borrará la sesión y contraseña única, así como todos los elementos creados.',
    }).then(async response => {
      if (response.accept) {
        await ItemListState.clearList();
        await Account.remove();
        await Session.logout();
        SnackControllerState.showSuccess({
          message: 'Se eliminaron todos los datos de la aplicación',
        });
      } else {
        SnackControllerState.showError({
          message: 'Cancelado por el usuario',
        });
      }
    });
  };

  return {
    removeAppData,
  };
}
