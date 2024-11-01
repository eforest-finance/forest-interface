import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import ItemInfoCard, { INftInfoListCard } from 'components/ItemInfoCard';

import styles from './styles.module.css';
import Close from 'assets/images/v2/close.svg';

import { Divider } from 'antd';
import { useBalance } from 'components/Header/hooks/useBalance';
import { divDecimals, timesDecimals } from 'utils/calculate';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { INftInfo } from 'types/nftTypes';
import InputQuantity from './components/InputNumber';
import { useGetSalesInfo } from 'pagesComponents/Detail/hooks/useGetSalesInfo';

import { Text, TotalPrice, BalanceText } from './components/Text';
import useDetailGetState from 'store/state/detailGetState';
import ApproveModal from 'components/ApproveModal';
import useBuy from '../../hooks/useBuy';

import { Success, SuccessFooter, FailBody, PartialBody } from './components/Result';
import ResultModal from 'components/ResultModal/ResultModal';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { FormatListingType } from 'store/types/reducer';
import BigNumber from 'bignumber.js';

interface IProps {
  nftInfo: INftInfo;
  initialization?: <T, R>(params?: T) => Promise<void | R>;
  onClose?: <T>(params?: T) => void;
  elfRate: number;
  amount?: number;
  buyItem?: FormatListingType;
}

