'use client';

import { useInfiniteScroll, useTimeout } from 'ahooks';
import { fetchCompositeNftInfos, fetchNftRankingInfoApi } from 'api/fetch';
import { CompositeNftInfosParams, INftRankingInfo } from 'api/types';
import { INftInfo, ITraitInfo } from 'types/nftTypes';
import { addPrefixSuffix } from 'utils';
import { getParamsByTraitPairsDictionary } from 'utils/getTraitsForUI';
import { thousandsNumber } from 'utils/unitConverter';
import queryString from 'query-string';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

export const fetchRankingDataOfNft = async (nftItemArr: INftInfo[], userWalletAddress?: string) => {
  if (!userWalletAddress) return nftItemArr;
  const needShowRankingNftArr = nftItemArr.filter(
    (itm) => itm.generation === 9 && itm.traitPairsDictionary?.length >= 11,
  );
  if (!needShowRankingNftArr.length) return nftItemArr;
  const batchTraitsParams = needShowRankingNftArr.map((nftInfo) => {
    const traitInfos = nftInfo.traitPairsDictionary;

    const params = getParamsByTraitPairsDictionary(traitInfos as ITraitInfo[]);

    return params;
  });

  let resData: INftRankingInfo[] = [];
  try {
    resData = await fetchNftRankingInfoApi({
      address: addPrefixSuffix(userWalletAddress),
      catsTraits: batchTraitsParams as string[][][][],
    });
  } catch (error) {
    console.error(error);
  }

  if (!resData?.length) {
    return nftItemArr;
  }
  needShowRankingNftArr.forEach((item, index) => {
    const data = resData?.[index]?.rank;
    if (data.rank) {
      let str = `${thousandsNumber(data.rank)}`;
      if (data.total) {
        str += ` / ${thousandsNumber(data.total)}`;
      }
      item._rankStrForShow = str;
    }
  });

  return nftItemArr;
};

const fetchNFTItemsData = async (params: Partial<CompositeNftInfosParams>, userWalletAddress?: string) => {
  const res = await fetchCompositeNftInfos(params);
  try {
    const items = await fetchRankingDataOfNft(res.items, userWalletAddress);
    res.items = items;
  } catch (error) {
    console.error(error);
  }

  return res;
};

export function useNFTItemsDataService({
  pageSize = 32,
  params,
  userWalletAddress,
}: {
  pageSize?: number;
  params: Partial<CompositeNftInfosParams>;
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
    nav.replace(`${currentURL.pathname}?${queryParams.slice(0, -1)}`);
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
      if (params['RarityList']?.length) {
        newParams['RarityList'] = params['RarityList'].join('|');
      }

      if (params['generation']?.length) {
        newParams['generation'] = params['generation'].join('|');
      }

      if (params['SymbolTypeList']?.length) {
        newParams['SymbolTypeList'] = params['SymbolTypeList'].join('|');
      }

      updateURLParams(newParams);

      return fetchNFTItemsData(
        {
          ...params,
          SkipCount: (_page - 1) * pageSize,
          MaxResultCount: pageSize,
        },
        userWalletAddress,
      )
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
