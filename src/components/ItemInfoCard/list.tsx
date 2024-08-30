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

interface INftInfoListCardProps {
  list: INftInfoListCard[];
}

const ItemInfoCard = (props: INftInfoListCardProps) => {
  const { list } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  console.log('list:', list);

  return (
    <div className="max-h-[470px] overflow-y-scroll">
      {list.map(({ image, collectionName, nftName, item, priceTitle, price, usdPrice, number }, idx: number) => {
        return (
          <div key={`list-${idx}`} className={`${idx < list.length - 1 ? 'mb-[24px] mdl:mb-[32px]' : ''}`}>
            <div className="flex justify-between overflow-hidden">
              <div className="flex items-center mdl:mr-[16px] overflow-hidden mdl:flex-1">
                {image && (
                  <div className="w-[84px] h-[84px] mr-[16px] flex justify-center items-center overflow-hidden rounded-md border border-solid border-lineBorder">
                    <ImageEnhance src={image} className="!rounded-none !w-[84px] !h-[84px]" />
                  </div>
                )}

                {!isSmallScreen && (
                  <div className="flex flex-1 flex-col min-h-full items-start overflow-hidden">
                    {collectionName && (
                      <>
                        <p
                          className={clsx(
                            'text-[20px] font-semibold !text-textPrimary',
                            styles['nft-list-card-text-ellipsis'],
                          )}>
                          {collectionName}
                          {!!number && number > 0 && (
                            <span className="inline-block text-[16px] text-brandNormal rounded-[4px] ml-[8px] !h-[24px] bg-functionalLinkBg px-[8px] line-[24px]">
                              x {number}
                            </span>
                          )}
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
              {isSmallScreen && (
                <div className="flex flex-1 flex-col items-start overflow-hidden justify-center">
                  <p className={clsx('flex text-xl font-semibold text-textPrimary')}>
                    {nftName}
                    {number && number > 0 && (
                      <span className="flex justify-center items-center w-fit  text-[16px] text-brandNormal rounded-[4px] ml-[8px] !h-[24px] bg-functionalLinkBg px-[8px] line-[24px]">
                        x {number}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center mt-[16px] justify-between w-full">
                    <p className={clsx('text-base font-medium  !text-textPrimary')}>{collectionName}</p>
                  </div>
                </div>
              )}
              {!isSmallScreen && (
                <div className="flex min-w-fit flex-col justify-center items-end">
                  {priceTitle && <p className="text-base font-medium text-textSecondary">{priceTitle}</p>}
                  {price && <p className="text-xl font-semibold text-textPrimary">{price}</p>}
                  {usdPrice && <p className="text-base font-medium text-textSecondary">{usdPrice}</p>}
                </div>
              )}
            </div>

            {isSmallScreen && (
              <div className="flex min-w-fit justify-between mt-[16px]">
                {priceTitle && <p className="text-base font-medium text-textSecondary">{priceTitle}</p>}
                <div>
                  {price && <div className="text-[18px] font-semibold text-textPrimary">{price}</div>}
                  {usdPrice && <div className="text-[14px] font-medium text-textSecondary">{usdPrice}</div>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ItemInfoCard);
