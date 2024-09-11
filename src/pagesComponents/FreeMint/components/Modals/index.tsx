import { Modal } from 'antd';
import { useState } from 'react';
import Button from 'baseComponents/Button';
import { ImageEnhance } from 'components/ImgLoading/ImgLoadingEnhance';
import styles from './styles.module.css';
import LoadingImage from 'assets/images/v2/loading.png';
import Success from 'assets/images/v2/success.svg';
import Gif from 'assets/images/v2/icon_Referral.svg';
import Close from 'assets/images/v2/close.svg';

import Image from 'next/image';
import clsx from 'clsx';

export interface IDoubleCheckProps {
  open: boolean;
  name: string;
  file: any;
  onCreate: any;
  onClose?: any;
}

const DoubleCheck = (props: IDoubleCheckProps) => {
  const { name, file, open, onCreate, onClose } = props;

  return (
    <Modal
      title={<></>}
      open={open}
      closable={false}
      className={styles.modal}
      centered
      closeIcon={null}
      onCancel={onClose}
      footer={
        <div className="w-full flex justify-between px-[24px]">
          <Button className="flex-1 mr-[8px]" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" type="primary" onClick={onCreate}>
            Create
          </Button>
        </div>
      }>
      <div className="flex flex-col items-center px-[24px]">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-[140px] h-[140px]  flex justify-center items-center overflow-hidden rounded-md border border-solid border-lineBorder">
            <ImageEnhance
              src={
                file?.url ||
                'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png'
              }
              className="!rounded-none !w-full !h-full"
            />
          </div>
        </div>
        <div className="mt-[8px] text-[18px] font-semibold text-textPrimary">{name}</div>
        <div className="text-center text-textSecondary">
          Please double-check the information. Each account can only mint once.
        </div>
      </div>
    </Modal>
  );
};

const Creating = (props: { open: boolean }) => {
  const { open } = props;
  const onCancel = () => {
    // cancel
  };
  return (
    <Modal
      title={null}
      open={open}
      closable={false}
      className={styles.modal}
      closeIcon={null}
      onCancel={onCancel}
      centered
      footer={null}>
      <div className="flex flex-col items-center px-[24px] pt-[32px]">
        <Image
          src={LoadingImage}
          width={48}
          height={48}
          className={`animate-loading ${props.imgStyle}}`}
          alt="default loading image"
        />
        <div className="mt-[8px] text-[24px] font-semibold text-textPrimary">Creating NFT</div>
        <div className="mt-[24px] text-center text-textSecondary">
          Please do not close the page. This may take up to 30 seconds{' '}
        </div>
      </div>
    </Modal>
  );
};

const SuccessModal = (props: any) => {
  const { open, onCreate, onClose, nftInfo } = props;
  const { collectionName = '111', nftName = '111' } = nftInfo;
  const onCancel = () => {
    // go back to collection
  };
  const handleShare = () => {
    // go to X
  };
  return (
    <Modal
      title={<></>}
      open={open}
      className={styles.modal}
      closeIcon={<Close className="mt-16px" />}
      onCancel={onCancel}
      centered
      footer={null}>
      <div className="w-full h-full flex flex-col items-center relative">
        <div className="!w-[140px] h-[140px]  flex justify-center items-center overflow-hidden rounded-[20px] border border-solid border-lineBorder">
          <ImageEnhance
            src={
              'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png'
            }
            className="!rounded-none !w-full !h-full"
          />
        </div>
        <div className="mt-[8px] flex  items-center justify-center">
          <ImageEnhance
            src={
              'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1725863931780-QmUagFPoGyNvAJMy7ditDuX7hbqYmJfCmhXzHEjrGEiKku.png'
            }
            className="mr-[8px] overflow-hidden rounded-[4px] !w-[20px] !h-[20px]"
          />
          <p className={clsx('text-[14px] font-semibold text-textPrimary', styles['nft-list-card-text-ellipsis'])}>
            {collectionName}
          </p>
        </div>
        <div>
          <p
            className={clsx(
              'text-[18px] font-semibold text-textPrimary mt-[8px]',
              styles['nft-list-card-text-ellipsis'],
            )}>
            {nftName}
          </p>
        </div>

        <div className="flex flex-col items-center text-[24px] font-semibold mt-[32px]">
          <div className="w-[32px] h-[32px] mr-[16px]">{<Success />}</div>
          <div className="mt-[8px] text-[20px] font-semibold text-textPrimary ">NFT has been created!</div>
        </div>
        <Button
          className="!flex justify-center items-center mt-[32px] w-full h-[48px]  "
          type="primary"
          onClick={handleShare}>
          <Gif className="mr-[8px]" />
          Share on X!
        </Button>
        <div className="text-textSecondary text-center mt-[8px]">
          Get a mystery gift box on site using the tweet after sharing!
        </div>
      </div>
    </Modal>
  );
};

export { DoubleCheck, Creating, SuccessModal };
