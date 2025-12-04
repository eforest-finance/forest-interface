import { useCallback, useEffect, useState } from 'react';
import { fetchWhiteListPriceTokens } from 'api/fetch';
import { ITokenInfoBase } from 'api/types';

export const usePriceToken = (chainId?: Chain | null, whitelistHash?: string) => {
  const [list, setList] = useState<ITokenInfoBase[]>();

  const fetch = useCallback(async () => {
    if (!chainId || !whitelistHash) return;

    const res = await fetchWhiteListPriceTokens({
      chainId,
      whitelistHash,
    });
    if (res && res?.items) {
      setList(res.items);
    }
  }, [chainId, whitelistHash]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return list;
};
