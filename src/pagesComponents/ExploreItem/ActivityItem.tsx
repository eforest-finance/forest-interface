import { useCallback, useEffect, useMemo, useState } from 'react';
import useResponsive from 'hooks/useResponsive';
import { thousandsNumber } from 'utils/unitConverter';

import { Layout } from 'antd';
import { LoadingMore } from 'baseComponents/LoadingMore';
import { FilterContainer } from './components/Filters';
import { getFilter, getTagList } from './components/Filters/util';
import FilterTags from './components/FilterTags';
import { ICollectionActivitiesParams } from 'api/types';
import { useCollectionActiviesDataServices } from './hooks/useCollectionActivitiesDataServices';
import ActivityItemsSearch from './components/ActivityItemsSearch';
import { ActivityListTable } from './components/ActivityListTable';
import { useFilterForActivitiesService } from './hooks/useFilterForActivitiesService';
import { FilterKeyEnum, FilterType } from './constant';
import { useSearchParams, useRouter } from 'next/navigation';

interface IActivityItemsProps {
  nftCollectionId: string;
}

export function ActivityItem({ nftCollectionId }: IActivityItemsProps) {
  const nftType = nftCollectionId.endsWith('-SEED-0') ? 'seed' : 'nft';

  const { isLG } = useResponsive();
  const [collapsed, setCollapsed] = useState<boolean>(isLG);

  const searchParams = useSearchParams();

  const selectedType = searchParams.get('Type')?.split('|').map(Number) ?? [3, 6];

  const [activityType, setActivityType] = useState<(number | string)[]>(selectedType);

  const { filterList, filterSelect, traitsInfo, onFilterChange, clearAll } =
    useFilterForActivitiesService(nftCollectionId);

  const [SearchParam, setSearchParam] = useState<string>('');
  const symbolChange = (e: any) => {
    setSearchParam(e.target.value);
    addTraitsSelectorBySearchParams(e.target.value.trim());
  };

  const addTraitsSelectorBySearchParams = (searchVal: string) => {
    searchVal = searchVal.trim();
    let parentKey = '';
    let data = null;
    for (const traitItem of traitsInfo?.items || []) {
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

    onFilterChange({
      [`${FilterKeyEnum.Traits}-${parentKey}`]: {
        type: FilterType.Checkbox,
        data: [data],
      },
    });
  };

  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect, true);
    return {
      ...filter,
      Type: activityType,
      CollectionType: nftType,
      CollectionId: nftCollectionId,
    } as Partial<ICollectionActivitiesParams>;
  }, [filterSelect, nftCollectionId, nftType, activityType]);

  const tagList = useMemo(() => {
    return getTagList(filterSelect, '');
  }, [filterSelect]);
  const { data, loading, loadingMore, noMore } = useCollectionActiviesDataServices({
    params: requestParams,
  });

  return (
    <>
      <ActivityItemsSearch
        collapsed={collapsed}
        collapsedChange={() => setCollapsed(!collapsed)}
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
          onChange: setActivityType,
        }}
        extraInfo={`${thousandsNumber(data?.totalCount || 0)} ${(data?.totalCount || 0) < 2 ? 'result' : 'results'}`}
      />
      <Layout className="!bg-fillPageBg">
        <FilterContainer
          filterList={filterList}
          filterSelect={filterSelect}
          traitsInfo={traitsInfo?.items}
          open={!collapsed}
          onClose={() => setCollapsed(true)}
          mobileMode={isLG}
          onFilterChange={onFilterChange}
          clearAll={clearAll}
        />
        <Layout className="!bg-fillPageBg">
          <div className=" sticky top-36 z-[1] bg-fillPageBg overflow-hidden h-0 lgTW:h-auto">
            <FilterTags
              isMobile={isLG}
              tagList={tagList}
              SearchParam={SearchParam}
              filterSelect={filterSelect}
              clearAll={() => {
                setSearchParam('');
                clearAll();
              }}
              onchange={onFilterChange}
              clearSearchChange={() => setSearchParam('')}
            />
          </div>
          {isLG && data?.totalCount ? (
            <div className=" text-base font-medium text-textPrimary pb-2">
              {thousandsNumber(data.totalCount)} {data.totalCount < 2 ? 'result' : 'results'}
            </div>
          ) : null}
          <ActivityListTable dataSource={data?.list || []} loading={loading} stickeyOffsetHeight={isLG ? 196 : 226} />
          {loadingMore ? <LoadingMore /> : null}
          {noMore && data?.list.length && !loading ? (
            <div className="text-center w-full text-textDisable font-medium text-base py-5">{/* No more data */}</div>
          ) : null}
        </Layout>
      </Layout>
    </>
  );
}
