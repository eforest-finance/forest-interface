import React, { useState } from 'react';
import Modal from 'baseComponents/Modal';
import { inValidListErrorMessage } from '../utils/checkListValidity';
import { BatchDeListType, IListedNFTInfo } from 'contract/type';
import { INftInfo } from 'types/nftTypes';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useSelector } from 'store/store';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';
import { ImageEnhance } from 'components/ImgLoading';

function InValidListMsgModalConstructor({
  nftInfo,
  invalidList,
  validType,
  onRetry,
}: {
  nftInfo: INftInfo | null;
  invalidList?: IListedNFTInfo[];
  visible?: boolean;
  validType: BatchDeListType;
  onRetry?: () => void;
}) {
  const modal = useModal();
  useNiceModalCommonService(modal);
  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const [loading] = useState<boolean>(false);
  const { showRetryBtn } = useSelector((store) => store.sellModalsInfos.invalidListingModal);

  const tryAgain = () => {
    modal.resolve('retry');
    onRetry && onRetry();
  };

  return (
    <Modal
      title="Cancel Listing"
      width={550}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={
        showRetryBtn && (
          <Button
            loading={loading}
            type="primary"
            size="ultra"
            className={`${!isSmallScreen && '!w-[256px]'}`}
            onClick={tryAgain}>
            Try Again
          </Button>
        )
      }>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center">
          {nftInfo?.previewImage && (
            <ImageEnhance
              src={nftInfo?.previewImage}
              className="rounded-md mr-[16px] mdTW:mr-[26px] object-contain border border-solid border-lineBorder"
            />
          )}
          <div className="flex flex-col">
            <span className="font-medium text-base text-textSecondary">{nftInfo?.nftCollection?.tokenName}</span>
            <span className="font-semibold text-xl text-textPrimary mt-[4px]">{nftInfo?.tokenName}</span>
          </div>
        </div>

        {invalidList?.length && (
          <div className="font-medium text-base text-textSecondary">
            {invalidList?.length} {invalidList?.length === 1 ? 'Listing' : 'Listings'}
          </div>
        )}
      </div>
      <div className="mt-[24px] mdTW:mt-[50px] p-[24px] bg-fillHoverBg rounded-lg">
        <p className="text-textPrimary text-[18px] leading-[26px] font-medium">Go to your wallet</p>
        {walletInfo.portkeyInfo
          ? inValidListErrorMessage.portkey[validType].map((item, index) => {
              return (
                <p key={index} className="text-textSecondary text-base mt-[16px]">
                  {item}
                </p>
              );
            })
          : inValidListErrorMessage.default[validType].map((item, index) => {
              return (
                <p key={index} className="text-textSecondary text-base mt-[16px]">
                  {item}
                </p>
              );
            })}
      </div>
    </Modal>
  );
}

export const InValidListMsgModal = NiceModal.create(InValidListMsgModalConstructor);
