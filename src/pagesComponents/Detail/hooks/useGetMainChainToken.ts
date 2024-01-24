import { useEffect, useState } from 'react';
import { getBalance } from '../utils/getNftNumber';
import useGetState from 'store/state/getState';

export function useGetMainChainBalance({ tokenName }: { tokenName: string }) {
  const [balance, setBalance] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { walletInfo } = useGetState();

  const getTokenBalance = async () => {
    if (!walletInfo.aelfChainAddress) return;
    const tokenBalance = await getBalance({ owner: walletInfo.aelfChainAddress, symbol: tokenName }, 'AELF');
    tokenBalance && setBalance(tokenBalance);
  };

  useEffect(() => {
    tokenName && getTokenBalance();
  }, [tokenName]);

  return balance;
}
