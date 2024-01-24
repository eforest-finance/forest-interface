import ImgLoading from 'baseComponents/ImgLoading/ImgLoading';
import { StaticImageData } from 'next/image';
import React from 'react';
import styles from './style.module.css';
import clsx from 'clsx';
import useGetState from 'store/state/getState';

export interface INftInfoListCard {
  image?: string | StaticImageData;
  collectionName?: string;
  nftName?: string;
  item?: string;
  priceTitle?: string;
  price?: string | number;
  usdPrice?: string | number;
}

const NftInfoListCard = (props: INftInfoListCard) => {
  const { collectionName, nftName, item, priceTitle, price, usdPrice } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <div>
      <div className="flex justify-between pb-[16px] overflow-hidden">
        <div className="flex items-center mr-[16px] overflow-hidden flex-1">
          {props.image && (
            <div className="w-[84px] h-[84px] mr-[16px] flex justify-center items-center rounded-md border border-solid border-lineBorder">
              <ImgLoading
                src={props.image}
                nextImageProps={{
                  width: 84,
                  height: 84,
                }}
                imageSizeType="contain"
                className="!rounded-none"
              />
            </div>
          )}

          {!isSmallScreen && (
            <div className="flex flex-1 flex-col justify-between items-start overflow-hidden">
              <p className={clsx('text-base font-medium text-textSecondary', styles['nft-list-card-text-ellipsis'])}>
                {collectionName}
              </p>
              <p className={clsx('text-xl font-semibold text-textPrimary', styles['nft-list-card-text-ellipsis'])}>
                {nftName}
              </p>
              <p className={clsx('text-base font-medium text-textSecondary', styles['nft-list-card-text-ellipsis'])}>
                {item}
              </p>
            </div>
          )}
        </div>
        <div className="flex min-w-fit flex-col justify-center items-end">
          {priceTitle && <p className="text-base font-medium text-textSecondary">{priceTitle}</p>}
          {price && <p className="text-xl font-semibold text-textPrimary">{price}</p>}
          {usdPrice && <p className="text-base font-medium text-textSecondary">{usdPrice}</p>}
        </div>
      </div>
      {isSmallScreen && (
        <div className="flex flex-1 flex-col justify-between items-start overflow-hidden">
          <p className={clsx('text-base font-medium text-textSecondary')}>{collectionName}</p>
          <div className="flex items-center justify-between mt-[4px] w-full">
            <p className={clsx('text-xl flex-1 font-semibold text-textPrimary')}>{nftName}</p>
            <p className={clsx('text-base min-w-fit font-medium text-textSecondary text-right')}>{item}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(NftInfoListCard);
