import Image from 'next/image';
import styles from './style.module.css';
import { ISeedItemData } from 'api/types';
import BigNumber from 'bignumber.js';
import { useRecommendSeedLogic, SEED_STATUS, fixedPrice } from './useRecommendSeedLogic';
import seedImg from 'assets/images/card.png';
import { useMemo } from 'react';
import Button from 'baseComponents/Button';

interface ISeedItemCardProps {
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

function SeedItemCard({ seedItemData, itemClick }: ISeedItemCardProps) {
  const checked = seedItemData.seedType === 3 && seedItemData.topBidPrice;
  const price = checked ? seedItemData.topBidPrice?.amount : seedItemData.tokenPrice?.amount;
  const symbol = checked ? seedItemData.topBidPrice?.symbol : seedItemData.tokenPrice?.symbol;
  const formatSeedPrice = price || price === 0 ? fixedPrice(new BigNumber(price).div(10 ** 8).toNumber(), 4) : '-';

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
    <div className={styles['seed-item-card']} onClick={itemClick}>
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
        <div className="font-bold text-[20px]">
          <span className="text-[#8B60F7]">SEED-</span>
          <span className="text-[var(--text-item)] break-words break-all">{seedItemData.symbol || ''}</span>
        </div>
      </div>
      <div className="flex flex-col mt-[32px]">
        <span className="text-[var(--color-placeholder)] text-[14px] leading-normal">{titleForShow}</span>
        <span className="font-semibold text-[16px] leading-normal text-[var(--text-item)]">{`${formatSeedPrice} ${
          formatSeedPrice !== '-' && symbol
        }`}</span>
      </div>
    </div>
  );
}

export function RecommendSeeds() {
  const { goTsm, gotTsmSeedDetail, seedList } = useRecommendSeedLogic();

  if (!seedList.length) return null;

  return (
    <section className="max-w-[1200px] xlTW:max-w-[1280px] mx-auto">
      <h2 className="text-[var(--text-item)] mdTW:mt-[80px] mdTW:text-[32px] text-[24px] mdTW:leading-[40px] leading-[32px] font-semibold mdTW:mb-[48px] mb-[24px] max-w-[772px] text-center mx-auto">
        Get your own SEED and create a unique token
      </h2>
      <main className="grid grid-cols-1 gap-[16px] mdb:grid-cols-2 xl:grid-cols-3">
        {seedList.map((itemData) => (
          <SeedItemCard
            key={itemData.seedName}
            seedItemData={itemData}
            itemClick={() => {
              gotTsmSeedDetail(itemData.tokenType, itemData.symbol);
            }}
          />
        ))}
      </main>
      <footer className="mt-[16px] mdTW:mt-[24px] w-full mdb:w-[166px] mx-auto">
        <Button isFull={true} onClick={goTsm}>
          View More
        </Button>
      </footer>
    </section>
  );
}
