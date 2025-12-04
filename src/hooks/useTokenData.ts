import { useCallback, useEffect, useState } from 'react';
import { getExchangeRate } from 'pagesComponents/Detail/utils/getExchangeRate';
import { store } from 'store/store';
import { setElfRate } from 'store/reducer/info';

export interface TokenDataType {
  tokenId: string;
  price: number;
  timestamp: number;
}

export default function useTokenData() {
  const [rate, setRate] = useState(0);

  const getRate = useCallback(async () => {
    const result = await getExchangeRate();
    store.dispatch(setElfRate(result));

    setRate(result);
  }, []);

  useEffect(() => {
    getRate();
  }, [getRate]);

  return rate;
}
