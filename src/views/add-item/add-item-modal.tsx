import React, {useState} from 'react';
import {Dialog as DialogUI} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import Dialog from '../../components/dialog';
import Input from '../../components/input';

interface iProps {
  open: boolean;
  onClose: () => void;
  onAccept: (value: string) => void;
}

export default function AddItemModal(props: iProps) {
  const [value, setValue] = useState('');

  const onAccept = () => {
    props.onAccept(value);
    props.onClose();
    setValue('');
  };

  return (
    <Dialog isVisible={props.open} title="Nombre del campo">
      <Input value={value} onChangeText={setValue} />
      <DialogUI.Actions>
        <DialogUI.Button title="Aceptar" onPress={onAccept} />
        <DialogUI.Button title="Cancelar" onPress={props.onClose} />
      </DialogUI.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  view1: {
    marginLeft: 'auto',
    marginRight: 'auto',
    flexGrow: 1,
  },
  view2: {
    flex: 1,
    flexGrow: 1,
  },
});
