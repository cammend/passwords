import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {ItemListState} from '../../state/item-list/item-list.state';
import {ItemEncrypted} from '../../models/item/item.model';

export default function ItemList() {
  const navigation = useNavigation();
  const [state, setState] = useState<{list: ItemEncrypted[]}>({list: []});

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props: any) => <Text {...props}>Listado de elementos</Text>,
    });

    ItemListState.load().then(() => setState({list: ItemListState.list}));

    const evt = ItemListState.event.on(() => {
      console.log('ItemList effect');
      setState({list: ItemListState.list});
    });

    return () => {
      evt.off();
    };
  }, [navigation]);

  return (
    <View style={styles.view}>
      {state.list.map(item => (
        <Text key={item.id}>{item.history[0].fields[0].value}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
