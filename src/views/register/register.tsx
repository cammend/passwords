import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import Snack from '../../components/snack';
import Session from '../../services/session';

interface iProps {
  onSuccessRegister?: (password: string) => void;
}

export default function Register(props: iProps) {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showSnack, setShowSnack] = useState(false);

  const register = async () => {
    if (password !== password2) {
      setShowSnack(true);
    } else {
      await Session.register(password);
      props.onSuccessRegister?.(password);
    }
  };

  return (
    <View style={styles.view}>
      <View style={styles.view1}>
        <Image
          style={styles.image}
          source={require('../../../assets/icon.png')}
        />
        <Input
          label="Contraseña:"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          autoFocus
          style={styles.input}
        />
        <Input
          label="Repetir contraseña:"
          secureTextEntry
          value={password2}
          onChangeText={text => setPassword2(text)}
          style={styles.input}
        />
        <Button onPress={register}>Registrarse</Button>
      </View>

      <Snack
        color="error"
        visible={showSnack}
        onDismiss={() => setShowSnack(false)}>
        Contraseñas no coinciden
      </Snack>
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
  text1: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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
