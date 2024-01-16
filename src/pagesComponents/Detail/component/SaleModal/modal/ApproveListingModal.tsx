import React, { useState } from 'react';
import Modal from 'baseComponents/Modal';
import { BatchDeListType, IListedNFTInfo } from 'contract/type';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { NFTSaleInfoCard } from '../comps/NFTSaleInfoCard';
import { INftSaleInfoItem } from 'api/types';
import { useSelector } from 'store/store';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';

function ApproveListingModalConstructor({
  nftSaleInfo,
  listingPrice,
  listingUSDPrice,
  itemsForSell = 0,
  onRetry,
  onReEdit,
}: {
  nftSaleInfo: INftSaleInfoItem;
  itemsForSell?: number;
  listingPrice?: number | string;
  listingUSDPrice?: number | string;
  invalidList?: IListedNFTInfo[];
  visible?: boolean;
  validType: BatchDeListType;
  onCancel?: () => void;
  onRetry?: () => void;
  onReEdit?: () => void;
}) {
  const modal = useModal();
  useNiceModalCommonService(modal);
  const { infoState } = useGetState();
  const { showRetryBtn } = useSelector((store) => store.sellModalsInfos.approveListingModal);
  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(false);
  const { walletType } = useWebLogin();

  const tryAgain = async () => {
    modal.resolve('retry');
    setLoading(true);
    onRetry && (await onRetry());
    setLoading(false);
  };
  const reEdit = async () => {
    modal.resolve('reEdit');
    setLoading(true);
    onReEdit && (await onReEdit());
    setLoading(false);
  };

  const tipMessage =
    walletType === WalletType.portkey
      ? 'Please wait for auto confirmation.'
      : 'Please confirm the listing in the wallet.';

  return (
    <Modal
      title={'Approve Listing'}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={
        showRetryBtn && (
          <>
            <Button loading={loading} size="ultra" className={`${!isSmallScreen && '!w-[256px]'}`} onClick={tryAgain}>
              Try Again
            </Button>
            <Button
              loading={loading}
              type="primary"
              size="ultra"
              className={`${!isSmallScreen && '!w-[256px]'}`}
              onClick={reEdit}>
              Edit Listing
            </Button>
          </>
        )
      }>
      <NFTSaleInfoCard
        nftSaleInfo={nftSaleInfo}
        listingPrice={listingPrice}
        listingUSDPrice={listingUSDPrice}
        listItems={itemsForSell}
        size={isSmallScreen ? 'ultra' : ''}
      />
      <div className="mt-[24px] mdTW:mt-[50px] p-[24px] bg-fillHoverBg rounded-lg">
        <p className="text-textPrimary text-[18px] leading-[26px] font-medium">Go to your wallet</p>
        <p className="text-textSecondary text-base mt-[16px]">{tipMessage}</p>
      </div>
    </Modal>
  );
}

export const ApproveListingModal = NiceModal.create(ApproveListingModalConstructor);
