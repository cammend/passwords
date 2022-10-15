import {ColorDialog} from '../../components/dialog/dialog';

export interface iStateDialog {
  visible: boolean;
  color: ColorDialog;
  title: string;
  message: string;
  buttonCancel?: string;
  buttonAccept?: string;
  loading: Promise<boolean>;
}

interface iUpdateStateParams {
  state: iStateDialog;
  updateState: (v: iStateDialog) => void;
}

interface iShowParamsBase {
  title: string;
  message: string;
}

interface iShowParams extends iShowParamsBase {
  color: ColorDialog;
}

export default class DialogController {
  private controller?: iUpdateStateParams;
  private resolve: (v: any) => any = (v: any) => v;

  __updateState(params: iUpdateStateParams) {
    this.controller = params;
  }

  __onAccept() {
    this.resolve(true);
  }

  __onCancel() {
    this.resolve(false);
  }

  show(params: iShowParams) {
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
