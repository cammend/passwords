import React from 'react';
import {Button as ButtonPaper} from 'react-native-paper';

type ButtonProps = typeof ButtonPaper.defaultProps;

export default function Button(props: ButtonProps) {
  return (
    <ButtonPaper {...props} mode={props?.mode || 'contained'}>
      {props?.children}
    </ButtonPaper>
  );
}
