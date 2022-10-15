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
import useTheme, {useThemePaper} from './src/theme/use-theme';
import {Provider as PaperProvider} from 'react-native-paper';
import {SnackController} from './src/components/snack';
import MainView from './src/views/main';
import {DialogAcceptCancelController} from './src/components/dialog';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme();
  const themePaper = useThemePaper();

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
    flex: 1,
  };

  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({fade: true});
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <PaperProvider theme={themePaper}>
        <MainView theme={theme} />
        <SnackController />
        <DialogAcceptCancelController />
      </PaperProvider>
    </SafeAreaView>
  );
};

export default App;
