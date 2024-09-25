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
          <div>
            <span className="align-text-bottom text-textPrimary text-[14px] font-medium hidden xl:block ml-[4px]">
              {usdPrice}
            </span>
          </div>
        ) : null}
      </div>
      {usdPrice ? (
        <div>
          <span className="flex align-text-bottom  text-textPrimary text-[14px] font-medium xl:hidden mt-[16px]">
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
