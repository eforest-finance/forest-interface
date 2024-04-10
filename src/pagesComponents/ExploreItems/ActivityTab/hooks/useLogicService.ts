import { useInfiniteScroll } from 'ahooks';
import { fetchCollectionActivities } from 'api/fetch';

const PAGE_SIZE = 3;

export function useLogicService({ scrollableTarget }: { scrollableTarget: Element }) {
  const { data, loading, loadMore, loadingMore } = useInfiniteScroll(
    (d) => {
      const _page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1;

      return fetchCollectionActivities({
        SkipCount: (_page - 1) * PAGE_SIZE,
        MaxResultCount: PAGE_SIZE,
      }).then((res) => {
        return {
          list: res.items,
          totalCount: res.totalCount,
        };
      });
    },
    {
      target: scrollableTarget,
    },
  );
  const hasMore = data?.list?.length < data?.totalCount;

  return {
    activities: data?.list || [],
    totalCount: data?.totalCount,
    hasMore,
    loading,
    loadingMore,
  };
}
