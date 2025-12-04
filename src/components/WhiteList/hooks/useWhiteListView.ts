import { message } from 'antd';
import { useCallback } from 'react';
import { getWhiteList, getAddressFromWhitelist } from './whiteListView';
import useDetailGetState from 'store/state/detailGetState';
import { IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';

export const useWhiteListView = () => {
  const { whiteListInfo, detailInfo } = useDetailGetState();
  const { whitelistId, whitelistInfo, chainId } = whiteListInfo;
  const { nftInfo } = detailInfo;

  const accountInWhitelist: (account?: string | undefined) => Promise<boolean> = useCallback(
    async (account?: string) => {
      try {
        if (!(whitelistInfo?.isAvailable ?? true)) return message.error('Whitelist unavailable');
        const res = await getAddressFromWhitelist(whitelistId, account, chainId);
        if (res?.error) {
          message.error(res.errorMessage?.message || DEFAULT_ERROR);
          return false;
        }
        return !!res?.value;
      } catch (error) {
        const resError = error as IContractError;
        message.error(resError.errorMessage?.message || DEFAULT_ERROR);
        return false;
      }
    },
    [chainId, whitelistId, whitelistInfo?.isAvailable],
  );
  return {
    getWhiteList: () => {
      return getWhiteList({
        chainId: nftInfo?.chainId,
        whitelistId,
      });
    },
    accountInWhitelist: (account?: string) => accountInWhitelist(account),
  };
};
