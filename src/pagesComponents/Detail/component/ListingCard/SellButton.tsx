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
import TransferIcon from 'assets/images/v2/transfer_l.svg';
import EditIcon from 'assets/images/v2/edit_l.svg';

import clsx from 'clsx';
import { SaleModalForERC721, SaleModalForERC1155 } from '../SaleModal';
import SaleModal from '../SaleModal/SaleModal';

import { getDefaultDataByNftInfoList, useGetListItemsForSale } from '../SaleModal/hooks/useSaleService';
import { INftInfo } from 'types/nftTypes';
import { SaleListingModal } from '../SaleListingModal';
import ButtonWithPrefix from './ButtonWithPrefix';
import { ArtType } from '../ExchangeModal';
import AcceptModal from '../AcceptModal';

interface IProps {
  rate: number;
}

function SellButton(props: IProps) {
  const transferModal = useModal(TransferModal);
  const sellModalForERC721 = useModal(SaleModalForERC721);
  const sellModalForERC1155 = useModal(SaleModalForERC1155);
  const saleModal = useModal(SaleModal);
  const sellListingModal = useModal(SaleListingModal);
  const acceptModal = useModal(AcceptModal);

  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber, offers } = detailInfo;

  const { rate } = props;

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

  const onAcceptTopOffer = () => {
    if (nftInfo && offers && offers.items?.length) {
      const record = offers?.items[0] as any;
      const convertPrice = record?.price * (record?.token?.symbol === 'ELF' ? rate : 1);

      const art: ArtType = {
        id: nftInfo?.nftTokenId,
        name: nftInfo?.tokenName || '',
        token: { symbol: record?.token.symbol },
        symbol: nftInfo?.nftSymbol,
        collection: nftInfo.nftCollection?.tokenName,
        nftDecimals: Number(nftInfo?.decimals || 0),
        decimals: record?.decimals,
        price: record?.price,
        quantity: record?.quantity,
        convertPrice,
        address: record?.from?.address || '',
        collectionSymbol: nftInfo.nftCollection?.symbol,
      };
      acceptModal.show({
        art,
        nftInfo,
        rate: rate,
        nftBalance: Number(nftNumber.nftBalance),
        onClose: () => acceptModal.hide(),
      });
    }
  };

  const TransferButton = useMemo(
    () => (
      <Button
        className={`mr-0 lgTW:mr-[16px] !w-auto !border-0 !bg-lineDividers !h-[48px]`}
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
      <ButtonWithPrefix onClick={sell} title={!isEditMode ? 'List' : 'Edit Listing'} prefix={<EditIcon />} />
      {Number(offers?.totalCount) > 0 && (
        <Button
          className={`mr-0 lgTW:mr-[16px] !w-auto !border-0 !bg-lineDividers !h-[48px]`}
          onClick={onAcceptTopOffer}
          type="default"
          size="ultra">
          Accept Top Offer
        </Button>
      )}

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
