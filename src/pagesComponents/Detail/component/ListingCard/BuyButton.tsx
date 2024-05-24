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
import BuyNowModal from '../BuyNowModal/index';
import OfferModal from '../OfferModal/index';
import BigNumber from 'bignumber.js';

interface IProps {
  rate: number;
}

function BuyButton(props: IProps) {
  const { isOnlyOwner } = useGetOwnerInfo();

  const { rate } = props;

  const buyNowModal = useModal(BuyNowModal);
  const offerModal = useModal(OfferModal);

  const { isLogin, login } = useCheckLoginAndToken();

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;

  const handleBuyNow = () => {
    if (nftInfo)
      buyNowModal.show({
        elfRate: rate,
      });
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
    <div className={clsx('flex flex-row mdTW:flex-col lgTW:flex-row', `${isSmallScreen && styles['mobile-button']}`)}>
      {!disabledBuyNow && (
        <Button
          className={`mdTW:mr-0 mr-[16px] mb-2 lgTW:mb-0 lgTW:mr-[16px] lgTW:w-auto mdTW:w-full lgTW:min-w-[140px] w-auto mdTW:flex-none flex-1`}
          size="ultra"
          type="primary"
          onClick={buyNow}>
          Buy Now
        </Button>
      )}

      <Button
        type="default"
        size="ultra"
        className="lgTW:w-auto lgTW:min-w-[140px] w-auto mdTW:flex-none flex-1"
        onClick={onMakeOffer}>
        Make Offer
      </Button>
    </div>
  );
}

export default React.memo(forwardRef(BuyButton));
