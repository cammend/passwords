/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import DrawerNavigator from './src/navigation/drawer';
import useTheme from './src/theme/use-theme';

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme();

  console.log('theme.colors.background', theme.colors.background);

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        // backgroundColor={backgroundStyle.backgroundColor}
      />
      <DrawerNavigator theme={theme} />
    </SafeAreaView>
  );
};

export default App;
