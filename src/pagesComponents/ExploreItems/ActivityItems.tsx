import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ExploreItems.module.css';
import { useDebounceFn, useSize } from 'ahooks';
import ActivityItemsSearch from './components/ActivityItemsSearch';
import {
  FilterKeyEnum,
  ICompProps,
  IFilterSelect,
  ItemsSelectSourceType,
  getDefaultFilter,
  getComponentByType,
  getFilter,
  getTagList,
  FilterType,
  getFilterListForActivity,
} from './type';
import { Layout } from 'antd';
import clsx from 'clsx';
import { CollapseForPC, CollapseForPhone } from './components/FilterContainer';
import ScrollContent from './components/ActivityScrollContent';
import { fetchCollectionActivities } from 'api/fetch';
import { getPageNumber } from 'utils/calculate';
import { IActivitiesItem, ICollectionActivitiesParams, ICollectionTraitInfo } from 'api/types';

import useResponsive from 'hooks/useResponsive';
import FilterTags from './components/FilterTags';
import Loading from 'components/SyncChainModal/loading';
import useGetState from 'store/state/getState';
import SearchCheckBoxGroups from './components/SearchCheckBoxGroups';
import { useRequest } from 'ahooks';
import { fetchCollectionAllTraitsInfos } from 'api/fetch';
import { useSearchParams } from 'next/navigation';
import { getFilterFromSearchParams } from './util';
import { thousandsNumber } from 'utils/unitConverter';
import { dropDownActivitiesMenu } from 'components/ItemsLayout/assets';

