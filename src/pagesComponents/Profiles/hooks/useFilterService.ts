import { useRequest } from 'ahooks';
import { fetchCollections, fetchNFTCollectionMyHold } from 'api/fetch';
import {
  getDefaultFilterForMyItems,
  getFilterListForMyItem,
  getTagList,
} from 'pagesComponents/ExploreItem/components/Filters/util';
import { useMemo, useState } from 'react';
import useGetState from 'store/state/getState';

export function useFilterService(tabType: string, walletAddress: string, searchKeyWord?: string) {
  const { aelfInfo, walletInfo } = useGetState();

  const defaultFilter = getDefaultFilterForMyItems(aelfInfo.curChain);

  const filterList = getFilterListForMyItem(aelfInfo.curChain);

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);

  const { data } = useRequest(
    () =>
      fetchNFTCollectionMyHold({
        skipCount: 0,
        maxResultCount: 100,
        address: walletAddress,
        keyWord: '',
        queryType: 'holding',
      }),
    {
      cacheKey: 'myhold-collection-all',
    },
  );

  const { data: myCreatedCollectionList } = useRequest(
    () => {
      return fetchCollections({
        skipCount: 0,
        maxResultCount: 1000,
        addressList: [walletAddress],
      });
    },
    {
      refreshDeps: [walletAddress],
    },
  );

  const onFilterChange = (val: ItemsSelectSourceType) => {
    setFilterSelect((pre) => ({
      ...pre,
      ...val,
    }));
  };

  const clearAll = () => {
    setFilterSelect(defaultFilter);
  };

  const tagList = useMemo(() => {
    return getTagList(filterSelect, searchKeyWord?.trim() || '');
  }, [filterSelect, searchKeyWord]);

  return {
    filterList,
    collectionInfos: tabType === 'created' ? myCreatedCollectionList?.items || [] : data?.items || [],
    totalCount: tabType === 'created' ? myCreatedCollectionList?.totalCount || 0 : data?.totalCount || 0,
    filterSelect,
    onFilterChange,
    clearAll,
    tagList,
  };
}
