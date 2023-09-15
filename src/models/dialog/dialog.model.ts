import {ColorDialog} from '../../components/dialog/dialog';

export interface iStateDialog {
  visible: boolean;
  color: ColorDialog;
  title: string;
  message: string;
  buttonCancel?: string;
  buttonAccept?: string;
  inputLabel?: string; // si viene, se muestra un input con placeholder usando esta variable
  inputValue?: string; // si se muestra el input, acá se guardará el resultado del input
  loading: Promise<boolean>;
}

interface iUpdateStateParams {
  state: iStateDialog;
  updateState: (v: iStateDialog) => void;
}

interface iShowParamsBase {
  title: string;
  message: string;
  inputLabel?: string; // si viene seteado, muestra un inputText, para ingresar un valor
}

interface iShowParams extends iShowParamsBase {
  color: ColorDialog;
}

interface iShowResponse {
  accept: boolean;
  inputValue?: string;
}

export default class DialogController {
  private controller?: iUpdateStateParams;
  private resolve: (v: any) => any = (v: any) => v;

  __updateState(params: iUpdateStateParams) {
    this.controller = params;
  }

  private __getResponse(accept: boolean): iShowResponse {
    return {accept, inputValue: this.controller?.state.inputValue};
  }

  __onAccept() {
    this.resolve(this.__getResponse(true));
  }

  __onCancel() {
    this.resolve(this.__getResponse(false));
  }

  show(params: iShowParams): Promise<iShowResponse> {
    if (this.controller && params.message && params.title) {
      this.controller.updateState({
        ...this.controller.state,
        ...params,
        visible: true,
      });
    }

    return new Promise(res => {
      this.resolve = res;
    });
  }

  showSuccess(params: iShowParamsBase) {
    return this.show({...params, color: 'success'});
  }

  showError(params: iShowParamsBase) {
    return this.show({...params, color: 'error'});
  }

  showWarning(params: iShowParamsBase) {
    return this.show({...params, color: 'warning'});
  }

  showInfo(params: iShowParamsBase) {
    return this.show({...params, color: 'info'});
  }
}
