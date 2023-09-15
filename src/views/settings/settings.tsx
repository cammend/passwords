import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import Button from '../../components/button';
import useAppData from '../../hooks/use-app-data';
import useImportExport from '../../hooks/use-import-export';
import useItemList from '../../hooks/use-item-list';
import Session from '../../services/session';

enum Action {
  LOGOUT = 1,
  EXPORT_CIPHER,
  EXPORT_PLAIN,
  IMPORT,
  REMOVE_ITEMS,
  REMOVE_APP_DATA,
}

const buttons = [
  {
    icon: 'location-exit',
    action: Action.LOGOUT,
    label: 'Cerrar sesión',
  },
  {
    icon: 'file-key',
    action: Action.EXPORT_CIPHER,
    label: 'Exportar cifrado',
  },
  {
    icon: 'file',
    action: Action.EXPORT_PLAIN,
    label: 'Exportar en texto plano',
  },
  {
    icon: 'file-import-outline',
    action: Action.IMPORT,
    label: 'Importar',
  },
  {
    icon: 'playlist-remove',
    action: Action.REMOVE_ITEMS,
    label: 'Eliminar listado de elementos',
  },
  {
    icon: 'data-matrix-remove',
    action: Action.REMOVE_APP_DATA,
    label: 'Eliminar datos de aplicación',
  },
];

export default function Configuration() {
  const [loading, setLoading] = useState(false);
  const {exportItems, importItems} = useImportExport();
  const {removeItemList} = useItemList();
  const {removeAppData} = useAppData();

  const process = (action: Action) => {
    setLoading(true);

    let promise = Promise.resolve();
    if (action === Action.LOGOUT) {
      promise = Session.logout();
    } else if (action === Action.EXPORT_CIPHER) {
      promise = exportItems(false);
    } else if (action === Action.EXPORT_PLAIN) {
      promise = exportItems(true);
    } else if (action === Action.IMPORT) {
      promise = importItems();
    } else if (action === Action.REMOVE_ITEMS) {
      promise = removeItemList();
    } else if (action === Action.REMOVE_APP_DATA) {
      promise = removeAppData();
    }

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <View style={styles.view}>
      <ScrollView>
        {buttons.map(button => (
          <Button
            key={button.label}
            icon={button.icon}
            style={styles.button}
            onPress={() => process(button.action)}>
            {button.label}
          </Button>
        ))}
      </ScrollView>

      {loading && (
        <View style={styles.view2}>
          <ActivityIndicator animating={true} style={styles.indicator} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
  },
  view2: {
    position: 'absolute',
    display: 'flex',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 99,
    backgroundColor: '#00000088',
  },
  indicator: {
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  button: {
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: 300,
    width: '100%',
    marginBottom: 20,
  },
});
