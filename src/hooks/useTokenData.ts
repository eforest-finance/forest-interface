import { openModal } from 'store/reducer/errorModalInfo';
import { useCallback, useEffect, useState } from 'react';
import { store } from 'store/store';
import { fetchGetTokenData } from 'api/fetch';

export interface TokenDataType {
  tokenId: string;
  price: number;
  timestamp: number;
}

export default function useTokenData() {
  const [rate, setRate] = useState(0);
  const getExchangeRate = useCallback(async () => {
    const result = await fetchGetTokenData({ symbol: 'ELF' });
    if (!result) store.dispatch(openModal());
    setRate(result?.price);
  }, []);
  useEffect(() => {
    getExchangeRate();
  }, [getExchangeRate]);
  return rate;
}
