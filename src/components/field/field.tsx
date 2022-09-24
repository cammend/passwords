import React, {useState} from 'react';
import {Text, Icon} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Input from '../input';
import {FieldType} from '../../interfaces/field/field.interface';

interface iProps {
  title: string;
  type?: FieldType;
  onChangeText?: (value: string) => void;
  removable?: boolean;
  onDelete?: () => void;
}

export function Field(props: iProps) {
  const [value, setValue] = useState('');
  const [secureTextEntry, setsecureTextEntry] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleChangeText = (value: string) => {
    setValue(value);
    props.onChangeText?.(value);
  };

  return (
    <View>
      <Text h4 style={styles.text}>
        {props.title}
      </Text>
      <View style={styles.view2}>
        <View style={styles.view3}>
          {props.type === FieldType.PASSWORD ? (
            <Input
              placeholder={props.title}
              style={styles.input}
              secureTextEntry={secureTextEntry}
              onChangeText={handleChangeText}
              value={value}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setsecureTextEntry(!secureTextEntry)}>
                  {secureTextEntry ? (
                    <Icon name="visibility-off" size={24} color="white" />
                  ) : (
                    <Icon name="visibility" size={24} color="white" />
                  )}
                </TouchableOpacity>
              }
            />
          ) : (
            <>
              <Input
                placeholder={props.title}
                onChangeText={handleChangeText}
                value={value}
              />
            </>
          )}
        </View>
        {props.removable && (
          <View style={styles.view4}>
            <TouchableOpacity onPress={props.onDelete}>
              <Icon name="delete" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: -10,
    color: 'white',
  },
  input: {
    color: 'white',
    paddingBottom: 0,
  },
  view2: {
    flexDirection: 'row',
    display: 'flex',
  },
  view3: {
    flexGrow: 1,
  },
  view4: {
    marginRight: 10,
    marginTop: 12,
  },
});