export default function ActivityItems({ nftCollectionId }: { nftCollectionId: string }) {
  const params = useSearchParams();
  const filterParamStr = params.get('filterParams');
  const paramsFromUrlForFilter = getFilterFromSearchParams(filterParamStr);

  // 1024 below is the mobile display
  const { isLG } = useResponsive();
  const [collapsed, setCollapsed] = useState(!isLG);
  const [total, setTotal] = useState<number>(0);
  const [SearchParam, setSearchParam] = useState<string>('');
  const nftType = nftCollectionId.endsWith('-SEED-0') ? 'seed' : 'nft';
  const { aelfInfo } = useGetState();
  const filterList = getFilterListForActivity(nftType, aelfInfo.curChain);
  const [activityType, setActivityType] = useState<(number | string)[]>([3, 6]);
  const defaultFilter = getDefaultFilter(aelfInfo.curChain);

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(
    Object.assign({}, defaultFilter, paramsFromUrlForFilter),
  );
  const [current, SetCurrent] = useState<number>(1);
  const [dataSource, setDataSource] = useState<IActivitiesItem[]>([]);
  const isLoadMore = useRef<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const pageSize = 32;
  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      ...filter,
      Type: activityType,
      CollectionType: nftType,
      CollectionId: nftCollectionId,
      SkipCount: getPageNumber(current, pageSize),
      MaxResultCount: pageSize,
    };
  }, [current, filterSelect, nftCollectionId, activityType, nftType]);

  const tagRef = useRef(null);
  const tagCompSize = useSize(tagRef);

  const { data: traitsInfo } = useRequest(() => fetchCollectionAllTraitsInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
  });

  const fetchData = useCallback(
    async (params: ICollectionActivitiesParams, loadMore?: boolean) => {
      if (loadMore) {
        setMoreLoading(true);
      } else {
        isLoadMore.current = false;
        setLoading(true);
      }
      try {
        const res = await fetchCollectionActivities(params);
        const items = res.items;
        setTotal(res.totalCount);
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
    [dataSource],
  );

  useEffect(() => {
    fetchData(requestParams, false);
  }, [nftCollectionId]);

  const resetScrollTop = () => {
    const scrollEle = document.querySelector('#explore__container');
    scrollEle?.scrollTo(0, Math.min(isLG ? 230 : 190, scrollEle.scrollTop));
  };

  const filterChange = useCallback(
    (val: ItemsSelectSourceType) => {
      setFilterSelect({ ...filterSelect, ...val });
      const filter = getFilter({ ...filterSelect, ...val });
      console.log('filterChange', filterSelect, filter, val);
      resetScrollTop();
      SetCurrent(1);
      const params = {
        ...filter,
        Type: activityType,
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

    return resTargetList?.map((item) => {
      const defaultValue = filterSelect[item.key]?.data;

      if (item.key === FilterKeyEnum.Traits) {
        return getTraitSelectorData(traitsInfo?.items || [], filterChange, filterSelect);
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
  }, [filterChange, filterList, filterSelect, traitsInfo]);

  const clearAll = useCallback(() => {
    resetScrollTop();
    SetCurrent(1);
    setSearchParam('');
    const filterSelectData: IFilterSelect = {
      ...defaultFilter,
    };
    setFilterSelect(filterSelectData);
    const filter = getFilter(filterSelectData);
    const params = {
      ...filter,
      Type: activityType,
      CollectionType: nftType,
      CollectionId: nftCollectionId,
      MaxResultCount: pageSize,
    };
    fetchData({ ...params, SkipCount: getPageNumber(1, pageSize) });
    if (isLG) setCollapsed(false);
  }, [setFilterSelect, isLG, defaultFilter, fetchData, pageSize, activityType, nftType, nftCollectionId]);

  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    addTraitsSelectorBySearchParams(e.target.value);
  };

  const addActivityTypeTag = (activityType: (string | number)[]) => {
    const selArr = dropDownActivitiesMenu.data.filter((item) => {
      return activityType.includes(item.value);
    });
    const filterData = {
      [FilterKeyEnum.ActivityType]: {
        type: FilterType.Checkbox,
        data: selArr,
      },
    };
    filterChange(filterData);
  };

  const addTraitsSelectorBySearchParams = (searchVal: string) => {
    searchVal = searchVal.trim();
    let parentKey = '';
    let data = null;
    for (let traitItem of traitsInfo?.items || []) {
      const traitsValue = traitItem.values.find((traitItemVal) => String(traitItemVal.value).trim() === searchVal);
      if (traitsValue) {
        parentKey = traitItem.key;
        data = {
          label: `${traitsValue.value}`,
          value: traitsValue.value,
        };
        break;
      }
    }

    if (!data) return;

    filterChange({
      [`${FilterKeyEnum.Traits}-${parentKey}`]: {
        type: FilterType.Checkbox,
        data: [data],
      },
    });
  };

  const clearSearchChange = () => {
    setSearchParam('');
    SetCurrent(1);
    fetchData({ ...requestParams, SkipCount: getPageNumber(1, pageSize) });
  };

  const collapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const activityTypeChange = (activityType: (number | string)[]) => {
    console.log('activityTypeChange', activityType);
    // addActivityTypeTag(activityType);
    isLoadMore.current = false;
    SetCurrent(1);
    setActivityType(activityType);
    fetchData({
      ...requestParams,
      Type: activityType,
      SkipCount: getPageNumber(1, pageSize),
    });
  };

  const hasMore = useMemo(() => {
    return total > dataSource.length;
  }, [total, dataSource]);
  const tagList = useMemo(() => {
    return getTagList(filterSelect, '');
  }, [filterSelect]);

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
      <ActivityItemsSearch
        collapsed={collapsed}
        collapsedChange={collapsedChange}
        searchParams={{
          placeholder: 'Search by traits',
          value: SearchParam,
          onChange: symbolChange,
          onPressEnter: symbolChange,
        }}
        nftType={nftType}
        selectTagCount={tagList.length}
        selectProps={{
          value: activityType,
          onChange: activityTypeChange,
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
              <div
                ref={tagRef}
                className=" sticky flex items-center top-36 z-[3] bg-fillPageBg overflow-hidden h-0 lgTW:h-auto ">
                <FilterTags
                  isMobile={isLG}
                  tagList={tagList}
                  SearchParam={''}
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
                  stickeyOffsetHeight: isLG ? (tagCompSize?.height || 0) + 128 : (tagCompSize?.height || 0) + 138,
                }}
              />
            </Loading>
          </Layout>
        </Layout>
      </div>
    </div>
  );
}
