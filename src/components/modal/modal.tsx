import React, {CSSProperties, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {BackHandler, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Modal, Portal, Provider} from 'react-native-paper';
import {useThemePaper} from '../../theme/use-theme';

// ScreenComponentType<ParamListBase, 'Modal'>;

interface iPropsBase {
  onClose: () => void;
  children: JSX.Element | [JSX.Element];
  styles?: {
    backdrop?: CSSProperties;
    body?: StyleProp<ViewStyle>;
  };
}

interface iProps extends iPropsBase {
  open: boolean;
}

export function ModalComponentBase(props: iPropsBase) {
  const theme = useThemePaper();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.onClose();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const st = StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.backdrop,
      padding: 20,
      flex: 1,
      borderRadius: 5,
    },
    style: {
      marginTop: 0,
    },
  });

  const contentContainerStyle: StyleProp<ViewStyle> = [st.modal];

  if (props.styles?.body) {
    contentContainerStyle.push(props.styles.body);
  }

  return (
    <Provider theme={theme}>
      <Portal>
        <Modal
          visible={true}
          onDismiss={props.onClose}
          contentContainerStyle={[st.modal, props.styles?.body]}
          style={st.style}>
          {props.children}
        </Modal>
      </Portal>
    </Provider>
  );
}

export default function ModalComponent(props: iProps) {
  const [visible, setVisible] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {open, ...otherProps} = props;

  useEffect(() => {
    setVisible(props.open);
  }, [props.open]);

  return <>{visible && <ModalComponentBase {...otherProps} />}</>;
}
