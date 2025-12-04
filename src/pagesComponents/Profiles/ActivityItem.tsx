import ActivityItemsSearch from 'pagesComponents/ExploreItem/components/ActivityItemsSearch';

import { useMemo, useState, useCallback, useEffect } from 'react';

import { LoadingMore } from 'baseComponents/LoadingMore';
import { useProfilePageService } from './hooks/useProfilePageService';

import { useDataService } from './hooks/useDataService';
import { useHMService } from './hooks/useHMService';
import { ActivityListTable } from 'pagesComponents/ExploreItem/components/ActivityListTable';
import { useFilterService } from './hooks/useFilterService';
import { useSearchParams } from 'next/navigation';

export function ActivityItem() {
  const { walletAddress } = useProfilePageService();

  const searchParams = useSearchParams();

  const selectedType = searchParams.get('Type')?.split('|').map(Number) ?? [];

  const [activityType, setActivityType] = useState<(number | string)[]>([3, 6]);

  const setType = useCallback(() => {
    if (searchParams.get('Type')) {
      setActivityType(selectedType);
    }
  }, []);

  useEffect(() => {
    setType();
  }, [setType]);

  // const { SearchParam, searchInputValue, searchInputValueChange } = useHMService();

  const { searchInputValue, SearchParam, searchInputValueChange } = useFilterService('activity', walletAddress);

  const requestParams = useMemo(() => {
    return {
      SearchParam: SearchParam,
      Type: activityType,
      address: walletAddress,
    };
  }, [walletAddress, activityType, SearchParam]);

  const { loading, loadingMore, noMore, data } = useDataService({
    params: requestParams,
    loginAddress: walletAddress,
    tabType: 'activity',
  });

  return (
    <>
      <ActivityItemsSearch
        hiddenFilter={true}
        collapsed={true}
        noMenuData={['Burn']}
        collapsedChange={() => {
          console.log('change');
        }}
        searchParams={{
          placeholder: 'Search by name',
          value: searchInputValue,
          onChange: searchInputValueChange,
          onPressEnter: searchInputValueChange,
        }}
        nftType="all"
        selectProps={{
          value: activityType,
          onChange: setActivityType,
        }}
      />
      <ActivityListTable dataSource={data?.list || []} loading={loading} stickeyOffsetHeight={220} />
      {loadingMore ? <LoadingMore /> : null}
      {noMore && data?.list.length && !loading ? (
        <div className="text-center w-full text-textDisable font-medium text-base py-5">{/* No more data */}</div>
      ) : null}
    </>
  );
}
