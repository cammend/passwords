import React, {useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Searchbar} from 'react-native-paper';

interface iProps {
  onChange: (text: string) => void;
  style?: StyleProp<ViewStyle>;
}

let timeout: any;

export default function Search(props: iProps) {
  const [value, setValue] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleChangeText = (value: string) => {
    setValue(value);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      props.onChange(value);
    }, 1000);
  };

  return (
    <Searchbar
      placeholder="Buscar"
      onChangeText={handleChangeText}
      value={value}
      style={props.style}
    />
  );
}
