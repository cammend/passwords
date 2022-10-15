import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import Session from '../../services/session';
import SystemError from '../../models/error/error.model';
import {SnackControllerState} from '../../state/snack/snack.state';

interface iProps {
  onSuccessLogin?: (password: string) => void;
}

export default function Login(props: iProps) {
  const [password, setPassword] = useState('');

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

  return (
    <View style={styles.view}>
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
  },
  image: {
    height: 100,
    width: 100,
    marginBottom: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    marginBottom: 20,
  },
});
