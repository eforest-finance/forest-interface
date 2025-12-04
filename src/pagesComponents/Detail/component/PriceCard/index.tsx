import React from 'react';
import styles from './style.module.css';
import { timeFormat } from 'pagesComponents/Detail/utils/timeFormat';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import Pencil from 'assets/images/v2/pencil.svg';

function PriceCard({
  title,
  price,
  priceSymbol,
  usdPrice,
  time,
  timePrefix,
}: {
  title: any;
  price?: string | number;
  priceSymbol?: string;
  usdPrice?: string | number;
  time?: string | null;
  timePrefix?: string;
}) {
  const { isSmallScreen } = useSelector(selectInfo);
  return (
    <div className={styles['price-card']}>
      <p className={styles['price-panel-title']}>{title}</p>
      <div className={styles['price-number']}>
        {price && <span>{`${price} ${priceSymbol || ''}`}</span>}

        {usdPrice ? (
          <div className="leading-[22px] text-textPrimary text-[14px] font-medium hidden mdTW:block ml-[8px]">
            {usdPrice}
          </div>
        ) : null}
      </div>
      {usdPrice && isSmallScreen ? (
        <div>
          <span className="flex align-text-bottom  text-textPrimary text-[14px] font-medium xl:hidden mt-[4px] lg:mt-[16px]">
            {usdPrice}
          </span>
        </div>
      ) : null}
      {time ? (
        <div className={styles['price-time']}>
          {timePrefix && `${timePrefix} `}
          {timeFormat(time)}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(PriceCard);
