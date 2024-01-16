import { Button, Modal } from 'antd';
import WarningMark from 'assets/images/waring.svg';
import { useCallback } from 'react';
import useGetState from 'store/state/getState';

import styles from './AddressError.module.css';
import React from 'react';

function AddressError({
  addresses,
  errorAddresses,
  visible,
  getContainer,
  onConfirm,
  onCancel,
}: {
  addresses?: string[];
  errorAddresses?: string[];
  visible?: boolean;
  getContainer?: () => HTMLElement;
  onConfirm?: (addresses: string[]) => void;
  onCancel?: () => void;
}) {
  const { infoState, aelfInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const handleConfirm = useCallback(() => {
    const temp = [...(addresses || [])];
    onConfirm?.(temp.filter((item) => !errorAddresses?.includes(item)));
  }, [addresses, errorAddresses, onConfirm]);
  return (
    <Modal
      zIndex={100000}
      getContainer={getContainer}
      open={visible}
      onCancel={onCancel}
      className={`forest-marketplace ${
        styles['address-error-modal']
      } forest-sale-warning-modal forest-sale-modal-footer ${
        isSmallScreen &&
        `${styles['address-error-modal-mobile']} forest-sale-modal-mobile forest-sale-modal-footer-mobile`
      }`}
      title="Error"
      footer={
        <>
          <Button onClick={handleConfirm}>OK</Button>
        </>
      }>
      <p
        className={`font-medium flex items-center tip ${
          isSmallScreen ? 'leading-[21px] text-[14px]' : 'leading-[24px] text-[16px]'
        }`}>
        <WarningMark />
        {`The addresses below are invalid and can't be added to the whitelist. Please enter the correct ${aelfInfo.curChain} SideChain addresses.`}
      </p>
      <div className="address-list">
        {errorAddresses?.map((address, index) => (
          <p className={'font-semibold text-[16px] leading-[24px]'} key={index}>
            {address}
          </p>
        ))}
      </div>
    </Modal>
  );
}

export default React.memo(AddressError);
