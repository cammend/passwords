import {useColorScheme} from 'react-native';
import {DarkTheme, DefaultTheme} from '@react-navigation/native';

export const MyDefaultTheme = {
  colors: {},
};

export const MyDarkTheme = {
  colors: {
    background: '#222934',
    primary: '#99860d',
    text: '#eeeeff',
    border: '#272b44',
  },
};

export default function useTheme() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  console.log('isDarkMode', isDarkMode);

  const dark = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...MyDarkTheme.colors,
    },
  };

  const light = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...MyDefaultTheme.colors,
    },
  };

  return isDarkMode ? dark : light;
}
