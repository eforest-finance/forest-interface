import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { SupportedELFChainId } from 'constants/chain';
import { ZERO } from 'constants/misc';
import { GetBalance } from 'contract/multiToken';
import { useCallback, useEffect, useState } from 'react';
import useGetState from 'store/state/getState';
export type BalanceType = { balance: BigNumber };

export interface IResponseBalance {
  data?: number | BigNumber;
  run: any;
  onGetBalance: any;
}

export const useBalance = ({ symbol = 'ELF', chain }: { symbol?: string; chain?: Chain }): IResponseBalance => {
  const { walletInfo } = useGetState();

  const onGetBalance = useCallback(async () => {
    const owner = chain === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
    if (owner) {
      const { balance } = await GetBalance(
        { owner: owner, symbol },
        {
          chain,
        },
      );
      return new BigNumber(balance || 0);
    }
  }, [chain, symbol, walletInfo.address, walletInfo.aelfChainAddress]);

  const { data, loading, run, cancel } = useRequest(onGetBalance, {
    pollingInterval: 10000,
    pollingWhenHidden: false,
  });

  return { data, run, onGetBalance };
};
