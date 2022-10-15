import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Card, Paragraph, Title} from 'react-native-paper';
import Button from '../../components/button';
import {iItemEncryptedBit} from '../../interfaces/item/item.interface';
import {ItemEncrypted} from '../../models/item/item.model';
import {ItemListState} from '../../state/item-list/item-list.state';

interface iPropsRight {
  onEdit: () => void;
  onDelete: () => void;
}

interface iProps {
  id: string;
  title: string;
  icon?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LeftContent = (props: any, icon?: string) => (
  <Avatar.Icon {...props} icon={icon || 'key'} />
);

const RightContent = (props: iPropsRight) => {
  const iconSize = 28;
  return (
    <View style={styles.right}>
      <TouchableOpacity onPress={props.onDelete}>
        <Avatar.Icon
          icon={'delete'}
          size={iconSize}
          style={styles.rightButton}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onEdit}>
        <Avatar.Icon
          icon={'lead-pencil'}
          size={iconSize}
          style={styles.rightButton}
        />
      </TouchableOpacity>
    </View>
  );
};

const getDate = (time: number) => {
  const date = new Date();
  date.setTime(time);
  return format(date, 'dd/MM/yyyy');
};

const getTime = (time: number) => {
  const date = new Date();
  date.setTime(time);
  return format(date, 'HH:mm:ss');
};

// modifier = 0: current Item, modifier = 1: next Item, modifier = -1: previous Item
const getBitDecrypted = async (
  item: ItemEncrypted,
  modifier = 0,
  reset = false,
) => {
  const bit =
    modifier < 0
      ? await item.getPreviousItemBitDecrypted()
      : modifier > 0
      ? await item.getNextItemBitDecrypted()
      : await item.getCurrentItemBitDecrypted(reset);
  if (bit) {
    const items = bit.fields
      .filter((e, i) => i !== 0) // delete first field (title)
      .map(d => ({label: d.title, value: d.value}));
    return {bit, items};
  }
  return null;
};

export default function Item(props: iProps) {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<{label: string; value: string}[]>([]);
  const [bit, setBit] = useState<iItemEncryptedBit | null>();
  const [item, setItem] = useState<ItemEncrypted | null>();

  const loadItemBit = async (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    item: ItemEncrypted | null | undefined,
    modifier = 0,
    reset = false,
  ) => {
    if (item) {
      const data = await getBitDecrypted(item, modifier, reset);
      if (data) {
        setFields(data.items);
        setBit(data.bit);
      }
    }
  };

  const handleClick = async () => {
    await loadItemBit(item, 0, true);
    setOpen(!open);
  };

  const previous = () => {
    loadItemBit(item, -1);
  };

  const next = () => {
    loadItemBit(item, 1);
  };

  const init = async () => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const item = await ItemListState.get(props.id);
    setItem(item);
    if (open) {
      loadItemBit(item, 0, true);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title]);

  return (
    <>
      <Card style={styles.card} mode="outlined">
        <TouchableOpacity onPress={handleClick}>
          <Card.Title
            title={props.title}
            subtitle={props.id}
            left={params => LeftContent(params, props.icon)}
            right={
              open
                ? () =>
                    RightContent({
                      onEdit: () => props.onEdit(props.id),
                      onDelete: () => props.onDelete(props.id),
                    })
                : undefined
            }
          />
        </TouchableOpacity>
        {open && (
          <Card.Content>
            {fields.map((field, index) => (
              <View key={index}>
                <Title>{field.label}</Title>
                <Paragraph>{field.value}</Paragraph>
              </View>
            ))}
            {!!bit && !!item && (
              <View style={styles.viewControls}>
                <Button disabled={!item.hasPrevious()} onPress={previous}>
                  Anterior
                </Button>
                <View style={styles.dateView}>
                  <Paragraph style={styles.date}>
                    {getDate(bit.creation)}
                  </Paragraph>
                  <Paragraph style={styles.date}>
                    {getTime(bit.creation)}
                  </Paragraph>
                </View>
                <Button disabled={!item.hasNext()} onPress={next}>
                  Siguiente
                </Button>
              </View>
            )}
          </Card.Content>
        )}
      </Card>
    </>
  );
}

const ItemMemo = React.memo(Item);
export {ItemMemo};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  right: {
    flexDirection: 'row',
  },
  rightButton: {
    marginRight: 10,
  },
  menu: {
    marginLeft: -100,
  },
  viewControls: {
    flexDirection: 'row',
    marginTop: 15,
  },
  date: {
    marginBottom: 0,
    textAlign: 'center',
    // borderColor: 'white',
    // borderWidth: 1,
  },
  dateView: {
    flexGrow: 1,
  },
});
