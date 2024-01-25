import { useGetAccount, useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import { dispatch, store } from 'store/store';
import { setWalletInfo } from 'store/reducer/userInfo';
import { fetchToken } from 'api/fetch';
import { message } from 'antd';
import { getOriginalAddress } from 'utils';
import { ITokenParams } from 'api/types';
import { did } from '@portkey/did-ui-react';
import { SupportedELFChainId } from 'constants/chain';
import { cloneDeep } from 'lodash-es';
import { formatErrorMsg } from 'contract/formatErrorMsg';
import { IContractError } from 'contract/type';
import { usePathname, useRouter } from 'next/navigation';
import { setHasToken, setLoading } from 'store/reducer/info';
import { useModal } from '@ebay/nice-modal-react';
import LoginModal from 'components/LoginModal';
const AElf = require('aelf-sdk');

const signTip = `Welcome to Forest! Click to sign in to Forest and accept its Terms of Service and Privacy Policy. This request will not trigger a blockchain transaction or cost any gas fees.`;

export const useGetToken = () => {
  const [, setAccountInfo] = useLocalStorage<{
    account?: string;
    token?: string;
    expirationTime?: number;
  }>(storages.accountInfo);
  const { loginState, wallet, getSignature, walletType, logout, version } = useWebLogin();
  console.log('version', version);

  const isLogin = loginState === WebLoginState.logined;
  const pathName = usePathname();
  const nav = useRouter();
  const loginModal = useModal(LoginModal);

  const closeLoading = () => {
    store.dispatch(
      setLoading({
        open: false,
      }),
    );
  };

  const getToken = useCallback(async () => {
    if (['/term-service', '/privacy-policy'].includes(pathName)) {
      return Promise.resolve();
    }

    const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
    if (accountInfo?.token && Date.now() < accountInfo?.expirationTime && accountInfo.account === wallet.address) {
      store.dispatch(setHasToken(true));
      return Promise.resolve();
    } else {
      store.dispatch(setHasToken(false));
      localStorage.removeItem(storages.accountInfo);
    }
    const timestamp = Date.now();

    let sign = null;

    // const sha256Str = `${signTip} ${AElf.utils.sha256(`${wallet.address}-${timestamp}`)}`;

    try {
      sign = await getSignature({
        appName: 'forest',
        address: wallet.address,
        signInfo: walletType === WalletType.portkey ? AElf.utils.sha256(signTip) : signTip,
      });
    } catch (error) {
      const resError = error as IContractError;
      loginModal.hide();
      message.error(formatErrorMsg(resError).errorMessage?.message);
      console.log('=====resError', resError);
      closeLoading();
      isLogin && logout({ noModal: true });
      return Promise.reject(resError);
    }

    if (sign?.error) {
      const resError = sign as unknown as IContractError;
      loginModal.hide();
      message.error(formatErrorMsg(resError).errorMessage?.message);
      console.log('=====signResError', resError);
      closeLoading();
      isLogin && logout({ noModal: true });
      return Promise.reject(resError);
    }
    let extraParam = {};
    if (walletType === WalletType.elf) {
      extraParam = {
        pubkey: wallet.publicKey,
        source: 'nightElf',
      };
    }
    if (walletType === WalletType.portkey || walletType === WalletType.discover) {
      const accounts = Object.entries((wallet?.portkeyInfo || wallet.discoverInfo || { accounts: {} })?.accounts);
      const accountInfo = accounts.map(([chainId, address]) => ({
        chainId,
        address: getOriginalAddress(walletType === WalletType.portkey ? address : address[0]),
      }));
      console.log('accountInfo', accountInfo);

      extraParam = {
        source: 'portkey',
        accountInfo: JSON.stringify(accountInfo),
      };
    }

    const res = await fetchToken({
      grant_type: 'signature',
      scope: 'NFTMarketServer',
      client_id: 'NFTMarketServer_App',
      timestamp,
      version: version === 'v1' ? 'v1' : 'v2',
      // version: 'v2',
      signature: sign!.signature,
      ...extraParam,
    } as ITokenParams);

    if (res.access_token) {
      localStorage.setItem(
        storages.accountInfo,
        JSON.stringify({
          account: wallet.address,
          token: res.access_token,
          expirationTime: timestamp + res.expires_in * 1000,
        }),
      );
      setAccountInfo({
        account: wallet.address,
        token: res.access_token,
        expirationTime: timestamp + res.expires_in * 1000,
      });
      loginModal.hide();
      store.dispatch(setHasToken(true));
      return Promise.resolve();
    }

    closeLoading();
    return Promise.reject();
  }, [loginState, getSignature, wallet, setAccountInfo]);

  return getToken;
};

export const useContractConnect = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { loginState, login: aelfLogin, wallet, logout, walletType, loginEagerly } = useWebLogin();

  const isEagerly = loginState === WebLoginState.eagerly;

  const getAccountInAELF = useGetAccount('AELF');

  function getAelfChainAddress() {
    if (walletType === WalletType.portkey) {
      return did.didWallet
        .getHolderInfoByContract({
          caHash: wallet.portkeyInfo?.caInfo.caHash,
          chainId: SupportedELFChainId.MAIN_NET,
        })
        .then((caInfo) => {
          return caInfo.caAddress;
        });
    }
    if (walletType === WalletType.discover) {
      return getAccountInAELF();
    }
    return Promise.resolve(wallet?.address || '');
  }

  useEffect(() => {
    if (loginState === WebLoginState.logined) {
      const walletInfo: WalletInfoType = {
        address: wallet?.address || '',
        publicKey: wallet?.publicKey,
        aelfChainAddress: '',
        __createTime: Date.now(),
      };
      if (walletType === WalletType.elf) {
        walletInfo.aelfChainAddress = wallet?.address || '';
      }
      if (walletType === WalletType.discover) {
        walletInfo.discoverInfo = {
          accounts: wallet.discoverInfo?.accounts || {},
          address: wallet.discoverInfo?.address || '',
          nickName: wallet.discoverInfo?.nickName,
        };
      }
      if (walletType === WalletType.portkey) {
        walletInfo.portkeyInfo = wallet.portkeyInfo;
      }

      getAelfChainAddress()
        .then((aelfChainAddress: string) => {
          console.log('getAelfChainAddress end', aelfChainAddress);
          walletInfo.aelfChainAddress = getOriginalAddress(aelfChainAddress);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          dispatch(setWalletInfo(cloneDeep(walletInfo)));
          setLocalWalletInfo(cloneDeep(walletInfo));
        });
    }
    if (loginState === WebLoginState.lock) {
      dispatch(setWalletInfo({}));
      setLocalWalletInfo({ address: '' });
    }
  }, [loginState]);

  const login = isEagerly ? loginEagerly : aelfLogin;

  return {
    login,
    logout,
  };
};

export const useBroadcastChannel = () => {
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === storages.accountInfo) {
        const oldValue = JSON.parse(e.oldValue || '{}');
        const newValue = JSON.parse(e.newValue || '{}');
        if (!newValue.account && !!oldValue.account) {
          // old has value and new has no value, logout
          window.location.reload();
          return;
        }
      }
    };
    window.addEventListener('storage', onStorageChange);
  }, []);
};
