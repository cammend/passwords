import React from 'react';
import {Appbar, Menu} from 'react-native-paper';

export default function PaperHeader(props: any) {
  const {back, navigation, options} = props;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const go = (view: string) => {
    navigation.navigate(view);
    closeMenu();
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="white" onPress={openMenu} />}>
        <Menu.Item onPress={() => go('AddItem')} title="Añadir Item" />
        <Menu.Item
          onPress={() => {
            console.log('Option 2 was pressed');
          }}
          title="Option 2"
        />
        <Menu.Item
          onPress={() => {
            console.log('Option 3 was pressed');
          }}
          title="Option 3"
          disabled
        />
      </Menu>
    </Appbar.Header>
  );
}
