import {DialogAcceptCancelControllerState} from '../state/dialog/dialog-accept-cancel.state';
import {ItemListState} from '../state/item-list/item-list.state';
import {SnackControllerState} from '../state/snack/snack.state';

export default function useItemList() {
  const removeItemList = () => {
    return DialogAcceptCancelControllerState.showError({
      title: 'Eliminar elementos guardados',
      message:
        '¿Seguro de eliminar todos los items guardados?. Estos cambios son irreversibles.',
    }).then(async response => {
      if (response.accept) {
        await ItemListState.clearList();
        SnackControllerState.showSuccess({
          message: 'Todos los registros se han eliminado',
        });
      } else {
        SnackControllerState.showError({
          message: 'Cancelado por el usuario',
        });
      }
    });
  };

  return {
    removeItemList,
  };
}
