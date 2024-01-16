import BigNumber from 'bignumber.js';
import { SupportedELFChainId } from 'constants/chain';
import { ZERO } from 'constants/misc';
import { GetBalance } from 'contract/multiToken';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { useCallback, useEffect, useState } from 'react';
import useGetState from 'store/state/getState';
export type BalanceType = { balance: BigNumber };

export interface IResponseBalance {
  balance: { balance: BigNumber };
  run: () => void;
}
const defaultBalance = {
  balance: ZERO,
};

export const useAELFBalances = ({ symbol = 'ELF', chain }: { symbol?: string; chain?: Chain }): IResponseBalance => {
  const [balance, setBalance] = useState<BalanceType>(defaultBalance);
  const { isLogin } = useCheckLoginAndToken();
  const { walletInfo } = useGetState();

  const onGetBalance = useCallback(async () => {
    console.log('walletInfo.aelfChainAddress', walletInfo.aelfChainAddress);
    const owner = chain === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
    if (owner) {
      const { balance } = await GetBalance(
        { owner: owner, symbol },
        {
          chain,
        },
      );
      console.log('myBalance---1', balance);
      setBalance({ balance: new BigNumber(balance || 0) });
    } else {
      setBalance({ balance: new BigNumber(0) });
    }
  }, [chain, symbol, walletInfo.address, walletInfo.aelfChainAddress]);
  useEffect(() => {
    if (isLogin && symbol) {
      onGetBalance();
    }
  }, [isLogin, symbol, walletInfo.aelfChainAddress, walletInfo.address, chain]);
  const run = useCallback(() => {
    if (isLogin && symbol) {
      onGetBalance();
    }
  }, [isLogin, symbol, onGetBalance]);

  return { balance, run };
};
