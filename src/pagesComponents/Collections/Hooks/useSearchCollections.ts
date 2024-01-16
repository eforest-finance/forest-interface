import { fetchSearchCollections } from 'api/fetch';
import { useCallback, useState } from 'react';
import { Sort, SortTypeEnum } from '../components/CollectionsTable/columnConfig';

export interface Item {
  id: string;
  chainId: string;
  symbol: string;
  tokenName: string;
  logoImage: string;
  itemTotal: number;
  ownerTotal: number;
  floorPrice: number;
  floorPriceSymbol: string;
}

export interface SearchCollections {
  items: Item[];
  totalCount: number;
}

export interface requestSearchCollectionsParams {
  TokenName: string;
  Sort?: Sort | null;
  SortType?: SortTypeEnum | null;
  SkipCount: number;
  MaxResultCount: number;
}

export const useSearchCollections = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const getList = useCallback(async (params: requestSearchCollectionsParams) => {
    setLoading(true);
    console.log('execute getList');
    try {
      const result = await fetchSearchCollections(params);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return {
        items: [],
        totalCount: 0,
      };
    }
  }, []);

  return { loading, getList };
};
