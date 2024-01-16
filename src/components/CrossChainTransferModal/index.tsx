import React from 'react';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export enum CrossChainTransferType {
  token = 'token',
  nft = 'nft',
}

interface IProps {
  onConfirm?: <T, R>(params?: T) => R | void;
  onClose?: <T, R>(params?: T) => R | void;
  type: CrossChainTransferType;
}

function CrossChainTransferModal({ onConfirm, onClose, type }: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const router = useRouter();

  const onClick = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      router.push('/asset');
      modal.hide();
    }
  };

  const footer = (
    <div className="w-full flex flex-col items-center">
      <Button
        type="primary"
        size="ultra"
        isFull={isSmallScreen ? true : false}
        className={`${!isSmallScreen && '!w-[256px]'}`}
        onClick={onClick}>
        Go to My Assets
      </Button>
    </div>
  );

  return (
    <Modal
      title="Cross-Chain Transfer"
      open={modal.visible}
      onOk={modal.hide}
      onCancel={() => {
        if (onClose) {
          onClose();
        } else {
          modal.hide();
        }
      }}
      afterClose={modal.remove}
      footer={footer}>
      <div className="flex justify-center mt-[24px] md:mt-0">
        <Image
          className="w-[243px] h-[460px] md:w-[169px] md:h-[320px]"
          alt="transfer gif"
          src={require(`assets/images/gif/${
            type === CrossChainTransferType.token ? 'transfer-token' : 'transfer-nft'
          }.gif`)}
        />
      </div>
    </Modal>
  );
}

export default NiceModal.create(CrossChainTransferModal);
