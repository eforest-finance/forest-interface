import { useInfiniteScroll } from 'ahooks';
import { fetchCollectionActivities } from 'api/fetch';
import { ICollectionActivitiesParams } from 'api/types';

export function useCollectionActiviesDataServices({
  pageSize = 32,
  params,
  userWalletAddress,
}: {
  pageSize?: number;
  params: Partial<ICollectionActivitiesParams>;
  userWalletAddress?: string;
}) {
  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    (d) => {
      const _page = !d?._page ? 1 : d._page + 1;

      return fetchCollectionActivities({
        ...params,
        SkipCount: (_page - 1) * pageSize,
        MaxResultCount: pageSize,
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
        return data._page * pageSize > data.list.length || data?.list?.length >= data?.totalCount;
      },
      reloadDeps: [userWalletAddress, params],
    },
  );

  return {
    data,
    loading,
    loadingMore,
    noMore,
  };
}
