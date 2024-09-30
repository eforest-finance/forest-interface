// import { useSearchParams } from 'next/navigation';
import useGetState from 'store/state/getState';
import { getDefaultFilter, getFilter, getFilterList, getFilterFromSearchParams } from '../components/Filters/util';
import { useRequest } from 'ahooks';
import { fetchCollectionAllTraitsInfos, fetchCollectionGenerationInfos, fetchCollectionRarityInfos } from 'api/fetch';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';
import qs from 'query-string';

export function useFilterForItemService(nftCollectionId: string) {
  const nftType = String(nftCollectionId).endsWith('-SEED-0') ? 'seed' : 'nft';

  const { aelfInfo, walletInfo } = useGetState();

  const { data: generationInfos } = useRequest(() => fetchCollectionGenerationInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
    cacheKey: `all-generation-info-${nftCollectionId}`,
    staleTime: 300000,
  });

  const filterParamObj: any = qs.parse(location.search);
  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamObj, []);

  const defaultFilter = getDefaultFilter(aelfInfo.curChain);
  const filterList = getFilterList(nftType, aelfInfo.curChain);

  const [filterSelect, setFilterSelect] = useState(defaultFilter);

  useEffect(() => {
    setFilterSelect((prevData) => ({
      ...prevData,
      ...paramsFromUrlForFilter,
    }));
  }, []);

  // const getFilterBySearchQuery = (val: IFilterSelect) => {
  //   setFilterSelect((pre) => ({
  //     ...pre,
  //     ...val,
  //   }));
  // };

  // useEffect(() => {
  //   getFilterBySearchQuery(initFilter);
  // }, []);

  const clearAll = () => {
    if (isEqual(defaultFilter, filterSelect)) return;
    setFilterSelect(defaultFilter);
  };

  const { data: traitsInfo } = useRequest(() => fetchCollectionAllTraitsInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
    cacheKey: `all-traits-info-${nftCollectionId}`,
    staleTime: 300000,
  });

  const { data: rarityInfos } = useRequest(
    () => {
      const isSchrondinger = nftCollectionId.endsWith('-SGRTEST-0') || nftCollectionId.endsWith('-SGR-0');

      const arrList = isSchrondinger
        ? [
            {
              rarity: 'Diamond',
            },
            {
              rarity: 'Emerald',
            },
            {
              rarity: 'Platinum',
            },
            {
              rarity: 'Gold',
            },
            {
              rarity: 'Silver',
            },
            {
              rarity: 'Bronze',
            },
          ]
        : [];

      return Promise.resolve({
        items: arrList,
      });
    },
    {
      refreshDeps: [nftCollectionId],
    },
  );

  const onFilterChange = (val: ItemsSelectSourceType) => {
    setFilterSelect((pre: any) => ({
      ...pre,
      ...val,
    }));
  };

  console.log('filterSelect----filterSelect', filterSelect);

  return {
    traitsInfo,
    generationInfos,
    rarityInfos,
    filterList,
    filterSelect,
    setFilterSelect,
    onFilterChange,
    clearAll,
    formatFilterToParams: getFilter,
  };
}
