import useGetState from 'store/state/getState';
import {
  getDefaultFilter,
  getFilter,
  getFilterFromSearchParams,
  getFilterListForActivity,
} from '../components/Filters/util';
import { useRequest } from 'ahooks';
import { fetchCollectionAllTraitsInfos } from 'api/fetch';
import { useState } from 'react';
import { isEqual } from 'lodash-es';
import { useSearchParams } from 'next/navigation';

export function useFilterForActivitiesService(nftCollectionId: string) {
  const nftType = String(nftCollectionId).endsWith('-SEED-0') ? 'seed' : 'nft';

  const { aelfInfo } = useGetState();
  const defaultFilter = getDefaultFilter(aelfInfo.curChain);
  const filterList = getFilterListForActivity(nftType, aelfInfo.curChain);
  const params = useSearchParams();
  const filterParamStr = params.get('filterParams');

  // const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);

  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamStr, []);
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(
    Object.assign({}, defaultFilter, paramsFromUrlForFilter),
  );

  console.log('filterSelect:', filterSelect);

  const clearAll = () => {
    if (isEqual(defaultFilter, filterSelect)) return;
    setFilterSelect(defaultFilter);
  };

  const { data: traitsInfo } = useRequest(() => fetchCollectionAllTraitsInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
    cacheKey: `all-traits-info-${nftCollectionId}`,
    staleTime: 300000,
  });

  const onFilterChange = (val: ItemsSelectSourceType) => {
    setFilterSelect((pre) => ({
      ...pre,
      ...val,
    }));
  };

  return {
    traitsInfo,
    filterList,
    filterSelect,
    setFilterSelect,
    onFilterChange,
    clearAll,
    formatFilterToParams: getFilter,
  };
}
