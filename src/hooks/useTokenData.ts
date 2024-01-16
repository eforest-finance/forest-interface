import { useCallback, useEffect, useState } from 'react';
import { getExchangeRate } from 'pagesComponents/Detail/utils/getExchangeRate';

export interface TokenDataType {
  tokenId: string;
  price: number;
  timestamp: number;
}

export default function useTokenData() {
  const [rate, setRate] = useState(0);
  const getRate = useCallback(async () => {
    const result = await getExchangeRate();
    setRate(result);
  }, []);

  useEffect(() => {
    getRate();
  }, [getRate]);
  return rate;
}