function BuyModal({ nftInfo, initialization, onClose, elfRate, amount, buyItem }: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { aelfInfo, walletInfo } = useGetState();
  const resultModal = useModal(ResultModal);

  const { isSmallScreen } = infoState;
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const saleInfo = useGetSalesInfo(nftInfo?.id || '');
  const [quantity, setQuantity] = useState(amount ? amount : 1);
  const { detailInfo } = useDetailGetState();
  const approveModal = useModal(ApproveModal);

  const { tokenBalance, nftTotalSupply } = detailInfo.nftNumber;

  const { onGetBalance } = useBalance({ symbol: 'ELF', chain: aelfInfo?.curChain });

  const { buyNow, loading, convertTotalPrice, totalPrice } = useBuy({
    elfRate,
    quantity,
    saleInfo,
    buyItem,
  });

  const onConfirm: (onClick?: Function) => void = async (onClick) => {
    if (onClick) {
      try {
        await onClick();
        return;
      } catch (error) {
        setShowRetryBtn(true);
        return;
      }
    } else if (initialization) {
      try {
        await initialization();
        return;
      } catch (error) {
        setShowRetryBtn(true);
        return;
      }
    }
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const getBalance = async () => {
    const balanceBG = await onGetBalance();
    const bc = divDecimals(balanceBG, 8).valueOf();
    setBalance(Number(bc));
  };

  useEffect(() => {
    if (modal.visible) {
      getBalance();
    }
    return () => {
      setShowRetryBtn(false);
    };
  }, [modal.visible, nftInfo, initialization, onClose]);

  const handleBuyNow = async () => {
    try {
      const res = await buyNow(
        (explorerUrl: string, batchBuyNowRes: any) => {
          const { gasFee, totalDealAmountPrice = 0 } = batchBuyNowRes;
          approveModal.hide();
          const subTotal = totalDealAmountPrice / 10 ** 8;
          const total = subTotal + gasFee;
          const convertTotal = total * elfRate;

          console.log(formatUSDPrice(convertTotal));

          resultModal.show({
            nftInfo: {
              image: nftInfo?.previewImage || '',
              collectionName: nftInfo?.nftCollection?.tokenName || '',
              nftName: nftInfo?.tokenName,
              totalPrice: `${formatTokenPrice(nftInfo.listingPrice)} ELF`,
              usdPrice: formatUSDPrice(nftInfo.listingPrice),
            },
            title: 'Your Purchase is complete',
            amount: quantity,
            type: 'success',
            content: (
              <>
                <Success
                  subTotal={`${formatTokenPrice(subTotal)} ELF`}
                  gas={`${formatTokenPrice(gasFee)} ELF`}
                  elf={formatTokenPrice(total)}
                  usd={formatUSDPrice(convertTotal)}
                />
              </>
            ),
            footer: (
              <SuccessFooter
                href={explorerUrl}
                text="View on profile"
                profile={`/account/${walletInfo.address}#Collected`}
                modal={resultModal}
              />
            ),
            onClose: () => {
              resultModal.hide();
            },
          });

          console.log('NFT Successfully Purchased!', explorerUrl);
        },
        (explorerUrl: string, batchBuyNowRes: any, list: any, errCount: number) => {
          const { gasFee } = batchBuyNowRes;

          approveModal.hide();

          resultModal.show({
            nftInfo: {
              image: nftInfo?.previewImage || '',
              collectionName: nftInfo?.nftCollection?.tokenName || '',
              nftName: nftInfo?.tokenName,
              totalPrice: `${formatTokenPrice(nftInfo.listingPrice)} ELF`,
              usdPrice: formatUSDPrice(nftInfo.listingPrice),
            },
            title: 'Purchase partly Failed',
            amount: quantity,
            type: 'warn',
            content: (
              <>
                <PartialBody count={errCount} />
              </>
            ),
            footer: (
              <SuccessFooter
                href={explorerUrl}
                profile={`/account/${walletInfo.address}#Collected`}
                modal={resultModal}
              />
            ),
            onClose: () => {
              resultModal.hide();
            },
          });
          console.log('fail', list, errCount);
        },
      );
    } catch (error) {
      console.log(error);
      if (error?.errorMessage?.message?.includes(UserDeniedMessage) || error === 'not approved') {
        approveModal.hide();
        modal.show({
          nftInfo,
          elfRate,
          amount: quantity,
        });
      } else {
        approveModal.hide();

        resultModal.show({
          nftInfo: {
            image: nftInfo?.previewImage || '',
            collectionName: nftInfo?.nftCollection?.tokenName || '',
            nftName: nftInfo?.tokenName,
          },
          title: 'Purchase Failed',
          amount: quantity,
          type: 'error',
          content: (
            <>
              <FailBody />
            </>
          ),
          onClose: () => {
            resultModal.hide();
          },
        });
      }
    }
  };

  const averagePrice = useMemo(() => {
    const totalPriceBig = new BigNumber(totalPrice);
    const average = quantity ? totalPriceBig.div(quantity).toNumber() : 0;
    return average;
  }, [totalPrice, quantity]);

  const balanceValue = divDecimals(Number(tokenBalance), 8).toNumber();
  // const totalPriceValue = nftInfo.listingPrice * quantity;
  const isNotEnoughBalance = totalPrice > balanceValue;
  const etransferUrl = aelfInfo.etransferUrl;
  const availableQuantity = buyItem ? buyItem?.quantity : saleInfo?.availableQuantity || 0;

  return (
    <Modal
      title={<div>Buy Now</div>}
      open={modal.visible}
      className={styles.modal}
      width={550}
      size="m"
      closeIcon={<Close />}
      onOk={() => onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <div className="flex justify-center w-full">
          <Button
            size="ultra"
            className="w-full mdTW:w-[256px]"
            type="primary"
            loading={!isNotEnoughBalance && loading}
            onClick={() => {
              if (isNotEnoughBalance) {
                window.open(etransferUrl);
              } else {
                modal.hide();
                approveModal.show({
                  nftInfo: {
                    ...nftInfo,
                    image: nftInfo?.previewImage || '',
                    collectionName: nftInfo?.nftCollection?.tokenName,
                    nftName: nftInfo?.tokenName,
                    priceTitle: 'Total Cost',
                    price: `${formatTokenPrice(totalPrice)} ELF`,
                    usdPrice: formatUSDPrice(convertTotalPrice),
                    number: quantity,
                  },
                  title: 'Approve purchase',
                  showBalance: true,
                  initialization: handleBuyNow,
                  onClose: () => {
                    approveModal.hide();
                  },
                });
              }
            }}>
            {!isNotEnoughBalance ? 'Buy Now' : 'Get ELF'}
          </Button>
        </div>
      }>
      <div className="w-full h-full flex flex-col relative">
        <ItemInfoCard
          {...nftInfo}
          image={nftInfo?.previewImage || ''}
          collectionName={nftInfo?.nftCollection?.tokenName}
          nftName={nftInfo?.tokenName}
          priceTitle=""
          price=""
          usdPrice=""
        />
        <div className="flex flex-col mdTW:flex-row  justify-between mt-[24px]">
          <span className="text-[16px] mdTW:text-[16px] font-medium">Quantity</span>
          <div className="flex flex-col items-end mt-[16px] mdTW:mt-0">
            <InputQuantity
              width={isSmallScreen ? '100%' : undefined}
              max={availableQuantity}
              quantity={quantity}
              onChange={(quantity) => {
                setQuantity(quantity);
              }}
            />
            <span className="text-[12px] mdTW:text-[14px] mt-[8px] text-textSecondary">
              {availableQuantity} available
            </span>
          </div>
        </div>
        <Divider className="my-[24px] mdTW:my-[20px] mt-[20px]" />
        <Text title="Average item price" value={`${formatTokenPrice(averagePrice)} ELF`} />
        <TotalPrice
          className="mt-[16px]"
          title="Total Price"
          elf={`${formatTokenPrice(totalPrice)} ELF`}
          usd={`$${convertTotalPrice}`}
        />
        <BalanceText
          className="mt-0"
          title="Your balance"
          value={formatTokenPrice(balance)}
          totalPrice={nftInfo.listingPrice * quantity}
        />
      </div>
    </Modal>
  );
}

export default NiceModal.create(BuyModal);
