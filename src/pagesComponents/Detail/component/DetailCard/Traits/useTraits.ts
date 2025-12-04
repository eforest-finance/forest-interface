import moment from 'moment';
import { useEffect, useMemo } from 'react';
import useDetailGetState from 'store/state/detailGetState';
import { ITraitInfo } from 'types/nftTypes';
import { getRarity, getRarityEnhance } from 'utils/getTraitsForUI';

export enum CollectionType {
  SGR = 'SGR',
  SEED = 'SEED',
  NORMAL = 'NORMAL',
}

export enum TraitColor {
  YELLOW = '#FFF3E0',
  PURPLE = '#EDE6F9',
  BLUE = '#E2F0FF',
  GREEN = '#E0F6E8',
  GRAY = '#F8F8F8',
}

export enum TraitTextColor {
  YELLOW = '#F90',
  PURPLE = '#652BCF',
  BLUE = '#1B76E2',
  GREEN = '#00B73E',
  GRAY = '#8F8F92',
}

const useTraits = () => {
  const { detailInfo } = useDetailGetState();

  const { nftTraitInfos, nftInfo, nftRankingInfos } = detailInfo;

  const traitsType = useMemo(() => {
    const collectionSymbol = nftInfo?.nftCollection?.symbol.split('-')[0];
    let type = CollectionType.NORMAL;
    switch (collectionSymbol) {
      case 'SGR':
        type = CollectionType.SGR;
        break;
      case 'SEED':
        type = CollectionType.SEED;
        break;

      default:
        break;
    }

    return type;
  }, [nftInfo?.nftCollection?.symbol]);

  const getColor = (percent: number) => {
    if (percent < 0.001) {
      return [TraitColor.YELLOW, TraitTextColor.YELLOW];
    }
    if (percent < 0.01) {
      return [TraitColor.PURPLE, TraitTextColor.PURPLE];
    }
    if (percent < 0.1) {
      return [TraitColor.BLUE, TraitTextColor.BLUE];
    }
    if (percent < 0.5) {
      return [TraitColor.GREEN, TraitTextColor.GREEN];
    }
    return [TraitColor.GRAY, TraitTextColor.GRAY];
  };

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

  nftInfo?.createTokenInformation?.expires
    ? `${moment.unix(nftInfo.createTokenInformation.expires).utc().format('MMM DD YYYY HH:mm:ss')} UTC`
    : '-';

  const traitsData = useMemo(() => {
    if (traitsType === CollectionType.SEED) {
      return [
        ['Type', nftInfo?.createTokenInformation?.category],
        ['Token Symbol', nftInfo?.createTokenInformation?.tokenSymbol],
        [
          'Takes Effect',
          nftInfo?.createTokenInformation?.registered
            ? `${moment.unix(nftInfo.createTokenInformation.registered).utc().format('MMM DD YYYY HH:mm:ss')} UTC`
            : '-',
        ],
        [
          'Expires',
          nftInfo?.createTokenInformation?.expires
            ? `${moment.unix(nftInfo.createTokenInformation.expires).utc().format('MMM DD YYYY HH:mm:ss')} UTC`
            : '-',
        ],
      ];
    }

    if (nftTraitInfos && nftTraitInfos.traitInfos) {
      const normalTraitsData = nftTraitInfos.traitInfos.map((info) => {
        const { key, value, allItemsCount, itemsCount, itemFloorPrice } = info;
        const percent = getItemPercent({ itemsCount, allItemsCount, key, value });
        const option = getColor(itemsCount / allItemsCount);
        return [key, itemFloorPrice > 0 ? itemFloorPrice : '--', value, percent, option];
      });

      console.log('normalTraitsData:', normalTraitsData);

      return normalTraitsData;
    }
    return [];
  }, [traitsType, nftTraitInfos]);

  const noTraits = useMemo(() => {
    const t = nftInfo && !nftInfo?.describe && (!traitsData || !traitsData.length);
    return t;
  }, [nftInfo, traitsData, nftInfo?.describe]);

  return {
    traitsType,
    traitsData,
    noTraits,
  };
};
export default useTraits;
