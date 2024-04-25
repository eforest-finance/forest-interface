import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ExploreItems.module.css';
import { useDebounceFn } from 'ahooks';
import CollectionSearch, { BoxSizeEnum } from './components/CollectionItemsSearch';
import {
  FilterKeyEnum,
  ICompProps,
  IFilterSelect,
  ItemsSelectSourceType,
  getDefaultFilter,
  getComponentByType,
  getFilter,
  getFilterList,
  getTagList,
} from './type';
import { Layout } from 'antd';
import clsx from 'clsx';
import { CollapseForPC, CollapseForPhone } from './components/FilterContainer';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import ScrollContent from './components/ScrollContent';
import { fetchCollectionGenerationInfos, fetchCompositeNftInfos, fetchNftRankingInfoApi } from 'api/fetch';
import { getPageNumber } from 'utils/calculate';
import { CompositeNftInfosParams, ICollectionTraitInfo, INftRankingInfo } from 'api/types';
import { INftInfo, ITraitInfo } from 'types/nftTypes';
import useResponsive from 'hooks/useResponsive';
import FilterTags from './components/FilterTags';
import Loading from 'components/SyncChainModal/loading';
import useGetState from 'store/state/getState';
import SearchCheckBoxGroups from './components/SearchCheckBoxGroups';
import { useRequest } from 'ahooks';
import { fetchCollectionAllTraitsInfos } from 'api/fetch';
import { useSearchParams } from 'next/navigation';
import { getFilterFromSearchParams } from './util';
import { useWebLogin } from 'aelf-web-login';
import { addPrefixSuffix } from 'utils';
import { getParamsByTraitPairsDictionary } from 'utils/getTraitsForUI';
import { thousandsNumber } from 'utils/unitConverter';

