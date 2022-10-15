import React from 'react';
import {TextInput} from 'react-native-paper';

export type TextInputProps = typeof TextInput.defaultProps;

export default function Input(props: TextInputProps) {
  return <TextInput {...props} mode={props?.mode || 'outlined'} />;
}
