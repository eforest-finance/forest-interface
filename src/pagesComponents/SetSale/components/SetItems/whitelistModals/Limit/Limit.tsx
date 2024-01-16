import { Button, Modal } from 'antd';
import WarningMark from 'assets/images/waring.svg';

import styles from './Limit.module.css';
import useGetState from 'store/state/getState';
import React from 'react';

function LimitModal({
  visible,
  count,
  getContainer,
  onConfirm,
  onCancel,
}: {
  visible?: boolean;
  count?: number;
  getContainer?: () => HTMLElement;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  return (
    <Modal
      zIndex={1000000}
      title="Tips"
      open={visible}
      onCancel={onCancel}
      getContainer={getContainer}
      className={`forest-marketplace ${styles['limit-modal']} forest-sale-warning-modal forest-sale-modal-footer ${
        isSmallScreen && 'forest-sale-modal-mobile forest-sale-modal-footer-mobile'
      }`}
      footer={
        <>
          {count ? (
            <>
              <Button type="primary" onClick={onConfirm}>
                Confirm
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </>
          ) : (
            <Button onClick={onCancel}>OK</Button>
          )}
        </>
      }>
      <p className=" text-[20px] font-medium flex items-center justify-center mb-[32px]">
        {count
          ? `Only the first ${count} addresses can be added. Do you want to continue?`
          : 'The number of addresses added exceeds the limit.'}
      </p>
      <div className="tip text-[16px] font-medium leading-[24px] flex">
        <WarningMark />
        <p>A maximum of 100 addresses can be added. </p>
      </div>
    </Modal>
  );
}

export default React.memo(LimitModal);
