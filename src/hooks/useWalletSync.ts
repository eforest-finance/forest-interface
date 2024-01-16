import {
  useGetAccount,
  useWebLogin,
  useWebLoginEvent,
  WalletType,
  WebLoginEvents,
  WebLoginState,
} from 'aelf-web-login';
import { store, dispatch, useSelector } from 'store/store';
import storages from 'storages';
import { message } from 'antd';
import { cloneDeep } from 'lodash-es';
import { useLocalStorage } from 'react-use';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useDiscoverProvider from './useDiscoverProvider';
import { getOriginalAddress } from 'utils';
import { setWalletInfo } from 'store/reducer/userInfo';
import { TipsMessage } from 'constants/message';
import { ChainId } from '@portkey/types';
import { did } from '@portkey/did-ui-react';
import { MethodsWallet } from '@portkey/provider-types';
import { useGetToken } from './useContractConnect';
import { selectInfo } from 'store/reducer/info';

export const useWalletSyncCompleted = () => {
  const info = store.getState().aelfInfo.aelfInfo;
  const getAccountInAELF = useGetAccount('AELF');
  const { wallet, walletType } = useWebLogin();
  console.log(walletType, wallet, 'walletType');
  const { walletInfo } = cloneDeep(useSelector((store: any) => store.userInfo));
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { discoverProvider } = useDiscoverProvider();

  const getAccount = useCallback(async () => {
    try {
      const aelfChainAddress = await getAccountInAELF();

      walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);

      dispatch(setWalletInfo(walletInfo));
      setLocalWalletInfo(walletInfo);
      if (!aelfChainAddress) {
        return '';
      } else {
        return walletInfo.aelfChainAddress;
      }
    } catch (error) {
      message.info(TipsMessage.Synchronizing);
      return '';
    }
  }, [walletInfo, getAccountInAELF, setLocalWalletInfo]);

  const getAccountInfoSync = useCallback(
    async (chainId = 'AELF') => {
      let caHash;
      let address: any;
      console.log(WalletType, walletInfo, 'WalletType');
      if (walletType === WalletType.elf) {
        return walletInfo.aelfChainAddress;
      }
      if (walletType === WalletType.portkey) {
        const didWalletInfo = wallet.portkeyInfo;
        caHash = didWalletInfo?.caInfo?.caHash;
        address = didWalletInfo?.walletInfo?.address;
        const currentChainId = chainId as ChainId;
        try {
          const holder = await did.didWallet.getHolderInfoByContract({
            chainId: currentChainId,
            caHash: caHash as string,
          });
          const filteredHolders = holder.managerInfos.filter((manager) => manager?.address === address);
          if (filteredHolders.length) {
            return await getAccount();
          } else {
            message.info(TipsMessage.Synchronizing);
            return '';
          }
        } catch (error) {
          message.info(TipsMessage.Synchronizing);
          return '';
        }
      } else {
        const provider = await discoverProvider();
        const status = await provider?.request({
          method: MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
          payload: { chainId: info.curChain },
        });
        if (status) {
          return await getAccount();
        } else {
          message.info(TipsMessage.Synchronizing);
          return '';
        }
      }
    },
    [wallet, walletType, walletInfo],
  );
  return { getAccountInfoSync };
};

interface ICheckLoginProps {
  callBack?: any;
}

let getTokenLoading = false;

let afterLoginCb: any = null;

export const useCheckLoginAndToken = () => {
  const { loginState, login: aelfLogin, loginEagerly, logout } = useWebLogin();
  const isWalletLogin = loginState === WebLoginState.logined;
  const isEagerly = loginState === WebLoginState.eagerly;
  const loginMethod = isEagerly ? loginEagerly : aelfLogin;
  const getToken = useGetToken();

  const { hasToken } = useSelector(selectInfo);

  const isLogin = isWalletLogin && hasToken;

  const login = async (props?: ICheckLoginProps) => {
    const cb = props?.callBack;
    afterLoginCb = cb;
    if (isLogin) {
      cb?.();
      afterLoginCb = null;
      return;
    }
    loginMethod();
  };

  useEffect(() => {
    if (isLogin) {
      if (afterLoginCb) {
        afterLoginCb();
        afterLoginCb = null;
      }
    }
  }, [isLogin]);

  const initToken = async () => {
    getTokenLoading = true;
    try {
      await getToken();
    } finally {
      getTokenLoading = false;
    }
  };

  useEffect(() => {
    if (isWalletLogin) {
      if (!hasToken && !getTokenLoading) {
        initToken();
      }
    }
  }, [isWalletLogin]);

  return {
    isLogin,
    login,
  };
};
