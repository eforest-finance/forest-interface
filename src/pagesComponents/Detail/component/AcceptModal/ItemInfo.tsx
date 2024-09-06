import { ImageEnhance } from 'components/ImgLoading';
import React from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
import { INftInfo } from 'types/nftTypes';

export interface INftInfoListCard {
  image?: string | undefined;
  collectionName?: string;
  nftName?: string;
  item?: string;
  priceTitle?: string;
  price?: string | number;
  usdPrice?: string | number;
  imageSizeType?: 'cover' | 'contain';
  number?: number;
  title?: [string, string | number];
}

const ItemInfoCard = (props: INftInfoListCard) => {
  const { collectionName, nftName, item, title = [] } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <div>
      <div className="flex  mdl:justify-between  overflow-hidden">
        <div className="flex items-center mr-[16px] overflow-hidden mdl:flex-1">
          {props.image && (
            <div className="w-[84px] h-[84px] flex justify-center items-center overflow-hidden rounded-md border border-solid border-lineBorder">
              <ImageEnhance src={props.image} className="!rounded-none !w-[84px] !h-[84px]" />
            </div>
          )}
          {!isSmallScreen && (
            <div className="py-[8px] pl-[16px] flex flex-1 flex-col min-h-full justify-between items-start overflow-hidden">
              {collectionName && (
                <>
                  <p
                    className={clsx(
                      'text-[20px] font-semibold !text-textPrimary',
                      styles['nft-list-card-text-ellipsis'],
                    )}>
                    {collectionName}
                  </p>
                </>
              )}

              <p
                className={clsx(
                  'text-base font-medium text-textSecondary mt-[16px]',
                  styles['nft-list-card-text-ellipsis'],
                )}>
                {nftName}
              </p>
            </div>
          )}
        </div>
        {!isSmallScreen && (
          <>
            {title && (
              <div className="flex min-w-fit flex-col justify-between items-end">
                <p className="text-xl font-semibold text-textPrimary">{title[0]}</p>
                <p className="text-xl font-semibold text-textPrimary">{title[1]}</p>
              </div>
            )}
          </>
        )}
        {isSmallScreen && (
          <>
            <div>
              <div className="py-[8px] flex flex-1 flex-col min-h-full justify-between items-start overflow-hidden">
                {collectionName && (
                  <>
                    <p
                      className={clsx(
                        'text-[18px] font-semibold !text-textPrimary',
                        styles['nft-list-card-text-ellipsis'],
                      )}>
                      {collectionName}
                    </p>
                  </>
                )}

                <p
                  className={clsx('text-[14px] font-medium text-textSecondary', styles['nft-list-card-text-ellipsis'])}>
                  {nftName}
                </p>
                {title?.length > 0 && (
                  <p className={clsx('flex', styles['nft-list-card-text-ellipsis'])}>
                    <p className="text-[14px] font-medium text-textSecondary">{title[0]}</p>
                    <p className="ml-[8px] text-[14px] font-semibold text-textPrimary">{title[1]}</p>
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {/* {isSmallScreen && (
        <div className="flex flex-1 flex-col justify-between items-start overflow-hidden">
          <p className={clsx('text-base font-medium  !text-textPrimary')}>{collectionName}</p>
          <div className="flex items-center justify-between mt-[4px] w-full">
            <p className={clsx('text-xl flex-1 font-semibold text-textPrimary')}>{nftName}</p>
            <p className={clsx('text-base min-w-fit font-medium text-textSecondary text-right')}>{item}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default React.memo(ItemInfoCard);
