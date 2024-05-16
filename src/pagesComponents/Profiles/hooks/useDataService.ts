import { useInfiniteScroll } from 'ahooks';
import { fetchNftInfos } from 'api/fetch';
import { INftInfoParams } from 'api/types';
import { fetchRankingDataOfNft } from 'pagesComponents/ExploreItem/hooks/useNFTItemsDataService';

const fetchNFTItemsData = async (params: Partial<INftInfoParams>, loginAddress?: string) => {
  const res = await fetchNftInfos(params);
  try {
    const items = await fetchRankingDataOfNft(res.items, loginAddress);
    res.items = items;
  } catch (e) {
    console.error(e);
  }

  return res;
};

export function useDataService({
  pageSize = 96,
  params,
  loginAddress,
}: {
  pageSize?: number;
  params: Partial<INftInfoParams>;
  loginAddress?: string;
}) {
  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    (d) => {
      const _page = !d?._page ? 1 : d._page + 1;

      return fetchNFTItemsData({
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
