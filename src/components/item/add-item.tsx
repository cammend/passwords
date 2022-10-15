import React, {useEffect, useState} from 'react';
import {Icon, SpeedDial} from '@rneui/themed';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Field from '../field';
import uuid from 'react-native-uuid';
import {FieldType, iFieldItem} from '../../interfaces/field/field.interface';
import {useNavigation} from '@react-navigation/native';
import {ItemListState} from '../../state/item-list/item-list.state';
import {ItemEncrypted} from '../../models/item/item.model';
import Session from '../../services/session';
import Button from '../button';
import {SnackControllerState} from '../../state/snack/snack.state';
import SystemError from '../../models/error/error.model';
import AddItemFieldModal from './add-item-field-modal';
import {useThemePaper} from '../../theme/use-theme';

export interface iAddItemProps {
  edit?: string;
  preview?: boolean;
  onAccept?: () => void;
}

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

const getEditItemOrNew = (edit: string, password: string) =>
  edit ? ItemListState.get(edit) : new ItemEncrypted(password);

const canSave = (fields: iFieldItem[]): boolean | SystemError => {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (!field.value) {
      return new SystemError(`El campo "${field.title}" está vacío.`);
    }
  }
  return true;
};

const editItemWithNewFields = (
  edit: string,
  item: ItemEncrypted,
  fields: iFieldItem[],
) =>
  item.editBit({
    fields: fields.map(f => ({
      ...f,
      uuid: edit ? uuid.v4().toString() : f.uuid,
      value: f.value || '',
    })),
  });

const updateItemList = (edit: string, item: ItemEncrypted) =>
  edit ? ItemListState.edit(item) : ItemListState.add(item);

const updateFieldValueByUUID = (
  fields: iFieldItem[],
  // eslint-disable-next-line @typescript-eslint/no-shadow
  uuid: string,
  value: string,
) => {
  fields.forEach(field => {
    if (field.uuid === uuid) {
      field.value = value;
    }
  });
};

const removeFieldByUUID = (
  fields: iFieldItem[],
  // eslint-disable-next-line @typescript-eslint/no-shadow
  uuid: string,
) => {
  return [...fields.filter(field => field.uuid !== uuid)];
};

const addNewFieldToFields = (
  fields: iFieldItem[],
  title: string,
  type?: FieldType,
) => {
  return [
    ...fields,
    {
      uuid: uuid.v4().toString(),
      title,
      type,
      removable: true,
    },
  ];
};

const getDefaultsFields = () =>
  defaults.map(i => ({...i, uuid: uuid.v4().toString()}));

export default function AddItemComponent(props: iAddItemProps) {
  const navigation = useNavigation();
  const [openAddField, setOpenAddField] = useState(false);
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [fieldTypeAdd, setFieldTypeAdd] = useState<FieldType>();
  const [fields, setFields] = useState<iFieldItem[]>([]);
  const [indexFocus] = useState(0);
  const themePaper = useThemePaper();

  const edit = props.edit || '';

  const onAccept = (value: string) => {
    setOpenDialogAdd(false);
    setFields(addNewFieldToFields(fields, value, fieldTypeAdd));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onChangeText = (uuid: string, value: string) => {
    updateFieldValueByUUID(fields, uuid, value);
    setFields(fields);
  };

  const handleDialogAdd = (type: FieldType) => {
    setOpenAddField(false);
    setOpenDialogAdd(true);
    setFieldTypeAdd(type);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleDeleteField = (uuid: string) => {
    setFields(removeFieldByUUID(fields, uuid));
  };

  const save = async () => {
    const account = await Session.getAccount();
    if (account) {
      const item = getEditItemOrNew(edit, account.password);
      const status = canSave(fields);

      if (status === true) {
        await editItemWithNewFields(edit, item, fields);
        await updateItemList(edit, item);
        props.onAccept?.();
        // ((navigation as any).replace as Function)('ItemList');
      } else {
        SnackControllerState.showError({
          message: (status as SystemError).message,
        });
      }
    } else {
      SnackControllerState.showError({message: 'Sesión expirada'});
    }
  };

  const init = async () => {
    const item = ItemListState.get(edit);
    if (item) {
      const bit = item.getRecentHistory();
      const fieldsBit = await item.getAllFieldsDecrypted(bit);
      setFields(fieldsBit);
    } else {
      setFields(getDefaultsFields());
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, props.edit]);

  return (
    <View style={styles.view}>
      <ScrollView style={styles.scroll}>
        <View style={styles.view1}>
          {fields.map((field, index) => (
            <Field
              key={field.uuid}
              inputProps={{
                autoFocus: index === indexFocus,
              }}
              preview={props.preview}
              title={field.title}
              type={field.type}
              onChangeText={value => onChangeText(field.uuid, value)}
              removable={field.removable}
              onDelete={() => handleDeleteField(field.uuid)}
              initialValue={field.value}
            />
          ))}

          {!props.preview && (
            <Button onPress={save}>{edit ? 'Editar' : 'Agregar'}</Button>
          )}
          {props.preview && <Button onPress={props.onAccept}>Aceptar</Button>}
        </View>
      </ScrollView>

      {!props.preview && (
        <>
          <SpeedDial
            isOpen={openAddField}
            color={themePaper.colors.primary}
            icon={{name: 'add', color: '#fff'}}
            openIcon={{name: 'close', color: '#fff'}}
            onOpen={() => setOpenAddField(!openAddField)}
            onClose={() => setOpenAddField(!openAddField)}>
            <SpeedDial.Action
              color={themePaper.colors.primary}
              icon={{name: 'import', color: '#fff', type: 'material-community'}}
              title="Texto"
              onPress={() => handleDialogAdd(FieldType.TEXT)}
            />
            <SpeedDial.Action
              color={themePaper.colors.primary}
              icon={{name: 'key', color: '#fff', type: 'material-community'}}
              title="Contraseña"
              onPress={() => handleDialogAdd(FieldType.PASSWORD)}
            />
          </SpeedDial>

          <AddItemFieldModal
            open={openDialogAdd}
            onClose={() => setOpenDialogAdd(false)}
            onAccept={onAccept}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scroll: {
    flex: 1,
    flexDirection: 'column',
  },
  view1: {
    flexGrow: 1,
    padding: 20,
  },
  view2: {
    flex: 1,
    flexGrow: 1,
  },
});
