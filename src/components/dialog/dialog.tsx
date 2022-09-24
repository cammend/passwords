import React from 'react';
import {Dialog as DialogUI, OverlayProps} from '@rneui/themed';
import {StyleSheet} from 'react-native';

interface iProps extends OverlayProps {
  title?: string;
}

export default function Dialog(props: iProps) {
  const {children, ...otherProps} = props;

  return (
    <DialogUI {...otherProps}>
      {!!props.title && <DialogUI.Title title={props.title} />}
      {children}
    </DialogUI>
  );
}

const styles = StyleSheet.create({
  view1: {
    marginLeft: 'auto',
    marginRight: 'auto',
    flexGrow: 1,
  },
  view2: {
    flex: 1,
    flexGrow: 1,
  },
});
