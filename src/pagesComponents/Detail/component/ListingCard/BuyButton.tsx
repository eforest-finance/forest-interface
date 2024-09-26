import { forwardRef, useMemo } from 'react';

import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import React from 'react';
import useGetState from 'store/state/getState';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import Button from 'baseComponents/Button';
import { useModal } from '@ebay/nice-modal-react';
import clsx from 'clsx';
import { useGetOwnerInfo } from 'pagesComponents/Detail/hooks/useGetOwnerInfo';
// import BuyNowModal from '../BuyNowModal/index';
import BuyNowModal from '../BuyNowModal/BuyModal';

import OfferModal from '../OfferModal/OfferModal';
import BigNumber from 'bignumber.js';
import ApproveModal from 'components/ApproveModal';
import ResultModal from 'components/ResultModal/ResultModal';
import { isERC721 } from 'utils/isTokenIdReuse';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import useBuy from 'pagesComponents/Detail/hooks/useBuy';
import { useGetSalesInfo } from 'pagesComponents/Detail/hooks/useGetSalesInfo';
import { FailBody, Success, SuccessFooter } from '../BuyNowModal/components/Result';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import Box from 'assets/images/v2/box.svg';
import ButtonWithPrefix from './ButtonWithPrefix';

interface IProps {
  rate: number;
}

function BuyButton(props: IProps) {
  const { isOnlyOwner } = useGetOwnerInfo();
  const { aelfInfo, walletInfo } = useGetState();

  const { rate } = props;

  const buyNowModal = useModal(BuyNowModal);
  const offerModal = useModal(OfferModal);

  const { isLogin, login } = useCheckLoginAndToken();

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;
  const approveModal = useModal(ApproveModal);
  const resultModal = useModal(ResultModal);
  const saleInfo = useGetSalesInfo(nftInfo?.id || '');

  const {
    buyNow: handleBuyOne,
    convertAveragePrice,
    convertTotalPrice,
    totalPrice,
  } = useBuy({
    elfRate: rate,
    quantity: 1,
    saleInfo,
  });

  console.log(nftInfo);

  const handleBuyNow = () => {
    if (nftInfo) {
      if (isERC721(nftInfo)) {
        approveModal.show({
          nftInfo: {
            ...nftInfo,
            image: nftInfo?.previewImage || '',
            collectionName: nftInfo?.nftCollection?.tokenName,
            nftName: nftInfo?.tokenName,
            priceTitle: 'Total Cost',
            price: `${formatTokenPrice(nftInfo.listingPrice)} ELF`,
            usdPrice: formatUSDPrice(nftInfo.listingPrice * rate),
          },
          title: 'Approve purchase',
          showBalance: true,
          initialization: async () => {
            const resultModalInfo = {
              image: nftInfo?.previewImage || '',
              collectionName: nftInfo?.nftCollection?.tokenName || '',
              nftName: nftInfo?.tokenName,
              gas: '1 ELF',
              subTotal: '2 ELF',
              totalPrice: `${formatTokenPrice(nftInfo.listingPrice)} ELF`,
              usdPrice: formatUSDPrice(nftInfo.listingPrice),
            };
            try {
              await handleBuyOne(
                (explorerUrl: string, batchBuyNowRes: any) => {
                  approveModal.hide();

                  const { gasFee, totalDealAmountPrice = 0 } = batchBuyNowRes;
                  const subTotal = totalDealAmountPrice / 10 ** 8;
                  const total = subTotal + gasFee;
                  const convertTotal = total * rate;

                  console.log(formatUSDPrice(convertTotal));

                  resultModal.show({
                    nftInfo: resultModalInfo,
                    title: 'Your Purchase is complete',
                    amount: 1,
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
                (explorerUrl: string, list: any, errCount: number) => {
                  approveModal.hide();
                },
              );
            } catch (error) {
              console.log(error);
              if (error?.errorMessage?.message?.includes(UserDeniedMessage) || error === 'not approved') {
                approveModal.hide();
              } else {
                approveModal.hide();
                resultModal.show({
                  nftInfo: {
                    image: nftInfo?.previewImage || '',
                    collectionName: nftInfo?.nftCollection?.tokenName || '',
                    nftName: nftInfo?.tokenName,
                  },
                  title: 'Purchase Failed',
                  amount: 1,
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
              return Promise.reject(error);
            }
          },
          onClose: () => {
            approveModal.hide();
          },
        });
      } else {
        buyNowModal.show({
          nftInfo,
          elfRate: rate,
        });
      }
    }
  };

  const buyNow = () => {
    isLogin ? handleBuyNow() : login();
  };

  const onMakeOffer = () =>
    isLogin
      ? offerModal.show({
          rate,
        })
      : login();

  const disabledBuyNow = useMemo(() => {
    return (
      isOnlyOwner ||
      !nftInfo?.showPriceType ||
      !nftInfo?.listingPrice ||
      (isLogin && BigNumber(nftNumber.nftQuantity).lt(BigNumber(nftNumber.nftBalance))) ||
      !nftInfo?.canBuyFlag
    );
  }, [
    isOnlyOwner,
    nftInfo?.showPriceType,
    nftInfo?.listingPrice,
    nftInfo?.canBuyFlag,
    isLogin,
    nftNumber.nftQuantity,
    nftNumber.nftBalance,
  ]);

  if (!nftInfo) return null;

  return (
    <div className={clsx('flex  flex-row mdTW:flex-col lgTW:flex-row', `${isSmallScreen && styles['mobile-button']}`)}>
      {!disabledBuyNow && <ButtonWithPrefix onClick={buyNow} title="Buy Now" prefix={<Box />} />}
      <Button
        type="default"
        size="ultra"
        className="!border-0 !bg-lineDividers !h-[48px]  mdTW:w-[206px] lgTW:w-[206px] mdTW:flex-none w-full"
        onClick={onMakeOffer}>
        Make Offer
      </Button>
    </div>
  );
}

export default React.memo(forwardRef(BuyButton));
