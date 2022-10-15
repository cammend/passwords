import React from 'react';
import {NavigationContainer, Theme} from '@react-navigation/native';
import Home from '../../views/home';
import AddItem from '../../views/add-item';
import ItemList from '../../views/item-list';
import Login from '../../views/login';
import Register from '../../views/register';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaperHeader from './paper-header';

const Stack = createNativeStackNavigator();

interface iProps {
  theme?: Theme;
}

export default function StackNavigator(props: iProps) {
  return (
    <NavigationContainer theme={props.theme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: p => <PaperHeader {...p} />,
        }}>
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Home - Home'}}
          />
          <Stack.Screen
            name="AddItem"
            component={AddItem}
            options={{title: 'Añadir Item'}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Entrar'}}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{title: 'Registrarse'}}
          />
          <Stack.Screen
            name="ItemList"
            component={ItemList}
            options={{title: 'Listado'}}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          {/* <Stack.Screen name="Modal" component={Modal} /> */}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
