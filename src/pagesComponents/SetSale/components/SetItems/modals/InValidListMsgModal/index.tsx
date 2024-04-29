import React, { useState } from 'react';
import Modal from 'baseComponents/Modal';
import { inValidListErrorMessage } from 'pagesComponents/SetSale/utils/checkListValidity';
import { BatchDeListType, IListedNFTInfo } from 'contract/type';
import { INftInfo } from 'types/nftTypes';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import { ImageEnhance } from 'components/ImgLoading';

function InValidListMsgModal({
  nftInfo,
  invalidList,
  visible,
  validType,
  showTryBtn = true,
  onCancel,
  completeHandler,
}: {
  nftInfo: INftInfo | null;
  invalidList?: IListedNFTInfo[];
  visible?: boolean;
  validType: BatchDeListType;
  showTryBtn?: boolean;
  onCancel?: () => void;
  completeHandler?: (callback?: () => void) => void;
}) {
  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(false);

  const tryAgain = () => {
    if (completeHandler) {
      setLoading(true);
      completeHandler(() => {
        setLoading(false);
      });
    }
  };

  return (
    <Modal
      title="Cancel Listing"
      open={visible}
      onCancel={onCancel}
      footer={
        showTryBtn && (
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
              className="rounded-md mr-[16px] mdTW:mr-[26px] !w-16 !h-16 object-contain border border-solid border-lineBorder"
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
        <p className="text-textPrimary text-[18px] leading-[26px] font-medium">Notice</p>
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

export default React.memo(InValidListMsgModal);
