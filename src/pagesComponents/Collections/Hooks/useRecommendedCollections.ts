import { fetchRecommendedCollections } from 'api/fetch';
import { ISwiperData } from 'components/CollectionsSwiper';
import { useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
export interface IRecommendedCollections {
  id: string;
  symbol: string;
  tokenName: string;
  logoImage: string;
}

export const useRecommendedCollections = () => {
  const [data, setData] = useState<ISwiperData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getData = async () => {
    setLoading(true);
    const res = await fetchRecommendedCollections();
    console.log(res, 'res');
    setLoading(false);
    const result = res.map((item) => {
      return {
        symbol: item.symbol,
        id: item.id,
        tokenName: item.tokenName,
        imgUrl: item.logoImage || '',
      };
    });
    setData(result);
  };
  useEffectOnce(() => {
    getData();
  });

  return useMemo(() => {
    return {
      data,
      loading,
    };
  }, [data, loading]);
};
