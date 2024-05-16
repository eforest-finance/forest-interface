import { ImageEnhance } from 'components/ImgLoading';
import { useRouter } from 'next/navigation';
import { useMount } from 'react-use';
import styles from './style.module.css';
import useGetState from 'store/state/getState';
import Modal, { ModalProps } from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import Jump from 'assets/images/detail/jump.svg';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';

interface IBatchCreatedSuccessModalProps extends ModalProps {
  logoImage?: string;
  collectionLogoImage?: string;
  collectionName?: string;
  title?: string;
  explorerUrl?: string;
}

const aProps = { target: '_blank', rel: 'noreferrer' };

function BatchCreateNFTSuccessModalContructor(props: IBatchCreatedSuccessModalProps) {
  const { logoImage, collectionName, collectionLogoImage, explorerUrl } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const nav = useRouter();
  useMount(() => {
    nav.prefetch('/account#Created');
  });

  const modal = useModal();
  useNiceModalCommonService(modal);

  const footer = (
    <div className="flex flex-1 flex-col items-center">
      <Button
        loading={false}
        type="primary"
        size="ultra"
        className={`${!isSmallScreen ? '!w-[256px]' : 'w-full'}`}
        onClick={() => {
          modal.hide();
          nav.push('/account#Created');
        }}>
        View Item in Collection
      </Button>
      {!isSmallScreen ? (
        <a href={explorerUrl} {...aProps} className="flex justify-center items-center text-textSecondary mt-4">
          View on aelf Explorer <Jump className="fill-textSecondary w-4 h-4 ml-2" />
        </a>
      ) : null}
    </div>
  );

  return (
    <Modal
      {...props}
      footer={footer}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      maskClosable={false}
      closable={false}
      className={`${styles['sync-chain-modal']} ${isSmallScreen && styles['sync-chain-modal-mobile']}`}>
      <div className="flex flex-col  h-full">
        <div className="flex flex-1 flex-col items-center">
          <div className="w-[128Px] h-[128Px] rounded-lg overflow-hidden">
            {logoImage ? (
              <ImageEnhance
                src={logoImage}
                alt="token icon"
                width={128}
                height={128}
                className="!w-32 !h-32 !rounded-lg object-cover"></ImageEnhance>
            ) : null}
          </div>
          <div className="flex gap-x-1 items-center mt-4">
            <ImageEnhance src={collectionLogoImage} alt="token icon" className="!w-6 !h-6 !rounded object-cover" />
            <span className="text-[16px] mt-[16px] mb-[16px]">{collectionName}</span>
          </div>
          <span className=" text-2xl text-textPrimary mt-12 font-semibold">{`You've created NFT in batch`}</span>
        </div>

        {isSmallScreen ? (
          <a href={explorerUrl} {...aProps} className="flex mb-4 justify-center items-center text-textSecondary">
            View on aelf Explorer <Jump className="fill-textSecondary w-4 h-4 ml-2" />
          </a>
        ) : null}
      </div>
    </Modal>
  );
}

export const BatchCreateNFTSuccessModal = NiceModal.create(BatchCreateNFTSuccessModalContructor);
