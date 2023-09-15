import React, {useState} from 'react';
import {iStateDialog} from '../../models/dialog/dialog.model';
import {DialogAcceptCancelControllerState} from '../../state/dialog/dialog-accept-cancel.state';
import DialogAcceptCancel from './dialog-accept-cancel';

export default function DialogAcceptCancelControllerComponent() {
  const [state, setState] = useState<iStateDialog>({
    title: '',
    visible: false,
    color: 'info',
    message: '',
    loading: Promise.resolve(false),
  });

  DialogAcceptCancelControllerState.__updateState({
    state,
    updateState: setState,
  });

  const handlerInputChangeText = (text: string) => {
    setState({...state, inputValue: text});
  };

  const resetState = () => {
    setState({
      ...state,
      visible: false,
      inputLabel: undefined,
      inputValue: undefined,
    });
  };

  const handlerAccept = () => {
    DialogAcceptCancelControllerState.__onAccept();
    resetState();
  };
  const handlerCancel = () => {
    DialogAcceptCancelControllerState.__onCancel();
    resetState();
  };

  return (
    <DialogAcceptCancel
      visible={state.visible}
      title={state.title}
      message={state.message}
      color={state.color}
      onDismiss={handlerCancel}
      onAccept={handlerAccept}
      onCancel={handlerCancel}
      inputLabel={state.inputLabel}
      handlerInputChangeText={handlerInputChangeText}
    />
  );
}
