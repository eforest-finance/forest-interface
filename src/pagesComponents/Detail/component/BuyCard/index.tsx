import Button from 'baseComponents/Button';
import Clock from 'assets/images/clock.svg';
import ELF from 'assets/images/ELF.png';
import BigNumber from 'bignumber.js';
import Logo from 'components/Logo';
import moment from 'moment';
import { MouseEventHandler, useMemo } from 'react';
import { divDecimals } from 'utils/calculate';
import useGetState from 'store/state/getState';

import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import React from 'react';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

function BuyCard(options: {
  rate: number;
  myBalance: BigNumber | undefined;
  disabled: boolean;
  onBuyNow: () => void;
  onMakeOffer: MouseEventHandler<HTMLElement>;
  className?: string;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { rate, myBalance, disabled, onBuyNow, onMakeOffer } = options;
  const { detailInfo } = useDetailGetState();
  const nftInfo = detailInfo?.nftInfo;
  const { isLogin } = useCheckLoginAndToken();

  const usdFormat = (value: number) => {
    return value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  };

  const listingPriceFromList = useMemo(() => {
    return detailInfo?.listings?.[0]?.price || 0;
  }, [detailInfo.listings]);

  const listingFromList = useMemo(() => {
    return detailInfo?.listings?.[0] || null;
  }, [detailInfo.listings]);

  const disabledBuyNow = useMemo(() => {
    return (
      disabled ||
      (isLogin ? divDecimals(myBalance?.valueOf(), 8).toNumber() < (listingPriceFromList || 0) : false) ||
      !nftInfo?.canBuyFlag
    );
  }, [disabled, isLogin, nftInfo?.canBuyFlag, myBalance, listingPriceFromList]);

  const buyNow = () => {
    onBuyNow?.();
  };

  const getPrice = (type: 'current' | 'whitelist') => {
    if (type === 'current') {
      return listingPriceFromList ? usdFormat(divDecimals(listingPriceFromList, 0).times(rate).toNumber()) : '--';
    } else {
      return nftInfo?.whitelistPriceToken?.id
        ? usdFormat(divDecimals(nftInfo.whitelistPrice, 0).times(rate).toNumber())
        : '--';
    }
  };

  return (
    <div
      className={`${styles['buy-card']} mb-[16px] ${options?.className} ${isSmallScreen && styles['mobile-buy-card']}`}>
      {listingFromList?.endTime ? (
        <div className={styles['time-panel']}>
          <div
            className={`${styles['time-icon']} flex items-center justify-center ${
              isSmallScreen ? 'w-[16px] h-[16px]' : 'w-[24px] h-[24px]'
            } mr-[12px]`}>
            <Clock />
          </div>
          <span
            className={`text-[var(--table-tbody-text)] truncate leading-[24px] ${
              isSmallScreen ? 'text-[14px]' : 'text-[18px]'
            }`}>
            Sale ends {moment(listingFromList.endTime).format('MMM DD,YYYY')} at&nbsp;
            {moment(listingFromList.endTime).format('HH:mma Z')}
          </span>
        </div>
      ) : null}
      <div className={styles['price-panel']}>
        <div
          className={`${styles['left-part']} ${
            isSmallScreen ? 'flex flex-col w-[100%] gap-[11.429px]' : 'flex gap-[40px]'
          }`}>
          <div>
            <p className={`${styles['current-price']} text-base font-medium`}>Current Price</p>
            <div className={`${styles['price-number']} flex flex-wrap`}>
              <Logo src={ELF} className="w-[32px] h-[32px]" />
              <span className={`${styles['price-margin']} text-textPrimary font-semibold`}>
                {(listingPriceFromList || 0).toFixed(2)}
              </span>
              <span className="text-textSecondary text-base hidden xl:block">(${getPrice('current')})</span>
            </div>
            <span className="text-textSecondary text-base xl:hidden">(${getPrice('current')})</span>
          </div>
        </div>
        <p className={`${styles['btn-panel']} flex flex-col lgTW:flex-row`}>
          <Button
            disabled={disabledBuyNow}
            className={`mdTW:mr-0 mr-[16px] mb-2 lgTW:mb-0 lgTW:mr-[16px] lgTW:w-auto lgTW:min-w-[140px] w-full ${
              isSmallScreen && 'mr-0'
            }`}
            size="ultra"
            type="primary"
            onClick={buyNow}>
            Buy Now
          </Button>
          <Button type="default" size="ultra" className="lgTW:w-auto lgTW:min-w-[140px] w-full" onClick={onMakeOffer}>
            Make Offer
          </Button>
        </p>
      </div>
    </div>
  );
}

export default React.memo(BuyCard);
