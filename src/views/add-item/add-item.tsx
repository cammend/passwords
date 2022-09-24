import React, {useEffect, useState} from 'react';
import {Icon, SpeedDial} from '@rneui/themed';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Field from '../../components/field';
import AddItemModal from './add-item-modal';
import uuid from 'react-native-uuid';
import {FieldType, iFieldItem} from '../../interfaces/field/field.interface';
import {useNavigation} from '@react-navigation/native';
import {ItemListState} from '../../state/item-list/item-list.state';
import {ItemEncrypted} from '../../models/item/item.model';

interface iProps {}

type iFieldItemDefault = Omit<iFieldItem, 'uuid'>;

const defaults: iFieldItemDefault[] = [
  {
    title: 'Título',
  },
  {
    title: 'Usuario',
    removable: true,
  },
  {
    title: 'Contraseña',
    type: FieldType.PASSWORD,
    removable: true,
  },
];

export default function AddItem(props: iProps) {
  const navigation = useNavigation();
  const [openAddField, setOpenAddField] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [fieldTypeAdd, setFieldTypeAdd] = useState<FieldType>();
  const [fields, setFields] = useState<iFieldItem[]>(
    defaults.map(i => ({...i, uuid: uuid.v4().toString()})),
  );

  const onAccept = (value: string) => {
    setOpenDialogAdd(false);
    setFields([
      ...fields,
      {
        uuid: uuid.v4().toString(),
        title: value,
        type: fieldTypeAdd,
        removable: true,
      },
    ]);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onChangeText = (uuid: string, value: string) => {
    fields.forEach(field => {
      if (field.uuid === uuid) {
        field.value = value;
      }
    });
    setFields(fields);
  };

  const handleDialogAdd = (type: FieldType) => {
    setOpenAddField(false);
    setOpenDialogAdd(true);
    setFieldTypeAdd(type);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleDeleteField = (uuid: string) => {
    setFields([...fields.filter(field => field.uuid !== uuid)]);
  };

  const save = async () => {
    const item = new ItemEncrypted();
    item.editBit({
      fields: fields.map(f => ({
        id: f.uuid,
        name: f.title,
        value: f.value || '',
      })),
    });
    await ItemListState.add(item);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <Icon name="save" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <View style={styles.view1}>
      {fields.map(field => (
        <Field
          key={field.uuid}
          title={field.title}
          type={field.type}
          onChangeText={value => onChangeText(field.uuid, value)}
          removable={field.removable}
          onDelete={() => handleDeleteField(field.uuid)}
        />
      ))}

      <SpeedDial
        isOpen={openAddField}
        icon={{name: 'add', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpenAddField(!openAddField)}
        onClose={() => setOpenAddField(!openAddField)}>
        <SpeedDial.Action
          icon={{name: 'import', color: '#fff', type: 'material-community'}}
          title="Texto"
          onPress={() => handleDialogAdd(FieldType.TEXT)}
        />
        <SpeedDial.Action
          icon={{name: 'key', color: '#fff', type: 'material-community'}}
          title="Contraseña"
          onPress={() => handleDialogAdd(FieldType.PASSWORD)}
        />
      </SpeedDial>

      <AddItemModal
        open={openDialogAdd}
        onClose={() => setOpenDialogAdd(false)}
        onAccept={onAccept}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    flexGrow: 1,
  },
  view2: {
    flex: 1,
    flexGrow: 1,
  },
});
