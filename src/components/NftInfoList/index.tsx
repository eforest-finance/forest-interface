import ImgLoading from 'baseComponents/ImgLoading/ImgLoading';
import { StaticImageData } from 'next/image';
import React, { useMemo } from 'react';
import useGetState from 'store/state/getState';
import styles from './style.module.css';
import clsx from 'clsx';
import { handlePlurality } from 'utils/handlePlurality';

export interface INftInfoList {
  image?: string | StaticImageData | null;
  collectionName?: string;
  nftName?: string;
  item?: string | number;
  priceTitle?: string;
  price?: string;
  usdPrice?: string;
}

const NftInfoList = (props: INftInfoList) => {
  const { collectionName, nftName, item, priceTitle, price, usdPrice } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const itemText = useMemo(() => {
    if (typeof item === 'number') {
      return handlePlurality(item, 'item');
    }
    return item;
  }, [item]);

  return (
    <div className="flex justify-between pb-[16px] overflow-hidden">
      <div className="flex items-center mr-[16px] overflow-hidden flex-1">
        {props?.image && (
          <div className="overflow-hidden w-[48px] h-[48px] mdTW:w-[84px] mdTW:h-[84px] flex justify-center items-center mr-[16px] rounded-md border border-solid border-lineBorder">
            <ImgLoading
              src={props.image}
              nextImageProps={{
                width: isSmallScreen ? 48 : 84,
                height: isSmallScreen ? 48 : 84,
              }}
              imageSizeType="contain"
              className="!rounded-none"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between items-start overflow-hidden">
          <p className={clsx('text-base font-medium text-textSecondary', styles['nft-list-text-ellipsis'])}>
            {collectionName}
          </p>
          <p className={clsx('text-xl font-semibold text-textPrimary', styles['nft-list-text-ellipsis'])}>{nftName}</p>
          <p className={clsx('text-base font-medium text-textSecondary', styles['nft-list-text-ellipsis'])}>
            {itemText}
          </p>
        </div>
      </div>
      <div className="flex min-w-fit flex-col justify-between items-end">
        <p className="text-base font-medium text-textSecondary">{priceTitle}</p>
        <p className="text-xl font-semibold text-textPrimary">{price}</p>
        <p className="text-base font-medium text-textSecondary">{usdPrice}</p>
      </div>
    </div>
  );
};

export default React.memo(NftInfoList);
