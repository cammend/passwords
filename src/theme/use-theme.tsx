import {useColorScheme} from 'react-native';
import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {
  DefaultTheme as DefaultThemePaper,
  DarkTheme as DarkDefaultThemePaper,
} from 'react-native-paper';

export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#333',
    background: '#ccf',
    border: '#777',
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    text: '#eee',
    background: '#252526',
    border: '#aaaaaa11',
  },
};

const LightThemePaper = {
  ...DefaultThemePaper,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultThemePaper.colors,
    text: MyLightTheme.colors.text,
    background: MyLightTheme.colors.background,
    backdrop: '#aad',
    primary: '#ef7c45',
    // primary: '#3498db',
    // secondary: '#f1c40f',
    // tertiary: '#a1b2c3',
  },
};

const DarkThemePaper = {
  ...DarkDefaultThemePaper,
  roundness: 2,
  version: 3,
  colors: {
    ...DarkDefaultThemePaper.colors,
    text: MyDarkTheme.colors.text,
    background: MyDarkTheme.colors.background,
    backdrop: '#303033',
    primary: '#ef7c45',
    // primary: '#3498db',
    // secondary: '#f1c40f',
    // tertiary: '#a1b2c3',
  },
};

export default function useTheme() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  return isDarkMode ? MyDarkTheme : MyLightTheme;
  // return isDarkMode ? MyLightTheme : MyDarkTheme;
}

export function useThemePaper() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';
  return isDarkMode ? DarkThemePaper : LightThemePaper;
  // return isDarkMode ? LightThemePaper : DarkThemePaper;
}
