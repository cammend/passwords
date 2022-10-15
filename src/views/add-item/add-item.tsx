import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {AddItem as AddItemComponent} from '../../components/item';

export default function AddItem() {
  const route = useRoute();
  const [edit, setEdit] = useState('');

  useEffect(() => {
    setEdit((route.params as any)?.edit || '');
  }, [route]);

  return <AddItemComponent edit={edit} />;
}
