import React, { useMemo, useState } from 'react';
import Modal from 'baseComponents/Modal';
import { INftInfo } from 'types/nftTypes';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import { ImageEnhance } from 'components/ImgLoading';
import Jump from 'assets/images/detail/jump.svg';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';
import { EditStatusType, editSuccessTipMessage } from '../utils/checkListValidity';

function EditListingSuccessModalConstructor({
  nftInfo,
  explorerUrl,
  onViewMyListing,
  status,
}: {
  nftInfo: INftInfo | null;
  explorerUrl?: string;
  onViewMyListing?: () => void;
  status?: EditStatusType;
}) {
  const modal = useModal();
  useNiceModalCommonService(modal);
  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(false);

  const aProps = { target: '_blank', rel: 'noreferrer' };

  const tipText = useMemo(() => {
    console.log('tipText useMemo', status);
    if (status === EditStatusType.priceGreater || status === EditStatusType.timeGreater) {
      return editSuccessTipMessage[status];
    }
    return `The listing of ${nftInfo?.tokenName} NFT in the ${nftInfo?.nftCollection?.tokenName} collection has been edited.`;
  }, [status, nftInfo]);

  const footer = (
    <div className="flex flex-1 flex-col items-center">
      <Button
        loading={loading}
        type="primary"
        size="ultra"
        className={`${!isSmallScreen ? '!w-[256px]' : 'w-full'}`}
        onClick={() => {
          modal.hide();
          onViewMyListing && onViewMyListing();
        }}>
        View My Listing
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
      title={' '}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={footer}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-between">
          {nftInfo?.previewImage && (
            <ImageEnhance
              src={nftInfo?.previewImage}
              className="w-[128px] h-[128px] rounded-md mb-4 object-contain border border-solid border-lineBorder"
            />
          )}
          <div className="flex items-center justify-center mb-1">
            {nftInfo?.nftCollection?.logoImage && (
              <ImageEnhance
                src={nftInfo?.nftCollection?.logoImage}
                className="!rounded-[4px] w-6 h-6 mr-1 object-contain border border-solid border-lineBorder"
              />
            )}
            <span className="text-textSecondary text-base">{nftInfo?.nftCollection?.tokenName}</span>
          </div>

          <span className="font-semibold text-xl text-textPrimary ">{nftInfo?.tokenName}</span>
        </div>
        <div className="flex flex-1 flex-col items-center mt-12">
          <span className="text-textPrimary font-semibold text-2xl">Listing Successfully Edited!</span>
          <span className="text-base font-medium text-textSecondary mt-4">{tipText}</span>
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

export const EditListingSuccessModal = NiceModal.create(EditListingSuccessModalConstructor);
