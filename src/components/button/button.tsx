import React from 'react';
import {Button as ButtonUI} from '@rneui/themed';
import {View} from 'react-native';

interface iProps {
  title?: string;
  onClick?: () => void;
}

export default function Button(props: iProps) {
  return (
    <View>
      <ButtonUI title={props.title} type="outline" onPress={props.onClick} />
    </View>
  );
}
