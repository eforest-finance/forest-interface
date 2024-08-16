import { useCallback } from 'react';
import { Button } from 'antd5/';
import { Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageEnhance } from 'components/ImgLoading';
import { formatTokenPrice } from 'utils/format';
import styles from './styles.module.css';
import BigNumber from 'bignumber.js';
import CollectionListMobile from './CollectionListMobile';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import { TrendingCollectionItem } from 'api/types';

export default function Trending({ items }: { items: TrendingCollectionItem[] }) {
  const { isSmallScreen } = useSelector(selectInfo);

  const renderNumberOfChange = (text: string | number) => {
    const num = Number(text);
    if (isNaN(num) || num === 0) return null;

    const percentStr = BigNumber(num).abs().times(100).toFixed(2, BigNumber.ROUND_DOWN);
    const percent = Number(percentStr);

    if (percent === 0) {
      return <span className="text-[18px] font-semibold text-textSecondary">0.00%</span>;
    }

    const textClassName = num < 0 ? 'text-functionalDanger' : 'text-functionalSuccess';

    let showStr = '';

    if (percent > 10000) {
      showStr = '>10000%';
    } else {
      showStr = `${num < 0 ? '-' : '+'}${percentStr}%`;
    }

    return <span className={`${textClassName} text-[18px] font-semibold`}>{showStr}</span>;
  };

  const CollectionItem = useCallback(({ item }: any) => {
    console.log('item', item);

    return (
      <Link className={styles.CollectionItem} href={`/explore-items/${item.id}`}>
        <div className="relative group w-full rounded-lg overflow-hidden border-[1px] border-solid border-[var(--line-border)]">
          <div className="relative">
            <div className="overflow-hidden">
              <ImageEnhance
                width={'100%'}
                className="w-full aspect-square overflow-hidden relative group-hover:scale-110 transition-all"
                src={item.previewImage}
              />
              <div className={styles['poster-shadow']} />
            </div>

            <div className="absolute w-[64px] h-[64px] z-[2] -bottom-[32px] left-[24px] rounded-lg overflow-hidden">
              <ImageEnhance
                width={'100%'}
                className=" w-full aspect-square overflow-hidden relative  transition-all"
                src={item.logoImage}
              />
            </div>
          </div>

          <div className="px-[24px] pt-[40px] pb-[24px]">
            <div className="font-semibold text-textPrimary text-[24px]">{item.tokenName}</div>
            <div className="flex justify-around my-[16px] h-[56px]">
              <span className="flex-1 w-[68px] text-textSecondary text-[18px] font-medium">Floor</span>

              <div className="flex flex-col items-end">
                <span className="flex items-center mb-[8px]">
                  <span className={'text-textPrimary text-[18px] font-semibold'}>
                    {(item.floorPrice || item.floorPrice === 0) && item.floorPrice >= 0
                      ? formatTokenPrice(item.floorPrice) + ' ' + (item.floorPriceSymbol || 'ELF')
                      : '-'}
                  </span>
                </span>
                <Tooltip title="24h Floor price changes">
                  <span>{renderNumberOfChange(item.floorChange)}</span>
                </Tooltip>
              </div>
            </div>

            <div className="flex justify-around my-[16px] h-[56px]">
              <span className="flex-1 w-[68px] text-textSecondary text-[18px] font-medium">30d Vol</span>
              <div className="flex flex-col items-end">
                <span className="flex items-center mb-[8px]">
                  <span className={'text-textPrimary text-[18px] font-semibold'}>
                    {(item.volumeTotal || item.volumeTotal === 0) && item.volumeTotal >= 0
                      ? formatTokenPrice(item.volumeTotal) + ' ' + (item.floorPriceSymbol || 'ELF')
                      : '-'}
                  </span>
                </span>
                <span>{renderNumberOfChange(item.volumeTotalChange)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }, []);

  return (
    <div className="mx-[24px] mdl:mx-[40px] mt-[48px] mdl:mt-[64px] flex items-center justify-center">
      <div className="max-w-[1840px] w-full overflow-hidden">
        <h2 className="mb-[16px] mdl:mb-[24px] text-[24px] font-semibold text-textPrimary">Trending Collections</h2>

        {isSmallScreen ? (
          <div className="w-[calc(100vw-48px)]">
            <CollectionListMobile items={items} />
          </div>
        ) : (
          <div className="w-full overflow-hidden whitespace-nowrap">
            {items.map((item, index: number) => (
              <CollectionItem key={`CollectionItem-${index}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
