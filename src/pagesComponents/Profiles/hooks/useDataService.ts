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

  // const nav = useRouter();

  // const updateSorting = (query: string) => {
  //   const pathname = location.pathname;

  //   if (location.search !== `?${query}`) {
  //     nav.push(`${pathname}?${query}`);

  //     window.history.pushState(null, '', `${pathname}?${query}`);
  //   }
  // };

  const fetchDataApi = fetchDataAPIMap[tabType];

  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    (d) => {
      const _page = !d?._page ? 1 : d._page + 1;
      // const query = `filterParams=${encodeURI(JSON.stringify(params))}`;

      // updateSorting(query);

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
