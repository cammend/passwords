import React from 'react';
import {AddItem} from '.';
import Modal from '../modal';
import {iAddItemProps} from './add-item';

interface iProps extends iAddItemProps {
  open: boolean;
  onClose: () => void;
}

export default function AddItemModalComponent(props: iProps) {
  return (
    <Modal {...props} styles={{body: {padding: 10, margin: 0, flex: 1}}}>
      <AddItem {...props} onAccept={props.onClose} />
    </Modal>
  );
}
