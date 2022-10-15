import React from 'react';
import {AddItem} from '.';
import Modal from '../modal';

interface iProps {
  open: boolean;
  onClose: () => void;
  viewId: string;
}

export default function AddItemPreviewComponent(props: iProps) {
  return (
    <Modal {...props}>
      <AddItem preview edit={props.viewId} onAccept={props.onClose} />
    </Modal>
  );
}
