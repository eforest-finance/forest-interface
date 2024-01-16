import { fetchTokens } from 'api/fetch';
import { ITokensItems } from 'api/types';
import { useCallback, useEffect } from 'react';
import { setSupportTokens } from 'store/reducer/info';
import { store } from 'store/store';

export function useSupportTokens(nftCollectionId?: string, chainId?: string) {
  const getTokens = useCallback(async () => {
    if (!nftCollectionId || !chainId) return;
    try {
      const result = await fetchTokens({
        nftCollectionId,
        chainId,
      });
      if (!result || !result?.items) return;
      const tokenMap: Token = result.items.reduce((acc: Token, item: ITokensItems) => {
        acc[item.symbol] = {
          label: item.symbol,
          value: item.id,
          decimals: item.decimals,
          address: item.address || '',
        };
        return acc;
      }, {});
      store.dispatch(setSupportTokens(tokenMap));
    } catch (error) {
      /* empty */
    }
  }, [chainId, nftCollectionId]);

  useEffect(() => {
    getTokens();
  }, [chainId, getTokens, nftCollectionId]);
}
