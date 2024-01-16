import { useCallback, useEffect, useState } from 'react';
import { GetBalance, GetTokenInfo } from 'contract/multiToken';
import useGetState from 'store/state/getState';
import { SupportedELFChainId } from 'constants/chain';
import { useSelector } from 'store/store';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function useNFTInfo(symbol: string | undefined, chainId?: Chain) {
  const { isLogin } = useCheckLoginAndToken();
  const { walletInfo } = useGetState();
  const [result, setResult] = useState<number[]>([]);
  const { pageRefreshCount } = useSelector((store) => store.detailInfo);
  const [loading, setLoading] = useState<boolean>(false);

  const getNFTNumber = useCallback(
    async (symbol: string | undefined, cb?: Function) => {
      const owner = chainId === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
      if (!(isLogin && symbol && owner)) return;

      try {
        setLoading(true);
        const res = await Promise.all([
          GetBalance({ owner, symbol }, { chain: chainId }),
          GetTokenInfo({ symbol }, { chain: chainId }),
        ]);
        console.log(res, 'nftbalance');
        setResult([res[0]?.balance || 0, Number(res[1]?.supply) || 0]);
        setLoading(false);
        cb && cb();
      } catch (error) {
        setLoading(false);
        setResult([0, 0]);
      }
    },
    [chainId, isLogin, symbol, walletInfo.address, walletInfo.aelfChainAddress],
  );

  useEffect(() => {
    if (!isLogin) {
      setResult([0, 0]);
    }
  }, [isLogin]);

  useEffect(() => {
    getNFTNumber(symbol);
  }, [getNFTNumber, isLogin, symbol, walletInfo.address, pageRefreshCount]);

  return {
    result,
    loading,
    getNFTNumber,
  };
}
