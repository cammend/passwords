import React from 'react';
import {Text as TextPaper} from 'react-native-paper';

type TextProps = typeof TextPaper.defaultProps;

export default function Text(props: TextProps) {
  return <TextPaper {...props} />;
}
