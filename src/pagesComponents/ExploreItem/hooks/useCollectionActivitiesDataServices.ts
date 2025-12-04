import { useInfiniteScroll } from 'ahooks';
import { fetchCollectionActivities } from 'api/fetch';
import { ICollectionActivitiesParams } from 'api/types';
import { useRouter } from 'next/navigation';

export function useCollectionActiviesDataServices({
  pageSize = 32,
  params,
  userWalletAddress,
}: {
  pageSize?: number;
  params: Partial<ICollectionActivitiesParams>;
  userWalletAddress?: string;
}) {
  const nav = useRouter();
  const updateURLParams = (newParams: any) => {
    const currentURL = new URL(window.location.href);
    let queryParams = '';
    Object.keys(newParams).forEach((key) => {
      queryParams += `${key}=${newParams[key]}&`;
    });

    // history.pushState(null, '', `${currentURL.pathname}?${queryParams.slice(0, -1)}`);
    nav.replace(`${currentURL.pathname}?${queryParams.slice(0, -1)}`, { scroll: false });
  };

  const { data, loading, loadingMore, noMore } = useInfiniteScroll(
    (d) => {
      const _page = !d?._page ? 1 : d._page + 1;

      const newParams = JSON.parse(JSON.stringify(params));

      if (params['traits']?.length) {
        const newTraits: string[] = [];
        params['traits'].map((list) => {
          list.values.map((item) => {
            const newItem = `${list.key}-${item}`;
            newTraits.push(newItem);
          });
        });
        newParams['traits'] = newTraits.join('|');
      }
      if (params['Type']?.length) {
        newParams['Type'] = params['Type'].join('|');
      }

      updateURLParams(newParams);

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
