import React from 'react';
import {Input as InputUI, InputProps} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

interface iProps extends InputProps {}

export default function Input(props: iProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: theme.colors.text,
    },
  });

  return <InputUI {...props} style={[styles.text, props.style]} />;
}