export default function ExploreItems({
  nftCollectionId,
  elfRate,
  totalChange,
}: {
  nftCollectionId: string;
  totalChange?: (value: number) => void;
  elfRate: number;
}) {
  const params = useSearchParams();
  const filterParamStr = params.get('filterParams');
  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamStr);
  const { wallet } = useWebLogin();

  const [size, setSize] = useState<BoxSizeEnum>(BoxSizeEnum.small);
  // 1024 below is the mobile display
  const { isLG } = useResponsive();
  const [collapsed, setCollapsed] = useState(!isLG);
  const [total, setTotal] = useState<number>(0);
  const [SearchParam, setSearchParam] = useState<string>('');
  const nftType = nftCollectionId.endsWith('-SEED-0') ? 'seed' : 'nft';
  const { aelfInfo } = useGetState();
  const filterList = getFilterList(nftType, aelfInfo.curChain);
  const [sort, setSort] = useState<string>(dropDownCollectionsMenu.data[0].value as string);
  const defaultFilter = getDefaultFilter(aelfInfo.curChain);

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(
    Object.assign({}, defaultFilter, paramsFromUrlForFilter),
  );
  const [current, SetCurrent] = useState<number>(1);
  const [dataSource, setDataSource] = useState<INftInfo[]>([]);
  const isLoadMore = useRef<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const pageSize = 32;
  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      ...filter,
      Sorting: sort,
      SearchParam,
      CollectionType: nftType,
      CollectionId: nftCollectionId,
      SkipCount: getPageNumber(current, pageSize),
      MaxResultCount: pageSize,
    };
  }, [current, filterSelect, SearchParam, nftCollectionId, sort, nftType]);

  const { data: traitsInfo } = useRequest(() => fetchCollectionAllTraitsInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
  });
  const { data: generationInfos } = useRequest(() => fetchCollectionGenerationInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
  });

  const fetchRankingDataOfNft = useCallback(
    async (nftItemArr: INftInfo[]) => {
      if (!wallet.address) return nftItemArr;
      const needShowRankingNftArr = nftItemArr.filter(
        (itm) => itm.generation === 9 && itm.traitPairsDictionary?.length >= 11,
      );
      if (!needShowRankingNftArr.length) return nftItemArr;
      const batchTraitsParams = needShowRankingNftArr.map((nftInfo) => {
        const traitInfos = nftInfo.traitPairsDictionary;

        const params = getParamsByTraitPairsDictionary(traitInfos as unknown as ITraitInfo[]);

        return params;
      });

      let resData: INftRankingInfo[] = [];
      try {
        resData = await fetchNftRankingInfoApi({
          address: addPrefixSuffix(wallet.address),
          catsTraits: batchTraitsParams as string[][][][],
        });
      } catch (error) {}

      if (!resData?.length) {
        return nftItemArr;
      }
      needShowRankingNftArr.forEach((item, index) => {
        const data = resData?.[index]?.rank;
        if (data.rank) {
          let str = `${thousandsNumber(data.rank)}`;
          if (data.total) {
            str += ` / ${thousandsNumber(data.total)}`;
          }
          item._rankStrForShow = str;
        }
      });

      return nftItemArr;
    },
    [wallet.address],
  );

  const fetchData = useCallback(
    async (params: Partial<CompositeNftInfosParams>, loadMore?: boolean, isTotal?: boolean) => {
      if (loadMore) {
        setMoreLoading(true);
      } else {
        isLoadMore.current = false;
        setLoading(true);
      }
      try {
        const res = await fetchCompositeNftInfos(params);
        const items = await fetchRankingDataOfNft(res.items);
        setTotal(res.totalCount);
        if (isTotal) totalChange && totalChange(res.totalCount);
        if (isLoadMore.current) {
          setDataSource([...dataSource, ...items]);
          setLoadingMore(true);
        } else {
          setDataSource(items);
          setLoadingMore(false);
        }
        setLoading(false);
        setMoreLoading(false);
      } catch (error) {
        setLoading(false);
        setMoreLoading(false);
      }
    },
    [dataSource, totalChange, fetchRankingDataOfNft],
  );

  useEffect(() => {
    fetchData(requestParams, false, true);
  }, [nftCollectionId, wallet?.address]);

  useEffect(() => {
    if (!wallet.address) return;
    SetCurrent(1);
    fetchData(
      Object.assign({}, requestParams, {
        SkipCount: 0,
      }),
      false,
      true,
    );
  }, [wallet?.address]);

  const resetScrollTop = () => {
    const scrollEle = document.querySelector('#explore__container');
    scrollEle?.scrollTo(0, Math.min(isLG ? 230 : 190, scrollEle.scrollTop));
  };

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      setFilterSelect({ ...filterSelect, ...val });
      const filter = getFilter({ ...filterSelect, ...val });
      console.log('filterChange', filterSelect, filter);
      resetScrollTop();
      SetCurrent(1);
      const params = {
        ...filter,
        Sorting: sort,
        SearchParam,
        CollectionType: nftType,
        CollectionId: nftCollectionId,
        MaxResultCount: pageSize,
      };
      fetchData({ ...params, SkipCount: getPageNumber(1, pageSize) });
    },
    [filterSelect, fetchData, requestParams, pageSize],
  );

  const getTraitSelectorData = (
    traitsArrayInfo: ICollectionTraitInfo[],
    filterChange: (val: ItemsSelectSourceType) => void,
    filterSelectData: IFilterSelect,
  ) => {
    const traitsChildItems = traitsArrayInfo.map((itemTraitInfo) => {
      const defaultValue = (filterSelectData?.[`${FilterKeyEnum.Traits}-${itemTraitInfo.key}`]?.data || []).map(
        (itm: { label: string; value: string }) => itm.value,
      );
      return {
        key: itemTraitInfo.key,
        label: (
          <div className="flex justify-between mr-12 text-textPrimary">
            <span>{itemTraitInfo.key}</span>
            <span>{itemTraitInfo.valueCount}</span>
          </div>
        ),
        children: [
          {
            key: `${itemTraitInfo.key}-1`,
            label: (
              <SearchCheckBoxGroups
                key={itemTraitInfo.key}
                parentKey={itemTraitInfo.key}
                values={defaultValue}
                onChange={filterChange}
                dataSource={itemTraitInfo.values}
              />
            ),
          },
        ],
      };
    });

    return {
      key: FilterKeyEnum.Traits,
      label: FilterKeyEnum.Traits,
      children: traitsChildItems,
    };
  };

  const collapseItems = useMemo(() => {
    const resTargetList = [...filterList];
    if (!traitsInfo?.items?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Traits);
      resTargetList.splice(index, 1);
    }

    if (!generationInfos?.items?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Generation);
      resTargetList.splice(index, 1);
    }

    return resTargetList?.map((item) => {
      const defaultValue = filterSelect[item.key]?.data;

      if (item.key === FilterKeyEnum.Traits) {
        return getTraitSelectorData(traitsInfo?.items || [], filterChange, filterSelect);
      }

      if (item.key === FilterKeyEnum.Generation) {
        item.data = (generationInfos?.items || []).map((itm) => ({
          value: `${itm.generation}`,
          label: `${itm.generation}`,
          extra: `${itm.generationItemsCount}`,
        }));
      }

      const Comp: React.FC<ICompProps> = getComponentByType(item.type);
      return {
        key: item.key,
        label: item.title,
        children: [
          {
            key: item.key + '-1',
            label: (
              <Comp
                dataSource={item}
                defaultValue={defaultValue}
                onChange={filterChange}
                {...(item.maxCount && { maxCount: item.maxCount })}
                {...(item.AMOUNT_LENGTH && { AMOUNT_LENGTH: item.AMOUNT_LENGTH })}
                {...((item.decimals || item.decimals === 0) && { decimals: item.decimals })}
              />
            ),
          },
        ],
      };
    });
  }, [filterChange, filterList, filterSelect, traitsInfo, generationInfos]);

  const sizeChange = (value: BoxSizeEnum) => {
    setSize(value);
  };

  const { run } = useDebounceFn(
    (value) => {
      SetCurrent(1);
      fetchData({ ...requestParams, SearchParam: value, SkipCount: getPageNumber(1, pageSize) });
    },
    {
      wait: 500,
    },
  );
  const clearAll = useCallback(() => {
    resetScrollTop();
    SetCurrent(1);
    setSearchParam('');
    setFilterSelect({ ...defaultFilter });
    const filter = getFilter({ ...defaultFilter });
    const params = {
      ...filter,
      Sorting: sort,
      SearchParam: '',
      CollectionType: nftType,
      CollectionId: nftCollectionId,
      MaxResultCount: pageSize,
    };
    fetchData({ ...params, SkipCount: getPageNumber(1, pageSize) });
    if (isLG) setCollapsed(false);
  }, [setFilterSelect, isLG, defaultFilter, fetchData, pageSize, sort, nftType, nftCollectionId]);

  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    run(e.target.value);
  };

  const clearSearchChange = () => {
    setSearchParam('');
    SetCurrent(1);
    fetchData({ ...requestParams, SearchParam: '', SkipCount: getPageNumber(1, pageSize) });
  };

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const sortChange = (sort: string) => {
    isLoadMore.current = false;
    SetCurrent(1);
    setSort(sort);
    fetchData({
      ...requestParams,
      Sorting: sort,
      SkipCount: getPageNumber(1, pageSize),
    });
  };

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);
  const tagList = useMemo(() => {
    return getTagList(filterSelect, SearchParam);
  }, [filterSelect, SearchParam]);

  const loadMoreData = useCallback(() => {
    setLoadingMore(true);
    if (loading || !hasMore || moreLoading) return;
    isLoadMore.current = true;
    SetCurrent(current + 1);
    fetchData(
      {
        ...requestParams,
        SkipCount: getPageNumber(current + 1, pageSize),
      },
      true,
    );
  }, [hasMore, loading, fetchData, current, requestParams, moreLoading]);

  return (
    <div className={styles.explore__item__container}>
      <CollectionSearch
        size={size}
        collapsed={collapsed}
        collapsedChange={collapsedChange}
        searchParams={{
          placeholder: 'Search for names or token symbols',
          value: SearchParam,
          onChange: symbolChange,
          onPressEnter: symbolChange,
        }}
        sizeChange={sizeChange}
        selectTagCount={tagList.length}
        selectProps={{
          value: sort,
          defaultValue: dropDownCollectionsMenu.data[0].value,
          onChange: sortChange,
        }}
        extraInfo={`${thousandsNumber(total)} ${total < 2 ? 'result' : 'results'}`}
      />
      <div>
        <Layout className="!bg-[var(--bg-page)]">
          {isLG ? (
            <CollapseForPhone
              items={collapseItems}
              defaultOpenKeys={Object.values(FilterKeyEnum)}
              clearAll={clearAll}
              doneChange={() => {
                setCollapsed(false);
              }}
              showDropMenu={collapsed}
              onCloseHandler={() => {
                setCollapsed(false);
              }}
            />
          ) : (
            <Layout.Sider
              collapsedWidth={0}
              className={clsx('!bg-[var(--bg-page)] m-0', collapsed && '!mr-[32px]', styles['fixed-left'])}
              width={collapsed ? 360 : 0}
              trigger={null}>
              {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={Object.values(FilterKeyEnum)} />}
            </Layout.Sider>
          )}

          <Layout className="!bg-[var(--bg-page)] relative">
            <Loading spinning={loading} text="loading...">
              <div className=" sticky top-36 z-[1] bg-fillPageBg overflow-hidden h-0 lgTW:h-auto">
                <FilterTags
                  isMobile={isLG}
                  tagList={tagList}
                  SearchParam={SearchParam}
                  filterSelect={filterSelect}
                  clearAll={clearAll}
                  onchange={filterChange}
                  clearSearchChange={clearSearchChange}
                />
              </div>
              {isLG ? (
                <div className=" text-base font-medium text-textPrimary pb-2">
                  {thousandsNumber(total)} {total < 2 ? 'result' : 'results'}
                </div>
              ) : null}
              <ScrollContent
                elfRate={elfRate}
                sizes={size}
                collapsed={collapsed}
                ListProps={{
                  dataSource: dataSource,
                }}
                InfiniteScrollProps={{
                  total: total,
                  hasMore: hasMore,
                  loadingMore: loadingMore,
                  loading: moreLoading,
                  hasSearch: !!tagList.length,
                  loadMore: loadMoreData,
                  clearFilter: clearAll,
                }}
              />
            </Loading>
          </Layout>
        </Layout>
      </div>
    </div>
  );
}
