import React, { useEffect, useState } from 'react';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { NFTSaleInfoCard, NFTSaleInfoCardForDelListing } from '../comps/NFTSaleInfoCard';
import { FormatListingType } from 'store/types/reducer';
import useDetailGetState from 'store/state/detailGetState';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';

function ApproveCancelListingModalConstructor({
  data,
  itemsNumberForDel,
  handle,
  isBatch,
  listingsNumber,
}: {
  itemsNumberForDel?: number;
  listingsNumber?: number;
  data?: FormatListingType;
  isBatch?: boolean;
  handle?: () => Promise<void>;
}) {
  const modal = useModal();
  useNiceModalCommonService(modal);
  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(false);
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);
  const { walletType } = useWebLogin();

  const handleConfirm = async () => {
    try {
      handle && (await handle());
      modal.hide();
    } catch (error) {
      setShowRetryBtn(true);
    }
  };

  const tryAgain = async () => {
    try {
      setLoading(true);
      await handleConfirm();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modal.visible) {
      handleConfirm();
    }
    return () => {
      setShowRetryBtn(false);
    };
  }, [modal.visible]);

  const tipMessage =
    walletType === WalletType.portkey
      ? 'Please wait for auto confirmation.'
      : 'Please confirm the listing cancellation in the wallet.';

  const renderInfoCard = () => {
    if (isBatch) {
      return (
        <NFTSaleInfoCardForDelListing
          nftSaleInfo={{
            tokenName: nftInfo?.tokenName || '',
            logoImage: nftInfo?.previewImage || '',
            collectionName: nftInfo?.nftCollection?.tokenName || '',
          }}
          listItems={itemsNumberForDel}
          listings={listingsNumber}
          size={`${isSmallScreen ? 'ultra' : ''}`}
        />
      );
    }
    return (
      <NFTSaleInfoCard
        nftSaleInfo={{
          tokenName: nftInfo?.tokenName || '',
          logoImage: nftInfo?.previewImage || '',
          collectionName: nftInfo?.nftCollection?.tokenName || '',
        }}
        listingPrice={data?.price}
        listingUSDPrice={data?.price}
        listItems={data?.quantity}
        size={`${isSmallScreen ? 'ultra' : ''}`}
      />
    );
  };

  return (
    <Modal
      title={'Cancel Listing'}
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
      {renderInfoCard()}
      <div className="mt-[24px] mdTW:mt-[50px] p-[24px] bg-fillHoverBg rounded-lg">
        <p className="text-textPrimary text-[18px] leading-[26px] font-medium">Go to your wallet</p>
        <p className="text-textSecondary text-base mt-[16px]">{tipMessage}</p>
      </div>
    </Modal>
  );
}

export const ApproveCancelListingModal = NiceModal.create(ApproveCancelListingModalConstructor);
