import { Modal } from 'antd';
import { useState } from 'react';
import Button from 'baseComponents/Button';
import { ImageEnhance } from 'components/ImgLoading/ImgLoadingEnhance';
import styles from './styles.module.css';
import LoadingImage from 'assets/images/v2/loading.png';
import Success from 'assets/images/v2/success.svg';
import X from 'assets/images/v2/X_logo.svg';
import Close from 'assets/images/v2/close.svg';

import { useRouter } from 'next/navigation';

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
      className={`${styles.modal} ${styles.doubleCheckModal}`}
      centered
      closeIcon={null}
      onCancel={onClose}
      footer={
        <div className="w-full flex justify-between px-[24px]">
          <Button className="flex-1 mr-[8px] !bg-lineDividers border-0" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" type="primary" onClick={onCreate}>
            Create
          </Button>
        </div>
      }>
      <div className="flex flex-col items-center px-[24px]">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-[150px] h-[150px]  flex justify-center items-center overflow-hidden rounded-md ">
            <ImageEnhance src={file?.url} className="!rounded-none  h-[150px] object-contain" />
          </div>
        </div>
        <div className="text-center w-full mt-[8px] text-[18px] font-semibold text-textPrimary">{name}</div>
        <div className=" text-textSecondary mt-[24px]">
          <div className="text-left text-[12px] list-disc leading-[20px]">
            Each account can mint once for this campaign.
          </div>
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
          Please do not close the page. This may take up to 30 seconds
        </div>
      </div>
    </Modal>
  );
};

const SuccessModal = (props: any) => {
  const { open, onCreate, onClose, nftInfo = {} } = props;
  console.log('nftInfo:', nftInfo);
  const navigator = useRouter();

  const { collectionName, nftName, collectionId, collectionIcon, nftIcon } = nftInfo;

  const onCancel = () => {
    // go back to collection
    onClose();
    navigator.push(`/explore-items/${collectionId}`);
  };
  const handleShare = () => {
    const url = encodeURIComponent(`${location.href}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        'Just minted my AI-generated masterpiece with @StabilityW_AI and @aelfblockchain! 🚀🖼️✨ Mint yours and join the #AI2NFT revolution! 🌍🔥 Check it out on eforest.finance 🌿 #AI2NFT',
      )}&url=${url}`,
    );
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
        <div className="!w-[150px] h-[150px]  flex justify-center items-center overflow-hidden rounded-[20px]">
          <ImageEnhance src={nftIcon} className="!rounded-none !w-full  h-[150px] object-contain" />
        </div>
        <div className="mt-[8px] flex  items-center justify-center">
          <ImageEnhance src={collectionIcon} className="mr-[8px] overflow-hidden rounded-[4px] !w-[20px] !h-[20px]" />
          <p className={clsx('text-[14px] font-semibold text-textPrimary', styles['nft-list-card-text-ellipsis'])}>
            {collectionName}
          </p>
        </div>
        <div className="w-full">
          <p
            className={clsx(
              'w-full text-center text-[18px] font-semibold text-textPrimary mt-[8px]',
              styles['nft-list-card-text-ellipsis'],
            )}>
            {nftName}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center text-[24px] font-semibold mt-[24px]">
          <div className="w-[32px] h-[32px]">{<Success />}</div>
          <div className="mt-[8px] lg:mt-0 lg:ml-[8px] text-[20px] font-semibold text-textPrimary ">
            NFT has been created!
          </div>
        </div>
        <Button
          className="!flex justify-center items-center mt-[24px] w-full h-[48px] lg:w-[256px]"
          type="primary"
          onClick={handleShare}>
          <X className="mr-[8px]" />
          Share on X!
        </Button>
      </div>
    </Modal>
  );
};

export { DoubleCheck, Creating, SuccessModal };
