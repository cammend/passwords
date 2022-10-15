import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Paragraph, Dialog, Portal, Provider} from 'react-native-paper';

export type ColorDialog = 'warning' | 'error' | 'info' | 'success';

interface iProps {
  visible: boolean;
  title: string;
  message: string;
  color: ColorDialog;
  onDismiss: () => void;
  onAccept: () => void;
  onCancel: () => void;
}

export default function DialogAcceptCancel(props: iProps) {
  if (!props.visible) {
    return null;
  }

  const color = props.color || 'info';
  const colorCss =
    color === 'info'
      ? '#9171ff'
      : color === 'warning'
      ? '#ffcb3e'
      : color === 'error'
      ? '#e14949'
      : '#53d972';

  const st = StyleSheet.create({
    view1: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    bg: {
      backgroundColor: colorCss,
    },
  });

  return (
    <View style={styles.view1}>
      <Provider>
        <Portal>
          <Dialog
            visible={props.visible}
            onDismiss={props.onDismiss}
            style={styles.dialog}>
            <Dialog.Title style={[st.bg, styles.title]}>
              {props.title}
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>{props.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.onCancel} style={styles.btn}>
                Cancelar
              </Button>
              <Button onPress={props.onAccept} mode="contained" style={st.bg}>
                Aceptar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    marginTop: 1,
    marginLeft: 1,
    marginRight: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 8,
    paddingBottom: 8,
    padding: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  btn: {
    marginRight: 15,
  },
  dialog: {
    // paddingLeft: 0,
    // paddingTop: 1,
    // paddingRight: 0,
  },
});
