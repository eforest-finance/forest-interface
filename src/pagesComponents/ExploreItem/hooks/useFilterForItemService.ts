import { useSearchParams } from 'next/navigation';
import useGetState from 'store/state/getState';
import { getDefaultFilter, getFilter, getFilterFromSearchParams, getFilterList } from '../components/Filters/util';
import { useRequest } from 'ahooks';
import { fetchCollectionAllTraitsInfos, fetchCollectionGenerationInfos } from 'api/fetch';
import { useState } from 'react';
import { isEqual } from 'lodash-es';

export function useFilterForItemService(nftCollectionId: string) {
  const nftType = String(nftCollectionId).endsWith('-SEED-0') ? 'seed' : 'nft';

  const { aelfInfo } = useGetState();
  const params = useSearchParams();
  const filterParamStr = params.get('filterParams');
  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamStr);
  const defaultFilter = getDefaultFilter(aelfInfo.curChain);
  const filterList = getFilterList(nftType, aelfInfo.curChain);

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(
    Object.assign({}, defaultFilter, paramsFromUrlForFilter),
  );

  const clearAll = () => {
    if (isEqual(defaultFilter, filterSelect)) return;
    setFilterSelect(defaultFilter);
  };

  const { data: traitsInfo } = useRequest(() => fetchCollectionAllTraitsInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
    cacheKey: `all-traits-info-${nftCollectionId}`,
    staleTime: 300000,
  });
  const { data: generationInfos } = useRequest(() => fetchCollectionGenerationInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
    cacheKey: `all-generation-info-${nftCollectionId}`,
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
    generationInfos,
    filterList,
    filterSelect,
    setFilterSelect,
    onFilterChange,
    clearAll,
    formatFilterToParams: getFilter,
  };
}
