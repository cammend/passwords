import React from 'react';
import {StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';

export type ColorSnack = 'warning' | 'error' | 'info' | 'success';

type SnackbarProps = typeof Snackbar.defaultProps & {
  visible: boolean;
  onDismiss: () => void;
  color?: ColorSnack;
};

export default function Snack(props: SnackbarProps) {
  const color = props.color || 'info';
  const styles = StyleSheet.create({
    snack: {
      backgroundColor:
        color === 'info'
          ? '#9171ff'
          : color === 'warning'
          ? '#ffcb3e'
          : color === 'error'
          ? '#e14949'
          : '#53d972',
    },
  });
  return (
    <Snackbar {...props} style={[styles.snack, props.style]}>
      {props?.children}
    </Snackbar>
  );
}
