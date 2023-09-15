import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import Session from '../../services/session';
import SystemError from '../../models/error/error.model';
import {SnackControllerState} from '../../state/snack/snack.state';
import useAppData from '../../hooks/use-app-data';
import Text from '../../components/text';
import {useThemePaper} from '../../theme/use-theme';

interface iProps {
  onSuccessLogin?: (password: string) => void;
}

export default function Login(props: iProps) {
  const theme = useThemePaper();
  const [password, setPassword] = useState('');
  const {removeAppData} = useAppData();

  const login = async () => {
    // await ItemListState.clearList();
    return Session.login(password)
      .then(async () => {
        props.onSuccessLogin?.(password);
      })
      .catch((error: SystemError) => {
        SnackControllerState.showError({message: error.message});
      });
  };

  const removeAll = () => {
    removeAppData();
  };

  const st = StyleSheet.create({
    text: {
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.view}>
      <Text style={[styles.text, st.text]} onPress={removeAll}>
        Remover datos de aplicación
      </Text>
      <View style={styles.view1}>
        <Image
          style={styles.image}
          source={require('../../../assets/icon.png')}
        />
        <Input
          label="Ingrese la contraseña:"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          autoFocus
          style={styles.input}
        />
        <Button onPress={login}>Ingresar</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  view1: {
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    maxWidth: 300,
    padding: 15,
    width: '90%',
    paddingBottom: 60,
  },
  image: {
    height: 80,
    width: 80,
    marginBottom: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    marginBottom: 20,
  },
  text: {
    textAlign: 'right',
    marginTop: 30,
    marginRight: 20,
    fontSize: 18,
  },
});
