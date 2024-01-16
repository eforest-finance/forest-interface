import { Button, Modal } from 'antd';
import React from 'react';

import useGetState from 'store/state/getState';

function DeleteConfirm({
  visible,
  type,
  getContainer,
  onCancel,
  onDelete,
}: {
  visible?: boolean;
  type?: 'address' | 'rank';
  getContainer?: () => HTMLElement;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  return (
    <Modal
      zIndex={1000000}
      open={visible}
      title="Delete"
      onCancel={onCancel}
      getContainer={getContainer}
      className={`forest-marketplace forest-sale-warning-modal forest-sale-modal-footer ${
        isSmallScreen && `forest-sale-modal-mobile forest-sale-modal-footer-mobile`
      }`}
      footer={
        <>
          <Button onClick={onDelete} type="primary">
            Delete
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </>
      }>
      <p className="flex items-center justify-center text-[20px] font-medium text-center">
        Are you sure you want to delete the {type} ?
      </p>
    </Modal>
  );
}

export default React.memo(DeleteConfirm);
