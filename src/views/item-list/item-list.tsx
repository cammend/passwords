import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {ItemListState} from '../../state/item-list/item-list.state';
import {ItemEncrypted} from '../../models/item/item.model';
import Session from '../../services/session';
import {AddItemModal, ItemPreview} from '../../components/item';
import Text from '../../components/text';
import {ItemMemo} from './item';
import Search from './search';
import {ScrollView} from 'react-native-gesture-handler';
import {Fab} from '../../components/button';
import {DialogAcceptCancelControllerState} from '../../state/dialog/dialog-accept-cancel.state';

export default function ItemList() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<{list: ItemEncrypted[]}>({list: []});

  // modal preview
  const [preview, setPreview] = useState({
    id: '',
    open: false,
  });

  const [itemState, setItemState] = useState({
    edit: '',
    open: false,
  });

  const closePreview = () => setPreview({...preview, open: false});

  const editItem = (id: string) => {
    setItemState({...itemState, open: true, edit: id});
  };

  const deleteItem = (id: string) => {
    const item = ItemListState.get(id);
    DialogAcceptCancelControllerState.showError({
      title: 'Eliminar item',
      message: `¿Seguro de eliminar el item: ${item.title}?`,
    }).then(response => {
      if (response.accept) {
        ItemListState.delete(id);
      }
    });
  };

  const load = async () => {
    const isValid = await Session.isValid();
    const account = Session.getAccount();
    if (isValid && account) {
      ItemListState.load(account.password).then(() => {
        setState({list: ItemListState.list});
        setLoading(false);
      });
    }
  };

  const onSearch = (text: string) => {
    const list = ItemListState.filter({search: text});
    setState({list});
  };

  useEffect(() => {
    load();

    const evt = ItemListState.updateEvent.on(() => {
      setState({list: ItemListState.list});
    });

    return () => {
      evt.off();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.view}>
        <View style={styles.viewLoading}>
          <Text style={styles.viewLoadingText}>Cargando...</Text>
          <ActivityIndicator animating={true} size={32} />
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.view}>
        <Search onChange={onSearch} style={styles.search} />

        {state.list.length > 0 && (
          <ScrollView>
            {state.list.map(item => (
              <ItemMemo
                key={item.id}
                title={item.title}
                id={item.id}
                onEdit={editItem}
                onDelete={deleteItem}
              />
            ))}
          </ScrollView>
        )}

        {state.list.length === 0 && (
          <View style={styles.view2}>
            <Text style={styles.text1}>No hay items disponibles</Text>
          </View>
        )}

        <Fab
          icon="plus"
          style={styles.fab}
          onPress={() => setItemState({...itemState, open: true})}
        />
      </View>

      <View style={styles.view3}>
        <ItemPreview
          viewId={preview.id}
          open={preview.open}
          onClose={closePreview}
        />

        <AddItemModal
          edit={itemState.edit}
          open={itemState.open}
          onClose={() => setItemState({...itemState, open: false, edit: ''})}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 15,
  },
  view1: {
    borderBottomWidth: 1,
  },
  view2: {
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  view3: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
  },
  text1: {
    fontSize: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  card: {
    marginBottom: 15,
  },
  search: {
    marginBottom: 15,
  },
  viewLoading: {
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  viewLoadingText: {
    marginBottom: 15,
  },
});
