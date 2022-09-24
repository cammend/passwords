import React from 'react';
import {Text as TextUI, TextProps} from '@rneui/themed';

interface iProps extends TextProps {}

export default function Text(props: iProps) {
  return <TextUI {...props} />;
}
