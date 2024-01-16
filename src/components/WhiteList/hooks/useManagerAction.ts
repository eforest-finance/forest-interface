import { useMemo } from 'react';
import useDetailGetState from 'store/state/detailGetState';
import { disableWhiteList, enableWhiteList } from './managersAction';
import useGetState from 'store/state/getState';

export const useManagerAction = () => {
  const { whiteListInfo: whiteListInfoStore } = useDetailGetState();
  const { aelfInfo } = useGetState();
  const { whitelistId } = whiteListInfoStore;
  return useMemo(
    () => ({
      enableWhiteList: () => enableWhiteList(whitelistId ?? '', aelfInfo.curChain),
      disableWhiteList: () => disableWhiteList(whitelistId ?? '', aelfInfo.curChain),
    }),
    [aelfInfo.curChain, whitelistId],
  );
};
