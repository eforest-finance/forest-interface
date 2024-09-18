import { Divider, Input, InputNumber, message } from 'antd';
import styles from './style.module.css';
import { ChangeEvent, ReactNode, memo, useEffect, useMemo, useState } from 'react';

import useGetState from 'store/state/getState';
import Button from 'baseComponents/Button';
import Modal from 'baseComponents/Modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { Duration } from '../SaleModal/comps/Duration';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import ResultModal from 'components/ResultModal/ResultModal';

import { isERC721 } from 'utils/isTokenIdReuse';

import Close from 'assets/images/v2/close.svg';
import { BalanceText, TotalPrice, Text } from '../BuyNowModal/components/Text';
import InputNumberWithAddon from '../BuyNowModal/components/InputNumber';
import ApproveModal from 'components/ApproveModal';
import { SuccessFooter, Success } from '../BuyNowModal/components/Result';
import useGetTransitionFee from 'components/Summary/useGetTransitionFee';
import { useSaleService } from './hooks/useSaleService';
import { INftInfo } from 'types/nftTypes';
import ItemInfo from '../AcceptModal/ItemInfo';
import { getShowInfoData } from './comps/SummaryInfo';
import useDetailGetState from 'store/state/detailGetState';
import { useEdit } from './hooks/useEdit';

interface ISaleModalProps {
  nftInfo: INftInfo;
  type?: 'edit' | 'list';
  defaultData: {
    [key: string]: any;
  };
}

