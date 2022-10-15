import {ColorSnack} from '../../components/snack/snack';

export interface iStateSnack {
  visible: boolean;
  color: ColorSnack;
  message: string;
}

interface iUpdateStateParams {
  state: iStateSnack;
  updateState: (v: iStateSnack) => void;
}

interface iShowParamsBase {
  message: string;
}

interface iShowParams extends iShowParamsBase {
  color: ColorSnack;
}

export default class SnackController {
  private controller?: iUpdateStateParams;

  __updateState(params: iUpdateStateParams) {
    this.controller = params;
  }

  show(params: iShowParams) {
    if (this.controller && params.message) {
      this.controller.updateState({
        ...this.controller.state,
        ...params,
        visible: true,
      });
    }
  }

  showSuccess(params: iShowParamsBase) {
    this.show({...params, color: 'success'});
  }

  showError(params: iShowParamsBase) {
    this.show({...params, color: 'error'});
  }

  showWarning(params: iShowParamsBase) {
    this.show({...params, color: 'warning'});
  }

  showInfo(params: iShowParamsBase) {
    this.show({...params, color: 'info'});
  }
}
