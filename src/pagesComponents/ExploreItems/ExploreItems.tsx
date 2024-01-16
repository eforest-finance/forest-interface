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
import { fetchCompositeNftInfos } from 'api/fetch';
import { getPageNumber } from 'utils/calculate';
import { CompositeNftInfosParams } from 'api/types';
import { INftInfo } from 'types/nftTypes';
import useResponsive from 'hooks/useResponsive';
import FilterTags from './components/FilterTags';
import Loading from 'components/SyncChainModal/loading';
import useGetState from 'store/state/getState';

export default function ExploreItems({
  nftCollectionId,
  totalChange,
}: {
  nftCollectionId: string;
  totalChange: (value: number) => void;
}) {
  const [size, setSize] = useState<BoxSizeEnum>(BoxSizeEnum.large);
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
  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);
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
        setTotal(res.totalCount);
        if (isTotal) totalChange && totalChange(res.totalCount);
        if (isLoadMore.current) {
          setDataSource([...dataSource, ...res.items]);
          setLoadingMore(true);
        } else {
          setDataSource(res.items);
          setLoadingMore(false);
        }
        setLoading(false);
        setMoreLoading(false);
      } catch (error) {
        setLoading(false);
        setMoreLoading(false);
      }
    },
    [dataSource, totalChange],
  );

  useEffect(() => {
    fetchData(requestParams, false, true);
  }, [nftCollectionId]);

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      setFilterSelect({ ...filterSelect, ...val });
      const filter = getFilter({ ...filterSelect, ...val });
      SetCurrent(1);
      fetchData({ ...requestParams, ...filter, SkipCount: getPageNumber(1, pageSize) });
    },
    [filterSelect, fetchData, requestParams],
  );
  const collapseItems = useMemo(() => {
    return filterList?.map((item) => {
      const defaultValue = filterSelect[item.key]?.data;
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
  }, [filterChange, filterList, filterSelect]);

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
    SetCurrent(1);
    setSearchParam('');
    setFilterSelect({ ...defaultFilter });
    const filter = getFilter({ ...defaultFilter });
    fetchData({ ...requestParams, ...filter, SkipCount: getPageNumber(1, pageSize), SearchParam: '' });
    if (isLG) setCollapsed(false);
  }, [setFilterSelect, isLG, requestParams, defaultFilter, fetchData]);

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
        selectProps={{
          value: sort,
          defaultValue: dropDownCollectionsMenu.data[0].value,
          onChange: sortChange,
        }}
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
              className={clsx('!bg-[var(--bg-page)] m-0', collapsed && '!mr-[32px]')}
              width={collapsed ? 360 : 0}
              trigger={null}>
              {collapsed && <CollapseForPC items={collapseItems} defaultOpenKeys={Object.values(FilterKeyEnum)} />}
            </Layout.Sider>
          )}

          <Layout className="!bg-[var(--bg-page)] relative">
            <Loading spinning={loading} text="loading...">
              <div>
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
              <ScrollContent
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
