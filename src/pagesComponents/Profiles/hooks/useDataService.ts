import { useInfiniteScroll } from 'ahooks';
import { fetchActivitiesSearch, fetchCollectionsByMyCreated, fetchNFTMyHoldSearch } from 'api/fetch';
import { IMyHoldSearch } from 'api/types';
import { useRouter } from 'next/navigation';

export function useDataService({
  pageSize = 96,
  params,
  loginAddress,
  tabType,
}: {
  pageSize?: number;
  params: IMyHoldSearch | IActivitySearch;
  loginAddress?: string;
  tabType: string;
}) {
  const fetchDataAPIMap = {
    collected: fetchNFTMyHoldSearch,
    created: fetchCollectionsByMyCreated,
    activity: fetchActivitiesSearch,
  };

  const nav = useRouter();
  const updateURLParams = (newParams: any) => {
    const currentURL = new URL(window.location.href);
    let queryParams = '';
    Object.keys(newParams).forEach((key) => {
      queryParams += `${key}=${newParams[key]}&`;
    });

    // history.replaceState(null, '', `${currentURL.pathname}?${queryParams.slice(0, -1)}`);
    nav.replace(`${currentURL.pathname}?${queryParams.slice(0, -1)}`);
  };

  const fetchDataApi = fetchDataAPIMap[tabType];

  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    (d) => {
      const _page = !d?._page ? 1 : d._page + 1;
      const newParams = JSON.parse(JSON.stringify(params));
      newParams['tabType'] = tabType;

      if (newParams['collectionIds']?.length) {
        newParams['collectionIds'] = params['collectionIds'].join('|');
      }
      if (newParams['Type']?.length) {
        newParams['Type'] = params['Type'].join('|');
      }

      updateURLParams(newParams);

      if (!loginAddress) {
        return Promise.resolve({
          list: [],
          totalCount: d?.totalCount || 0,
          _page,
        });
      }

      return fetchDataApi({
        ...params,
        address: loginAddress,
        skipCount: (_page - 1) * pageSize,
        maxResultCount: pageSize,
      })
        .then((res) => {
          return {
            list: res.items,
            totalCount: res.totalCount,
            _page,
          };
        })
        .catch(() => {
          return {
            list: [],
            totalCount: d?.totalCount || 0,
            _page,
          };
        });
    },
    {
      target: document.body,
      isNoMore: (data) => {
        if (!data?.list.length) return true;
        return data._page * pageSize > data?.totalCount || data?.list?.length >= data?.totalCount;
      },
      reloadDeps: [params, loginAddress],
    },
  );

  return {
    data,
    loading,
    loadingMore,
    noMore,
  };
}
