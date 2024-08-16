import { ISeedItemData } from 'api/types';
import { useRecommendSeedLogic, SEED_STATUS, fixedPrice } from './useRecommendSeedLogic';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import styles from './style.module.css';
import Image from 'next/image';
import seedImg from 'assets/images/card.png';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

export interface ISeedItemCardProps {
  className?: string;
  seedItemData: ISeedItemData;
  itemClick: () => void;
}

function SeedAdaptiveImage({ symbol, className }: { symbol: string; className?: string }) {
  return (
    <div className={`${styles.adaptive} ${className}`}>
      <Image src={seedImg} alt="" width={60} height={60} className="w-full h-auto rounded-md" />
      <div className="w-full h-full absolute left-0 text-center right-0 top-0 bottom-0 box-border px-[5px] flex items-center justify-center flex-wrap">
        <span
          className={`break-all text-xs !text-white flex items-center leading-[18px] ${
            symbol && symbol.length > 5 ? styles.fiv : styles.eight
          } `}>
          {symbol}
        </span>
      </div>
    </div>
  );
}

function SeedItemCard({ seedItemData, itemClick, className }: ISeedItemCardProps) {
  const checked = seedItemData.seedType === 3 && seedItemData.topBidPrice;
  const price = checked ? seedItemData.topBidPrice?.amount : seedItemData.tokenPrice?.amount;
  const symbol = checked ? seedItemData.topBidPrice?.symbol : seedItemData.tokenPrice?.symbol;
  const formatSeedPrice = price || price === 0 ? fixedPrice(new BigNumber(price).div(10 ** 8).toNumber(), 4) : '-';

  const { isSmallScreen } = useSelector(selectInfo);

  const titleForShow = useMemo(() => {
    if (seedItemData.seedType === 3) {
      if (seedItemData.status === SEED_STATUS.AVAILABLE) {
        return 'Awaiting Auction';
      }
      if (seedItemData.status === SEED_STATUS.UNREGISTERED) {
        if (!seedItemData.auctionEndTime) {
          return 'Awaiting Auction';
        }
        if (seedItemData.auctionEndTime * 1000 - Date.now() > 0) {
          return 'Top Bid';
        }
      }
      return 'Top Bid';
    }
    return 'Current Price';
  }, [seedItemData]);
  return (
    <div className={`${styles['seed-item-card']} ${className}`} onClick={itemClick}>
      {isSmallScreen ? (
        <>
          <div className="w-[60Px] flex-none h-[60Px] rounded-[6Px] mr-[12Px] overflow-hidden">
            {seedItemData?.seedImage ? (
              <Image
                src={seedItemData?.seedImage || ''}
                width={60}
                height={60}
                className="w-full h-full"
                alt="seed logo"
              />
            ) : (
              <SeedAdaptiveImage symbol={seedItemData.symbol} />
            )}
          </div>
          <div className=" font-semibold text-xl mt-[16px]">
            <span className="text-[#8B60F7]">SEED-</span>
            <span className="text-textPrimary break-words break-all">{seedItemData.symbol || ''}</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <div className="w-[60Px] flex-none h-[60Px] rounded-[6Px] mr-[12Px] overflow-hidden">
              {seedItemData?.seedImage ? (
                <Image
                  src={seedItemData?.seedImage || ''}
                  width={60}
                  height={60}
                  className="w-full h-full"
                  alt="seed logo"
                />
              ) : (
                <SeedAdaptiveImage symbol={seedItemData.symbol} />
              )}
            </div>
            <div className=" font-semibold text-xl">
              <span className="text-[#8B60F7]">SEED-</span>
              <span className="text-textPrimary break-words break-all">{seedItemData.symbol || ''}</span>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col mt-8">
        <span className="text-textSecondary text-sm">{titleForShow}</span>
        <span className="font-semibold text-base leading-normal text-textPrimary">{`${formatSeedPrice} ${
          formatSeedPrice !== '-' && symbol
        }`}</span>
      </div>
    </div>
  );
}

export default SeedItemCard;
