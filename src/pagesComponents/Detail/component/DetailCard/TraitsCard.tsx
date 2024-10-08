import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import { Tooltip } from 'antd';
import { useEffect, useMemo } from 'react';
import { formatShowEmptyValue } from 'utils/format';
import { ITraitInfo } from 'types/nftTypes';
import Link from 'next/link';
import { getRarity, getRarityEnhance } from 'utils/getTraitsForUI';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
  InscriptionInfo = 'InscriptionInfo',
  Traits = 'Traits',
}
export function TraitsInfoCard() {
  const { detailInfo } = useDetailGetState();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { nftTraitInfos, nftInfo, nftRankingInfos } = detailInfo;

  useEffect(() => {
    if (!nftTraitInfos?.traitInfos?.length) return;
    try {
      const map: {
        [key: string]: string;
      } = {
        'Weapon(Left Hand)': 'Weapon',
        'Accessory(Right Hand)': 'Accessory',
        Wing: 'Wings',
        Moustauch: 'Mustache',
        Mustaches: 'Mustache',
      };
      const keys = nftTraitInfos.traitInfos.map((itm) => map[itm.key.trim()] || itm.key.trim());
      const values = nftTraitInfos.traitInfos.map((itm) => itm.value);

      getRarity(keys, values);
    } catch (err) {
      console.warn('getRarity error', err);
    }
  }, [nftTraitInfos]);

  const getItemPercent = ({ itemsCount, allItemsCount, key, value }: ITraitInfo) => {
    const num = itemsCount / allItemsCount;
    if (isNaN(num) || num < 0) {
      return '-';
    }
    const percentOfItemsCount = `${(num * 100).toFixed(2)}%`;

    if (!nftRankingInfos) {
      return percentOfItemsCount;
    }

    const rarityNumber = getRarityEnhance(key, value, nftRankingInfos);
    if (!rarityNumber || isNaN(Number(rarityNumber))) return percentOfItemsCount;

    const percentOfRarity = `${(Number(rarityNumber) * 100).toFixed(2)}%`;

    return `${percentOfItemsCount}(${percentOfRarity})`;
  };

  const itemsForCollapseComp = useMemo(() => {
    const arr = [];
    const getFloorPriceStr = (traitInfo: ITraitInfo) => {
      return `Floor: ${formatShowEmptyValue(traitInfo?.itemFloorPrice)} ${
        traitInfo?.itemFloorPriceToken?.symbol || 'ELF'
      }`;
    };
    if (nftTraitInfos?.traitInfos && nftTraitInfos.traitInfos.length) {
      const childComp = !isSmallScreen ? (
        <div className=" grid grid-cols-3 gap-1 p-2">
          {nftTraitInfos.traitInfos.map((traitInfo) => {
            const fllorPriceStr = getFloorPriceStr(traitInfo);
            const filterParams = {
              [FilterKeyEnum.Traits]: [
                {
                  key: traitInfo.key,
                  values: [traitInfo.value],
                },
              ],
            };
            const str = `filterParams=${encodeURI(JSON.stringify(filterParams))}`;

            return (
              <Link key={traitInfo.key} href={`/explore-items/${detailInfo.nftInfo?.nftCollection?.id}?${str}`}>
                <div className="flex flex-col items-center rounded-md py-[9px] px-[6px] bg-fillHoverBg cursor-pointer">
                  <Tooltip title={traitInfo.key}>
                    <div className="w-full text-center text-textPrimary text-xs font-medium overflow-hidden  text-ellipsis whitespace-nowrap cursor-pointer">
                      {traitInfo.key}
                    </div>
                  </Tooltip>
                  <Tooltip title={traitInfo.value}>
                    <div className="w-full text-center text-textPrimary text-sm font-semibold mt-[6px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                      {traitInfo.value}
                    </div>
                  </Tooltip>
                  <div className=" text-textSecondary text-xs mt-[2px]">{traitInfo.itemsCount}</div>
                  <div className=" text-textSecondary text-xs mt-[2px]">{getItemPercent(traitInfo)}</div>
                  <Tooltip title={fllorPriceStr}>
                    <div className=" w-full text-center text-xs h-5 text-textSecondary mt-[6px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
                      {fllorPriceStr}
                    </div>
                  </Tooltip>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 border-0 border-t !border-solid border-lineBorder pt-2">
          {nftTraitInfos.traitInfos.map((traitInfo) => {
            const fllorPriceStr = getFloorPriceStr(traitInfo);
            const filterParams = {
              [FilterKeyEnum.Traits]: [
                {
                  key: traitInfo.key,
                  values: [traitInfo.value],
                },
              ],
            };
            const str = `filterParams=${encodeURI(JSON.stringify(filterParams))}`;
            return (
              <Link key={traitInfo.key} href={`/explore-items/${detailInfo.nftInfo?.nftCollection?.id}?${str}`}>
                <div className="flex flex-col items-center rounded-md p-4 mx-2 bg-fillHoverBg cursor-pointer">
                  <div className="flex w-full justify-between">
                    <span className="text-textPrimary text-xs font-medium">{traitInfo.key}</span>
                    <span className=" text-textSecondary text-xs mt-[2px]">
                      {traitInfo.itemsCount} - {getItemPercent(traitInfo)}
                    </span>
                  </div>
                  <div className="flex w-full justify-between mt-2">
                    <span className="text-textPrimary text-sm font-semibold">{traitInfo.value}</span>
                    <span className=" text-textSecondary text-xs">{fllorPriceStr}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      );

      arr.push({
        key: FilterKeyEnum.Traits,
        header: <div className={styles.title}>Traits</div>,
        children: childComp,
      });
    }

    return arr;
  }, [nftTraitInfos, nftInfo, nftRankingInfos]);

  if (!itemsForCollapseComp.length) return null;

  return (
    <CollapseForPC
      defaultActiveKey={FilterKeyEnum.Traits}
      items={itemsForCollapseComp}
      wrapClassName={styles['detail-card']}
    />
  );
}
