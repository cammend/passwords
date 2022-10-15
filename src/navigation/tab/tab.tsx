import React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import ItemList from '../../views/item-list';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconButton} from '../../components/button';
import Settings from '../../views/settings';

const Tab = createBottomTabNavigator();

interface iProps {
  theme?: Theme;
}

export default function TabNavigator(props: iProps) {
  return (
    <NavigationContainer theme={props.theme}>
      <Tab.Navigator
        initialRouteName="ItemList"
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName = '';

            if (route.name === 'ItemList') {
              iconName = 'folder-key';
            } else if (route.name === 'Settings') {
              iconName = 'cog';
            }

            // You can return any component that you like here!
            return <IconButton icon={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="ItemList"
          component={ItemList}
          options={{title: 'Listado de items'}}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{title: 'Configuración'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
