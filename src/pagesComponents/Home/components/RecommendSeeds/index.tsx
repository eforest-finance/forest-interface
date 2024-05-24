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
        <div className=" font-semibold text-xl">
          <span className="text-[#8B60F7]">SEED-</span>
          <span className="text-textPrimary break-words break-all">{seedItemData.symbol || ''}</span>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <span className="text-textSecondary text-sm">{titleForShow}</span>
        <span className="font-semibold text-base leading-normal text-textPrimary">{`${formatSeedPrice} ${
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
    <section className="w-full">
      <div className="flex justify-between items-center mt-8 mb-4 mdTW:mt-12 text-textPrimary text-xl mdTW:text-2xl font-semibold ">
        <span>Get your SEED</span>
        <div className="hidden mdTW:inline-flex">
          <Button
            size="middle"
            type="text"
            className="hover:!bg-fillHoverBg !bg-fillCardBg !text-textPrimary !rounded-md"
            onClick={goTsm}>
            View All
          </Button>
        </div>
      </div>
      <main className="grid grid-cols-1 gap-[16px] mdb:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
      <footer className="mt-4 mdTW:hidden w-full mdb:w-[166px] mx-auto">
        <Button
          isFull={true}
          type="text"
          className="hover:!bg-fillHoverBg !bg-fillCardBg !text-textPrimary !rounded-md"
          onClick={goTsm}>
          View All
        </Button>
      </footer>
    </section>
  );
}
