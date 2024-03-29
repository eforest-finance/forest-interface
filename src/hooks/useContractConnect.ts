import { useComponentFlex, useGetAccount, useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { useCallback, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import { dispatch, store } from 'store/store';
import { setWalletInfo } from 'store/reducer/userInfo';
import { message } from 'antd';
import { getOriginalAddress } from 'utils';
import { SupportedELFChainId } from 'constants/chain';
import { cloneDeep } from 'lodash-es';
import { formatErrorMsg } from 'contract/formatErrorMsg';
import { IContractError } from 'contract/type';
import { setHasToken, setLoading } from 'store/reducer/info';
import { useModal } from '@ebay/nice-modal-react';
import LoginModal from 'components/LoginModal';
import { checkAccountExpired, createToken, getAccountInfoFromStorage, isCurrentPageNeedToken } from 'utils/token';

export const useGetToken = () => {
  const [, setAccountInfo] = useLocalStorage<{
    account?: string;
    token?: string;
    expirationTime?: number;
  }>(storages.accountInfo);
  const { loginState, wallet, getSignature, walletType, logout, version } = useWebLogin();

  const isLogin = loginState === WebLoginState.logined;
  const loginModal = useModal(LoginModal);

  const closeLoading = () => {
    store.dispatch(
      setLoading({
        open: false,
      }),
    );
  };

  const getToken = useCallback(async () => {
    if (!isCurrentPageNeedToken()) {
      return Promise.resolve();
    }

    const accountInfo = getAccountInfoFromStorage();

    if (!checkAccountExpired(accountInfo, wallet.address)) {
      store.dispatch(setHasToken(true));
      return Promise.resolve();
    } else {
      store.dispatch(setHasToken(false));
      localStorage.removeItem(storages.accountInfo);
    }

    const res = await createToken({
      signMethod: getSignature,
      walletInfo: wallet,
      walletType,
      version,
      onError: (error) => {
        const resError = error as unknown as IContractError;
        loginModal.hide();
        message.error(formatErrorMsg(resError).errorMessage?.message);
        console.log('=====signResError', resError);
        closeLoading();
        isLogin && logout({ noModal: true });
        return Promise.reject(resError);
      },
    });

    if (res) {
      localStorage.setItem(storages.accountInfo, JSON.stringify(res));
      setAccountInfo(res);
      loginModal.hide();
      store.dispatch(setHasToken(true));
      return Promise.resolve();
    }

    closeLoading();
    return Promise.reject();
  }, [wallet, getSignature, walletType, version, loginModal, isLogin, logout, setAccountInfo]);

  return getToken;
};

export const useContractConnect = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { loginState, login: aelfLogin, wallet, logout, walletType, loginEagerly } = useWebLogin();

  const isEagerly = loginState === WebLoginState.eagerly;

  const getAccountInAELF = useGetAccount('AELF');

  const { did } = useComponentFlex();

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
        walletInfo.portkeyInfo = Object.assign({}, wallet.portkeyInfo, {
          walletInfo: undefined,
        });
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
