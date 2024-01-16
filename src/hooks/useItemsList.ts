import { useSelector, dispatch } from 'store/store';
import { setItemsList, addItemsList } from 'store/reducer/layoutInfo';
import { useCallback, useEffect, useState } from 'react';
import { getListByKey } from 'utils';
import { RangeType } from 'components/ItemsLayout/types';
import { usePathname } from 'next/navigation';
import { useDebounce, useHash, useLocalStorage } from 'react-use';
import { defaultFilter } from 'components/ItemsLayout/assets';

import equal from 'fast-deep-equal';
import { fetchNftInfos } from '../api/fetch';
import storages from 'storages';

const isEmptyObject = (obj: any) => {
  if (!obj) return true;
  if (typeof obj !== 'object') return true;
  if (obj instanceof Array) return true;
  return JSON.stringify(obj) === '{}';
};

export default function useItemsList(page = 0, pageSize = 20, nftCollectionIdOrAddress?: string) {
  const { filterSelect } = useSelector((store) => store.layoutInfo);
  const { walletInfo: walletInfoStore } = useSelector((store) => store.userInfo);
  const [walletInfoLocal] = useLocalStorage<WalletInfoType>(storages.walletInfo);

  const walletInfo = walletInfoStore || walletInfoLocal;

  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();
  const [hash] = useHash();
  const getItemsList = useCallback(async () => {
    // if (loading) return;

    const address = pathName.includes('/account') ? nftCollectionIdOrAddress || walletInfo.address : walletInfo.address;
    const NFTCollectionId = pathName.includes('/explore-items') ? nftCollectionIdOrAddress : '';
    if (pathName.includes('/account') && !address) return;
    let param: any = {
      SkipCount: page * pageSize,
      MaxResultCount: pageSize,
      NftSymbol: undefined,
      Address: walletInfo.address, // default address is current user wallet address
      IssueAddress: pathName.includes('/account') && hash === '#Created' ? address : undefined,
    };
    if (pathName.includes('/account')) {
      param = Object.assign(
        param,
        {
          Address: address, // use param address or wallet address
        },
        hash !== '#Created' ? { Status: 2 } : null,
      );
    } else {
      param = Object.assign(param, {
        NFTCollectionId,
      });
    }

    const filter = isEmptyObject(filterSelect)
      ? pathName.includes('/account')
        ? defaultFilter.sorting
        : defaultFilter['/explore-items']
      : filterSelect;
    filter &&
      Object.entries(filter).map(([key, val]) => {
        if (key === 'chainId' && val?.data.length > 0) {
          param = { ...param, chainIds: getListByKey(val?.data, 'value') };
        } else if (key === 'address') {
          param = {
            ...param,
            Status: Number(getListByKey(val?.data, 'value')[0]),
            Address: address ?? '',
          };
        } else if (key === 'price' && val?.data[0]) {
          param = {
            ...param,
            PriceLow: (val?.data[0] as RangeType).min === '' ? undefined : (val?.data[0] as RangeType).min,
            PriceHigh: (val?.data[0] as RangeType).max === '' ? undefined : (val?.data[0] as RangeType).max,
          };
        } else if (key === 'saleTokenId' && val?.data[0]) {
          param = {
            ...param,
            ListingTokenIds: getListByKey(val?.data, 'value'),
          };
        } else if (key === 'sorting' && val?.data[0]) {
          const sorting = getListByKey(val?.data, 'value')[0];
          param = Object.assign(
            param,
            sorting.split('&')[1] && { Sorting: sorting.split('&')[1] },
            // sorting.split('&')[0] && {
            //   ListingTokenId: sorting.split('&')[0],
            // },
          );
        } else if (key === 'category' && val?.data[0]) {
          param = { ...param, category: getListByKey(val?.data, 'value') };
        }
      });
    const equalRes = equal({ ...param, hash }, { ...params });
    if (equalRes) {
      return;
    } else {
      setParams({ ...param, hash });
    }
    setLoading(true);

    if (!param.sorting) {
      param.Sorting = 'ListingTime DESC';
    }

    console.log('fetchNftInfos', {
      ...param,
    });

    const result = await fetchNftInfos({
      ...param,
    });
    setLoading(false);
    if (!result || typeof result?.totalCount !== 'number') return;
    const action = page === 0 ? setItemsList : addItemsList;
    dispatch(
      action({
        items: result.items,
        totalCount: result.totalCount,
        end: result.items?.length < pageSize ? true : false,
        page,
        tabType: hash ?? undefined,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftCollectionIdOrAddress, page, pageSize, hash, walletInfo?.address, pathName, filterSelect, params]);

  useDebounce(
    () => {
      getItemsList();
    },
    200,
    [getItemsList],
  );
  return { loading };
}

export function useItemsCount(address?: string) {
  const {
    walletInfo: { address: account },
  } = useSelector((store) => store.userInfo);
  const [countData, setCountData] = useState<{
    collected: number;
    created: number;
  }>();
  const getItemsCount = useCallback(async () => {
    if (!account && !address) return;
    const collectedParam = {
      SkipCount: 0,
      MaxResultCount: 1,
      Status: 2,
      Address: (address || account) ?? '',
      Sorting: 'ListingTime DESC',
    };
    const createdParam = {
      IssueAddress: (address || account) ?? undefined,
      Address: (address || account) ?? '',
      SkipCount: 0,
      MaxResultCount: 1,
      Sorting: 'ListingTime DESC',
    };
    const [collected, created] = await Promise.all([fetchNftInfos(collectedParam), fetchNftInfos(createdParam)]);

    setCountData({
      collected: collected?.totalCount || 0,
      created: created?.totalCount || 0,
    });
    console.log(collected, created, 'useItemsCount===');
  }, [account, address]);
  useEffect(() => {
    getItemsCount();
  }, [getItemsCount]);

  return countData;
}
