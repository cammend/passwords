import React, {useState} from 'react';
import {iStateSnack} from '../../models/snack/snack.model';
import {SnackControllerState} from '../../state/snack/snack.state';
import Snack from './snack';

export default function SnackControllerComponent() {
  const [state, setState] = useState<iStateSnack>({
    visible: false,
    color: 'info',
    message: '',
  });

  SnackControllerState.__updateState({state, updateState: setState});

  return (
    <Snack
      color={state.color}
      visible={state.visible}
      onDismiss={() => setState({...state, visible: false})}>
      {state.message}
    </Snack>
  );
}
