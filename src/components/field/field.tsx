import React, {useState} from 'react';
import {Icon} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Input, {InputProps} from '../input';
import {FieldType} from '../../interfaces/field/field.interface';
import {IconButton, TextInput} from 'react-native-paper';

interface iProps {
  title: string;
  type?: FieldType;
  onChangeText?: (value: string) => void;
  removable?: boolean;
  onDelete?: () => void;
  initialValue?: string;
  inputProps?: InputProps;
  preview?: boolean;
}

export function Field(props: iProps) {
  const [value, setValue] = useState(props.initialValue || '');
  const [secureTextEntry, setsecureTextEntry] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleChangeText = (value: string) => {
    setValue(value);
    props.onChangeText?.(value);
  };

  console.log('render field', props.title, props.type, secureTextEntry);

  return (
    <View style={styles.view2}>
      <View style={styles.view3}>
        <Input
          {...props.inputProps}
          label={props.title}
          secureTextEntry={
            props.type === FieldType.PASSWORD ? secureTextEntry : false
          }
          mode="outlined"
          onChangeText={handleChangeText}
          value={value}
          disabled={props.preview}
          right={
            props.type === FieldType.PASSWORD ? (
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setsecureTextEntry(!secureTextEntry)}
              />
            ) : null
          }
        />
      </View>
      {props.removable && (
        <View style={styles.view4}>
          <IconButton icon="delete" size={24} onPress={props.onDelete} />
          {/* <TouchableOpacity onPress={props.onDelete}>
            <Icon name="delete" size={24} color="white" />
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view2: {
    flexDirection: 'row',
    display: 'flex',
    marginBottom: 15,
  },
  view3: {
    flexGrow: 1,
    position: 'relative',
  },
  view4: {
    marginLeft: 5,
    justifyContent: 'center',
    position: 'absolute',
    top: 5,
    bottom: 0,
    right: -45,
  },
});
