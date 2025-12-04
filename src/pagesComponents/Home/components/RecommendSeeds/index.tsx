import Image from 'next/image';
import styles from './style.module.css';
import { ISeedItemData } from 'api/types';
import BigNumber from 'bignumber.js';
import { useRecommendSeedLogic, SEED_STATUS, fixedPrice } from './useRecommendSeedLogic';
import seedImg from 'assets/images/card.png';
import { useEffect, useMemo, useState } from 'react';
import Button from 'baseComponents/Button';
import { Button as AntdButton } from 'antd';
import SeedsMobile from './SeedsMobile';

import Vector from 'assets/images/v2/Vector.svg';

import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
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
      <div className="flex flex-col mt-[32px]">
        <span className="text-textSecondary text-sm">{titleForShow}</span>
        <span className="font-semibold text-base leading-normal text-textPrimary">{`${formatSeedPrice} ${
          formatSeedPrice !== '-' && symbol
        }`}</span>
      </div>
    </div>
  );
}

export function RecommendSeeds() {
  const { isSmallScreen } = useSelector(selectInfo);

  const { goMedia, goTsm, gotTsmSeedDetail, seedList } = useRecommendSeedLogic();
  const [seedGroups, setSeedGroups] = useState<[ISeedItemData[], ISeedItemData[]]>([[], []]);
  useEffect(() => {
    const seedGroup1 = [] as any;
    const seedGroup2 = [] as any;

    if (seedList.length > 1) {
      seedList.forEach((item, idx: number) => {
        if (idx < seedList.length / 2) {
          seedGroup1.push(item);
        } else {
          seedGroup2.push(item);
        }
      });

      setSeedGroups([seedGroup1, seedGroup2]);
    }
  }, [seedList]);

  if (!seedList.length) return null;

  const [topSeedGroups, bottomSeedGroups] = seedGroups;

  return (
    <section className={styles.wrapper}>
      <div className="flex justify-between items-center mt-[48px] mb-4 text-textPrimary text-xl mdTW:text-2xl font-semibold ">
        <span>Get your SEED</span>
      </div>
      {isSmallScreen ? (
        <>
          <span className="text-textSecondary mt-[8px] text-[14px] font-normal line-[22px]">
            Get a unique SEED to create your own tokens and NFTs on the aelf blockchain
          </span>
          <div className="w-[calc(100vw-48px)]">
            <SeedsMobile items={seedList} />
          </div>
          <Button
            size="middle"
            type="text"
            className="my-[16px] flex justify-center !h-[48px] w-full items-center !bg-white !text-textPrimary !rounded-lg !border  !border-solid !border-[var(--border-menu)]"
            onClick={goTsm}>
            <Vector className="mr-[8px]" />
            Symbol Market
          </Button>
          <Button
            size="middle"
            type="text"
            className="!h-[48px] w-full !bg-fillCardBg !text-textPrimary !rounded-lg mb-[48px]"
            onClick={goMedia}>
            Learn about Seed
          </Button>
        </>
      ) : (
        <>
          <div className="mb-[24px] flex justify-between">
            <span className="m-auto flex-1 text-textSecondary mt-[8px] text-[16px] font-normal">
              Get a unique SEED to create your own tokens and NFTs on the aelf blockchain
            </span>
            <Button
              size="middle"
              type="text"
              className="h-[40px] mr-[32px] hover:!bg-fillHoverBg !bg-fillCardBg !text-textPrimary !rounded-md"
              onClick={goMedia}>
              Learn about Seed
            </Button>
            <Button
              size="middle"
              type="text"
              className="h-[40px] flex items-center hover:!bg-fillHoverBg !bg-white !text-textPrimary !rounded-md !border  !border-solid !border-[var(--border-menu)]"
              onClick={goTsm}>
              <Vector className="mr-[4px]" />
              Symbol Market
            </Button>
          </div>
          <div className="w-full">
            <div className={styles.scroll} style={{ '--t': '120s' }}>
              <span className={`inline-block w-[3680px] ${styles['track-first']}`}>
                {topSeedGroups.map((itemData) => (
                  <SeedItemCard
                    key={itemData.seedName}
                    seedItemData={itemData}
                    itemClick={() => {
                      gotTsmSeedDetail(itemData.tokenType, itemData.symbol);
                    }}
                  />
                ))}
              </span>
              <span className={`inline-block w-[3680px] ${styles['track-second']}`}>
                {topSeedGroups.map((itemData) => (
                  <SeedItemCard
                    key={itemData.seedName}
                    seedItemData={itemData}
                    itemClick={() => {
                      gotTsmSeedDetail(itemData.tokenType, itemData.symbol);
                    }}
                  />
                ))}
              </span>
            </div>

            <div className={`${styles.scrollRight}`} style={{ '--t': '120s' }}>
              <span className={`inline-block w-[3680px] ${styles['track-first']}`}>
                {bottomSeedGroups.map((itemData) => (
                  <SeedItemCard
                    key={itemData.seedName}
                    seedItemData={itemData}
                    itemClick={() => {
                      gotTsmSeedDetail(itemData.tokenType, itemData.symbol);
                    }}
                  />
                ))}
              </span>

              <span className={`inline-block w-[3680px] ${styles['track-second']}`}>
                {bottomSeedGroups.map((itemData) => (
                  <SeedItemCard
                    key={itemData.seedName}
                    seedItemData={itemData}
                    itemClick={() => {
                      gotTsmSeedDetail(itemData.tokenType, itemData.symbol);
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
