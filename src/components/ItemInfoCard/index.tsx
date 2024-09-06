import { ImageEnhance } from 'components/ImgLoading';
import React from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
import { INftInfo } from 'types/nftTypes';

export interface INftInfoListCard extends INftInfo {
  image?: string | undefined;
  collectionName?: string;
  nftName?: string;
  item?: string;
  priceTitle?: string;
  price?: string | number;
  usdPrice?: string | number;
  imageSizeType?: 'cover' | 'contain';
  number?: number;
}

const ItemInfoCard = (props: INftInfoListCard) => {
  const { collectionName, nftName, item, priceTitle, price, usdPrice, number } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <div>
      <div className="flex justify-between overflow-hidden flex-col mdTW:flex-row">
        <div className="flex items-center mr-[16px] overflow-hidden flex-1">
          {props.image && (
            <div className="w-[72px] h-[72px] mr-[16px] flex justify-center items-center overflow-hidden rounded-md border border-solid border-lineBorder">
              <ImageEnhance src={props.image} className="!rounded-none !w-[72px] !h-[72px]" />
            </div>
          )}

          <div className="flex flex-1 flex-col min-h-full items-start justify-center overflow-hidden">
            {collectionName && (
              <>
                <p
                  className={clsx(
                    'text-[16px] mdTW:text-[16px] font-semibold !text-textPrimary',
                    styles['nft-list-card-text-ellipsis'],
                  )}>
                  {collectionName}
                  {number && number > 0 && (
                    <span className="inline-block text-[14px] mdTW:text-[14px] text-brandNormal rounded-[4px] ml-[8px] !h-[24px] bg-functionalLinkBg px-[8px] line-[24px]">
                      x {number}
                    </span>
                  )}
                </p>
              </>
            )}

            <p
              className={clsx(
                'text-[14px] font-medium text-textSecondary mt-[10px] mdTW:mt-[20px]',
                styles['nft-list-card-text-ellipsis'],
              )}>
              {nftName}
            </p>
          </div>
        </div>
        {!isSmallScreen ? (
          <>
            <div className="flex min-w-fit flex-col justify-center items-end">
              {priceTitle && <p className="text-[14px] font-medium text-textSecondary">{priceTitle}</p>}
              {price && <p className="mt-[4px] text-[16px] font-semibold text-textPrimary">{price}</p>}
              {usdPrice && <p className="mt-[4px] text-[14px] font-medium text-textSecondary">{usdPrice}</p>}
            </div>
          </>
        ) : (
          <div className="flex min-w-fit justify-between ">
            {priceTitle && <p className="mt-[16px] text-[14px] font-medium text-textSecondary">{priceTitle}</p>}
            <div>
              {price && <div className="text-right text-[16px] font-semibold text-textPrimary">{price}</div>}
              {usdPrice && <div className="text-right text-[14px] font-medium text-textSecondary">{usdPrice}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ItemInfoCard);
