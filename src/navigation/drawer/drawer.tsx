import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, Theme} from '@react-navigation/native';
import Home from '../../views/home';
import AddItem from '../../views/add-item';
import ItemList from '../../views/item-list';

const DrawerNav = createDrawerNavigator();

interface iProps {
  theme?: Theme;
}

export default function DrawerNavigator(props: iProps) {
  return (
    <NavigationContainer theme={props.theme}>
      <DrawerNav.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: props.theme?.colors.background,
          },
        }}>
        <DrawerNav.Screen name="Home" component={Home} />
        <DrawerNav.Screen name="AddItem" component={AddItem} />
        <DrawerNav.Screen name="ItemList" component={ItemList} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
}
