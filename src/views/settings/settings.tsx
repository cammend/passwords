import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../../components/button';
import Session from '../../services/session';
import {ItemListState} from '../../state/item-list/item-list.state';

export default function Configuration() {
  const exportItemsPlain = async () => {
    const text = await ItemListState.getText(true);
    console.log(text);
  };

  const exportItemsCipher = async () => {
    const text = await ItemListState.getText();
    console.log(text);
  };

  return (
    <View style={styles.view}>
      <Button
        icon="location-exit"
        style={styles.button}
        onPress={() => Session.logout()}>
        Cerrar sesión
      </Button>

      <Button icon="file-key" style={styles.button} onPress={exportItemsCipher}>
        Exportar cifrado
      </Button>

      <Button icon="file" style={styles.button} onPress={exportItemsPlain}>
        Exportar en texto plano
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
  },
  button: {
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: 260,
    width: '100%',
    marginBottom: 20,
  },
});
