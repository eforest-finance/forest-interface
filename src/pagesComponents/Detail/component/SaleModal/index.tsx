import BaseModal from 'baseComponents/Modal';
import { SummaryInfo } from './comps/SummaryInfo';
import { SetPrice } from './comps/SetPrice';
import Button from 'baseComponents/Button';
import { INftInfo } from 'types/nftTypes';
import { Duration } from './comps/Duration';
import { useSaleService } from './hooks/useSaleService';
import { SetSellItemNumber } from './comps/SetSellItemNumber';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useGetState from 'store/state/getState';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';
import NftInfoListCard from 'components/NftInfoListCard';
import { handlePlurality } from 'utils/handlePlurality';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import styles from './index.module.css';
import { useEffect, useState } from 'react';
import { fetchTransactionFee } from 'api/fetch';
import useGetTransitionFee, { ITransitionFee } from 'components/Summary/useGetTransitionFee';

interface ISaleModalProps {
  nftInfo: INftInfo;
  type: 'add' | 'edit';
  defaultData: {
    [key: string]: any;
  };
}

export function SaleModalERC721Constructor({ nftInfo, type = 'edit', defaultData }: ISaleModalProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const modal = useModal();
  useNiceModalCommonService(modal);
  const {
    nftSaleInfo,
    onCompleteListingHandler,
    listingBtnDisable,
    listingPrice,
    listingUSDPrice,
    setListingPrice,
    setDuration,
    itemsForSell,
    onCancelAllListings,
    onEditListingForERC721,
  } = useSaleService(nftInfo, modal, type, defaultData);

  console.log('nftInfo.nftCollection?.symbol:', nftInfo.nftCollection?.symbol);

  const { transactionFee } = useGetTransitionFee(nftInfo.nftCollection?.symbol);

  const footer =
    type === 'add' ? (
      <Button
        type="primary"
        size="ultra"
        className="w-[256px]"
        disabled={listingBtnDisable}
        onClick={onCompleteListingHandler}>
        Complete Listing
      </Button>
    ) : (
      <div className="flex w-full -mx-2 justify-center">
        <Button
          size="ultra"
          className={`${!isSmallScreen ? 'min-w-[188px] mx-2' : 'flex-1 !px-0 mx-2'}`}
          onClick={onCancelAllListings}>
          Cancel all Listing
        </Button>
        <Button
          type="primary"
          size="ultra"
          className={`${!isSmallScreen ? 'w-[188px] mx-2' : 'flex-1 !px-0 mx-2'}`}
          disabled={listingBtnDisable}
          onClick={onEditListingForERC721}>
          Edit Listing
        </Button>
      </div>
    );

  const setPriceTitle = type === 'edit' ? 'Set a New Price' : 'Set a Price';
  const tooltip =
    type === 'edit'
      ? 'If you want to raise the listing price, you need to first cancel any existing listings at a lower price. Listing cancellation will cost transaction fees.'
      : '';
  const tooltipForDuration =
    type === 'edit'
      ? 'If you want to reduce the listing duration, you need to first cancel any existing listings with a longer duration. Listing cancellation will cost transaction fees.'
      : '';
  return (
    <BaseModal
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      destroyOnClose={true}
      title={`${type === 'add' ? 'List for Sale' : 'Edit Listing'}`}
      footer={footer}
      className={styles['sale-modal-custom']}>
      <NftInfoListCard
        image={nftSaleInfo?.logoImage || ''}
        collectionName={nftSaleInfo?.collectionName}
        nftName={nftSaleInfo?.tokenName}
        priceTitle={'Listing Price'}
        price={`${listingPrice?.price ? formatTokenPrice(listingPrice?.price) : '--'} ELF`}
        usdPrice={listingUSDPrice ? formatUSDPrice(listingUSDPrice) : '$ --'}
      />
      <SetPrice
        floorPrice={nftSaleInfo?.floorPrice}
        lastSalePrice={nftSaleInfo?.lastDealPrice}
        onChange={setListingPrice}
        title={setPriceTitle}
        tooltip={tooltip}
        defaultPrice={listingPrice?.price}
      />
      <Duration onChange={setDuration} defaultExpirationData={defaultData?.duration} tooltip={tooltipForDuration} />
      <SummaryInfo listingPrice={listingPrice?.price} creatorEarns={transactionFee?.creatorLoyaltyRate} />
    </BaseModal>
  );
}

export function SaleModalERC1155Constructor({ nftInfo, type = 'edit', defaultData }: ISaleModalProps) {
  const modal = useModal();
  useNiceModalCommonService(modal);
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const {
    nftSaleInfo,
    onCompleteListingHandler,
    listingBtnDisable,
    listingPrice,
    listingUSDPrice,
    setListingPrice,
    setDuration,
    listItems,
    itemsForSell,
    onEditListingForERC1155,
    setItemsForSell,
    availableItemForSell,
  } = useSaleService(nftInfo, modal, type, defaultData);
  console.log('nftInfo.nftCollection?.symbol:', nftInfo.nftCollection?.symbol);

  const { transactionFee } = useGetTransitionFee(nftInfo.nftCollection?.symbol);

  const footer =
    type === 'add' && !listItems ? (
      <Button
        type="primary"
        size="ultra"
        className="w-[256px]"
        disabled={listingBtnDisable}
        onClick={onCompleteListingHandler}>
        Complete Listing
      </Button>
    ) : (
      <div className="flex w-full -mx-2 justify-center">
        <Button
          size="ultra"
          className={`${!isSmallScreen ? 'w-[188px] mx-2' : 'flex-1 !px-0 mx-2'}`}
          onClick={onEditListingForERC1155}>
          Edit your listings
        </Button>
        <Button
          type="primary"
          size="ultra"
          className={`${!isSmallScreen ? 'w-[188px] mx-2' : 'flex-1 !px-0 mx-2'}`}
          disabled={listingBtnDisable}
          onClick={onCompleteListingHandler}>
          Complete Listing
        </Button>
      </div>
    );

  const setPriceTitle = 'Set a Price Per Item';

  return (
    <BaseModal
      className={styles['sale-modal-custom']}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      destroyOnClose={true}
      title={`${type === 'add' ? 'List for Sale' : 'Edit Listing'}`}
      footer={footer}>
      <NftInfoListCard
        image={nftSaleInfo?.logoImage || ''}
        collectionName={nftSaleInfo?.collectionName}
        nftName={nftSaleInfo?.tokenName}
        item={handlePlurality(itemsForSell, 'item')}
        priceTitle={'Listing Price Per Item'}
        price={`${listingPrice?.price ? formatTokenPrice(listingPrice?.price) : '--'} ELF`}
        usdPrice={listingUSDPrice ? formatUSDPrice(listingUSDPrice) : '$ --'}
      />
      <SetSellItemNumber onChange={(value) => setItemsForSell(Number(value))} maxNumber={availableItemForSell} />
      <SetPrice
        floorPrice={nftSaleInfo?.floorPrice}
        lastSalePrice={nftSaleInfo?.lastDealPrice}
        onChange={setListingPrice}
        title={setPriceTitle}
        defaultPrice={listingPrice.price}
      />
      <Duration onChange={setDuration} defaultExpirationData={defaultData?.duration} />
      <SummaryInfo
        listingPrice={listingPrice?.price || ''}
        itemsForSell={itemsForSell}
        creatorEarns={transactionFee?.creatorLoyaltyRate}
      />
    </BaseModal>
  );
}

export const SaleModalForERC721 = NiceModal.create(SaleModalERC721Constructor);
export const SaleModalForERC1155 = NiceModal.create(SaleModalERC1155Constructor);
