import React from 'react';
import {IconButton as IconButtonPaper} from 'react-native-paper';

type IconButtonProps = typeof IconButtonPaper.defaultProps & {
  icon: string;
};

export default function IconButton(props: IconButtonProps) {
  return <IconButtonPaper {...props} />;
}
