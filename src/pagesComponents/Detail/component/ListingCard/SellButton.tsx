import { useMemo, useState } from 'react';

import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import React from 'react';
import useGetState from 'store/state/getState';
import Button from 'baseComponents/Button';
import { useModal } from '@ebay/nice-modal-react';
import { isERC721 } from 'utils/isTokenIdReuse';
import TransferModal from '../TransferModal';
import { useComponentFlex } from 'aelf-web-login';
import TransferIcon from 'assets/images/icon/transfer.svg';
import clsx from 'clsx';
import { SaleModalForERC721, SaleModalForERC1155 } from '../SaleModal';
import SaleModal from '../SaleModal/SaleModal';

import { getDefaultDataByNftInfoList, useGetListItemsForSale } from '../SaleModal/hooks/useSaleService';
import { INftInfo } from 'types/nftTypes';
import { SaleListingModal } from '../SaleListingModal';

function SellButton() {
  const transferModal = useModal(TransferModal);
  const sellModalForERC721 = useModal(SaleModalForERC721);
  const sellModalForERC1155 = useModal(SaleModalForERC1155);
  const saleModal = useModal(SaleModal);
  const sellListingModal = useModal(SaleListingModal);

  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;
  const { isSmallScreen } = infoState;
  const [sellLoading] = useState<boolean>(false);

  const { maxQuantity, listItems, listedNFTInfoList } = useGetListItemsForSale(nftInfo as INftInfo);

  const { PortkeyAssetProvider } = useComponentFlex();

  const isEditMode = useMemo(() => {
    if (!nftInfo) return false;
    if (isERC721(nftInfo)) {
      return listItems > 0;
    }
    // return true;
    return maxQuantity === 0 && listItems > 0;
  }, [nftInfo, maxQuantity, listItems]);

  const onTransfer = () => {
    transferModal.show({
      quantity: Number(nftNumber.nftBalance),
    });
  };

  const TransferButton = useMemo(
    () => (
      <Button
        className={`mr-0 lgTW:mr-[16px] !w-auto`}
        icon={<TransferIcon />}
        disabled={!nftNumber.nftBalance}
        onClick={onTransfer}
        type="default"
        size="ultra"
      />
    ),
    [isSmallScreen, nftNumber.nftBalance],
  );

  const sell = async () => {
    if (!nftInfo) return;
    if (isERC721(nftInfo)) {
      if (isEditMode) {
        const defaultData = getDefaultDataByNftInfoList(listedNFTInfoList, true);
        // sellModalForERC721.show({ nftInfo, type: 'edit', defaultData });
        saleModal.show({
          nftInfo,
          type: 'edit',
        });
      } else {
        saleModal.show({
          nftInfo,
        });
      }

      return;
    } else {
      if (listItems > 0 && maxQuantity === 0) {
        sellListingModal.show(nftInfo);
        return;
      }

      saleModal.show({
        nftInfo,
      });

      // sellModalForERC1155.show({ nftInfo, type: listItems === 0 ? 'add' : 'edit' });
      return;
    }
  };

  if (!nftInfo) return null;
  return (
    <div className={clsx('flex', `${isSmallScreen && styles['mobile-button']}`)}>
      <Button
        loading={sellLoading}
        type="primary"
        className={`mr-[16px] lgTW:flex-none mdTW:mr-[16px] w-auto lgTW:min-w-[140px] flex-1`}
        size="ultra"
        onClick={sell}>
        {!isEditMode ? 'Sell' : 'Edit Listing'}
      </Button>
      {walletInfo.portkeyInfo ? (
        <PortkeyAssetProvider originChainId={walletInfo.portkeyInfo.chainId} pin={walletInfo.portkeyInfo.pin}>
          {TransferButton}
        </PortkeyAssetProvider>
      ) : (
        TransferButton
      )}
    </div>
  );
}

export default React.memo(SellButton);
