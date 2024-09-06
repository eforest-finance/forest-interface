import { useDebounceFn, useRequest } from 'ahooks';
import { fetchCollections, fetchNFTCollectionMyHold } from 'api/fetch';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import {
  getDefaultFilterForMyItems,
  getFilterFromSearchParams,
  getFilterListForMyItem,
  getTagList,
} from 'pagesComponents/ExploreItem/components/Filters/util';
import { useEffect, useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import qs from 'query-string';

export function useFilterService(tabType: string, walletAddress: string) {
  const { aelfInfo, walletInfo } = useGetState();

  const defaultFilter = getDefaultFilterForMyItems(aelfInfo.curChain);

  const filterList = getFilterListForMyItem(aelfInfo.curChain);

  // const params = useSearchParams();
  // const filterParamStr = params.get('filterParams');

  const filterParamObj: any = qs.parse(location.search);

  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamObj, []);

  const [filterSelect, setFilterSelect] = useState(Object.assign({}, defaultFilter, paramsFromUrlForFilter));

  const initParams = () => {
    switch (tabType) {
      case 'activity':
        return filterSelect.SearchParam;
      case 'more':
        return filterSelect.SearchParam;
      default:
        return filterSelect.keyword;
    }
  };

  const [SearchParam, setSearchParam] = useState<string>(initParams());
  const [searchInputValue, setSearchInputValue] = useState<string>(SearchParam);

  const [sort, setSort] = useState<string>(filterSelect.Sorting || (dropDownCollectionsMenu.data[0].value as string));

  const [size, setSize] = useState<string>(filterSelect.Size || 'small');

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
    size,
    setSize,
    SearchParam,
    searchInputValue,
    setFilterSelect,
    defaultFilter,
    setSearchParam,
    setSearchInputValue,
    searchInputValueChange,
  };
}