function ListModal({ nftInfo, defaultData, type = 'list' }: ISaleModalProps) {
  const modal = useModal();
  const resultModal = useModal(ResultModal);

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const {
    nftSaleInfo,
    elfRate,
    listingBtnDisable,
    listingPrice,
    duration,
    setListingPrice,
    setDuration,
    itemsForSell,
    setItemsForSell,
    availableItemForSell,
    handleCompleteListing,
  } = useSaleService(nftInfo, modal, 'add', defaultData);

  const { handleCancel, handleEditListing } = useEdit(nftInfo, elfRate, modal);
  console.log('nftInfo.nftCollection?.symbol:', nftInfo.nftCollection?.symbol);
  const { detailInfo } = useDetailGetState();

  const { nftNumber } = detailInfo;

  const { transactionFee } = useGetTransitionFee(nftInfo.nftCollection?.symbol);

  const { totalPrice, totalUSDPrice } = getShowInfoData({
    rate: elfRate,
    listingPrice: listingPrice?.price || '',
    itemsForSell: itemsForSell,
    creatorEarns: transactionFee?.creatorLoyaltyRate,
  });

  const is721 = isERC721(nftInfo);

  return (
    <Modal
      title={<div>{type === 'edit' ? 'Edit List' : 'List'}</div>}
      open={modal.visible}
      className={styles.modal}
      width={550}
      closeIcon={<Close />}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={
        type === 'edit' ? (
          <div className="flex w-full -mx-2 justify-center">
            <Button
              size="ultra"
              className={`${!isSmallScreen ? 'min-w-[188px] mx-2' : 'flex-1 !px-0 mx-2'}`}
              onClick={() => {
                handleCancel({
                  duration,
                  listingPrice,
                });
              }}>
              Cancel Listing
            </Button>
            <Button
              type="primary"
              size="ultra"
              className={`${!isSmallScreen ? 'w-[188px] mx-2' : 'flex-1 !px-0 mx-2'}`}
              disabled={listingBtnDisable}
              onClick={() =>
                handleEditListing(
                  {
                    duration,
                    listingPrice,
                  },
                  handleCompleteListing,
                )
              }>
              Edit Listing
            </Button>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Button
              disabled={listingBtnDisable}
              size="ultra"
              className=" w-full mdTW:mt-[32px] mdTW:w-[256px]"
              type="primary"
              onClick={() => {
                handleCompleteListing();
              }}>
              List
            </Button>
          </div>
        )
      }>
      <div className="w-full h-full flex flex-col relative">
        <ItemInfo
          image={nftInfo?.previewImage || ''}
          collectionName={nftInfo?.nftCollection?.tokenName}
          nftName={nftInfo?.tokenName}
          title={
            is721 ? undefined : ['Listed', `${nftNumber?.nftBalance - availableItemForSell}/${nftNumber.nftBalance}`]
          }
        />

        <div>
          <div className="text-[16px] mdTW:text-[18px] font-medium text-textPrimary mt-[24px] mdTW:mt-[32px]">
            {type === 'edit' ? 'Set a New List Price' : 'Set a List Price'}
          </div>
          <div className="flex justify-between mt-[16px] gap-[12px]">
            <Button
              className="!border-0 rounded-lg flex items-center flex-col !bg-fillCardBg hover:!bg-fillHoverBg w-[163px] mdTW:w-[279px] !h-[64px] mdTW:!h-[70px] py-[8px]"
              onClick={() => {
                setListingPrice({
                  token: {
                    symbol: 'ELF',
                    tokenId: 'ELF',
                    decimals: 8,
                  },
                  price: nftSaleInfo?.floorPrice || '--',
                });
              }}>
              <span className="text-[14px] mdTW:text-[14px] text-textSecondary">Collection Floor Price</span>
              <span className="text-[16px] mdTW:text-[16px] text-textPrimary font-medium">
                {formatTokenPrice(nftSaleInfo?.floorPrice || '--')} ELF
              </span>
            </Button>
            <Button
              className="!border-0 rounded-lg flex items-center flex-col !bg-fillCardBg hover:!bg-fillHoverBg w-[163px] mdTW:w-[279px] !h-[64px] mdTW:!h-[70px] py-[8px]"
              onClick={() => {
                setListingPrice({
                  token: {
                    symbol: 'ELF',
                    tokenId: 'ELF',
                    decimals: 8,
                  },
                  price: nftInfo.latestDealPrice,
                });
              }}>
              <span className="text-[14px] mdTW:text-[14px] text-textSecondary">Last sales</span>
              <span className="text-[16px] mdTW:text-[16px] text-textPrimary font-medium">
                {formatTokenPrice(nftInfo.latestDealPrice)} ELF
              </span>
            </Button>
          </div>
        </div>
        <div className="mt-[12px] border border-solid border-lineBorder flex items-center rounded-lg">
          <InputNumber
            bordered={false}
            controls={false}
            value={Number(listingPrice.price)}
            className={styles.price}
            min={0}
            onChange={(price: number | null) => {
              if (price) {
                setListingPrice({
                  token: {
                    symbol: 'ELF',
                    tokenId: 'ELF',
                    decimals: 8,
                  },
                  price,
                });
              }
            }}
          />
          <Divider type="vertical" />
          <span className="px-[12px] text-textSecondary text-[16px]  mdTW:text-[16px] font-medium">ELF</span>
        </div>

        {!is721 && (
          <>
            <div className="mt-[24px] mdTW:mt-[32px] text-[16px] font-medium text-textPrimary mb-[16px]">
              List Amount
            </div>
            <InputNumberWithAddon
              max={availableItemForSell}
              quantity={itemsForSell}
              width={'100%'}
              onChange={(value: number) => {
                setItemsForSell(Number(value));
              }}
            />
            <span className="text-right mt-[8px] text-textSecondary">max {availableItemForSell || 0}</span>
          </>
        )}

        <Duration onChange={setDuration} defaultExpirationData={defaultData?.duration} />

        <Divider className="my-[24px] mdTW:my-[32px]" />
        <Text className="" title="Forest fee" value={`${(transactionFee?.forestServiceRate || 0) * 100}%`} />
        <Text
          className="mt-[16px]"
          title="Creator earnings"
          value={`${(transactionFee?.creatorLoyaltyRate || 0) * 100}%`}
        />

        <TotalPrice className="mt-[16px]" title="Total Earn" elf={`${totalPrice}`} usd={`${totalUSDPrice}`} />
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(ListModal));
