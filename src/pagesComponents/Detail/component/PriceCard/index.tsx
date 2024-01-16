import React from 'react';
import styles from './style.module.css';
import { timeFormat } from 'pagesComponents/Detail/utils/timeFormat';

function PriceCard({
  title,
  price,
  priceSymbol,
  usdPrice,
  time,
  timePrefix,
}: {
  title: string;
  price?: string | number;
  priceSymbol?: string;
  usdPrice?: string | number;
  time?: string | null;
  timePrefix?: string;
}) {
  return (
    <div className={styles['price-card']}>
      <p className={styles['price-panel-title']}>{title}</p>
      <div className={styles['price-number']}>
        {price && <span>{`${price} ${priceSymbol || ''}`}</span>}

        {usdPrice ? (
          <span className="text-textSecondary text-base font-medium hidden xl:block ml-[24px]">{usdPrice}</span>
        ) : null}
      </div>
      {usdPrice ? (
        <span className="flex text-textSecondary text-base font-medium xl:hidden mt-[16px]">{usdPrice}</span>
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
