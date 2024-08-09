import { useDebounceFn, useRequest } from 'ahooks';
import { fetchCollections, fetchNFTCollectionMyHold } from 'api/fetch';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import { useSearchParams } from 'next/navigation';
import {
  getDefaultFilterForMyItems,
  getFilterFromSearchParams,
  getFilterListForMyItem,
  getTagList,
} from 'pagesComponents/ExploreItem/components/Filters/util';
import { useMemo, useState } from 'react';
import useGetState from 'store/state/getState';

export function useFilterService(tabType: string, walletAddress: string) {
  const { aelfInfo, walletInfo } = useGetState();

  const defaultFilter = getDefaultFilterForMyItems(aelfInfo.curChain);

  const filterList = getFilterListForMyItem(aelfInfo.curChain);

  const params = useSearchParams();
  const filterParamStr = params.get('filterParams');

  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamStr, []);
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(
    Object.assign({}, defaultFilter, paramsFromUrlForFilter),
  );

  const [SearchParam, setSearchParam] = useState<string>(filterSelect.keyword || '');
  const [searchInputValue, setSearchInputValue] = useState<string>(SearchParam);

  console.log('filterSelect:', filterSelect);

  const [sort, setSort] = useState<string>(filterSelect.Sorting || (dropDownCollectionsMenu.data[0].value as string));

  console.log('filterSelect:', sort);

  const { run: changeSearchParam } = useDebounceFn(
    (searchKeyWord: string) => {
      setSearchParam(searchKeyWord.trim());
    },
    {
      wait: 500,
    },
  );

  const searchInputValueChange = (e: any) => {
    setSearchInputValue(e.target.value);
    changeSearchParam(e.target.value);
  };

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
    return getTagList(filterSelect, SearchParam?.trim() || '');
  }, [filterSelect, SearchParam]);

  return {
    filterList,
    collectionInfos: tabType === 'created' ? myCreatedCollectionList?.items || [] : data?.items || [],
    totalCount: tabType === 'created' ? myCreatedCollectionList?.totalCount || 0 : data?.totalCount || 0,
    filterSelect,
    onFilterChange,
    clearAll,
    tagList,
    sort,
    setSort,
    SearchParam,
    searchInputValue,
    setSearchParam,
    setSearchInputValue,
    searchInputValueChange,
  };
}
