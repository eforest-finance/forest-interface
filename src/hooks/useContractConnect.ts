import { useCallback, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import { dispatch, store } from 'store/store';
import { setWalletInfo, walletInfo } from 'store/reducer/userInfo';
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
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import useDiscoverProvider from './useDiscoverProvider';
import { TipsMessage } from 'constants/message';
import { LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { TelegramPlatform } from '@portkey/did-ui-react';

const AElf = require('aelf-sdk');

export const useGetToken = () => {
  const [, setAccountInfo] = useLocalStorage<{
    account?: string;
    token?: string;
    expirationTime?: number;
  }>(storages.accountInfo);
  // const { loginState, wallet, getSignature, walletType, logout, version } = useWebLogin();
  const { walletInfo, walletType, disConnectWallet, getSignature, isConnected } = useConnectWallet();

  const isLogin = isConnected;

  const loginModal = useModal(LoginModal);

  const closeLoading = () => {
    store.dispatch(
      setLoading({
        open: false,
      }),
    );
  };

  const getToken = async () => {
    if (!isCurrentPageNeedToken()) {
      return Promise.resolve();
    }

    const accountInfo = getAccountInfoFromStorage();

    if (walletInfo && !checkAccountExpired(accountInfo, walletInfo?.address)) {
      store.dispatch(setHasToken(true));
      loginModal.hide();

      return Promise.resolve();
    } else {
      store.dispatch(setHasToken(false));
      localStorage.removeItem(storages.accountInfo);
    }

    const res = await createToken({
      signMethod: getSignature,
      walletInfo: walletInfo,
      walletType,
      onError: (error) => {
        const resError = error as unknown as IContractError;
        loginModal.hide();
        message.error(formatErrorMsg(resError).errorMessage?.message);
        console.log('=====signResError', resError);
        closeLoading();
        isLogin && disConnectWallet();

        return Promise.reject(resError);
      },
    });

    console.log('res-----res', res);

    if (res) {
      localStorage.setItem(storages.accountInfo, JSON.stringify(res));
      setAccountInfo(res);
      loginModal.hide();
      store.dispatch(setHasToken(true));
      return Promise.resolve();
    }

    closeLoading();
    return Promise.reject();
  };

  return getToken;
};

export const useContractConnect = () => {
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  // const { loginState, login: aelfLogin, wallet, logout, walletType, loginEagerly } = useWebLogin();
  const {
    walletInfo: wallet,
    walletType,
    disConnectWallet,
    getSignature,
    isConnected,
    loginOnChainStatus,
    connectWallet,
    getAccountByChainId,
  } = useConnectWallet();

  const getAccountInAELF = getAccountByChainId('AELF');

  // const { did } = useComponentFlex();

  function getAelfChainAddress() {
    return getAccountInAELF;
  }

  const updateWallet = async () => {
    const walletInfo: WalletInfoType = {
      address: wallet?.address || '',
      publicKey: wallet?.extraInfo.publicKey,
      aelfChainAddress: '',
      __createTime: Date.now(),
    };
    if (walletType === WalletTypeEnum.elf) {
      walletInfo.aelfChainAddress = wallet?.address || '';
    }
    if (walletType === WalletTypeEnum.discover) {
      console.log(walletInfo, wallet);

      walletInfo.discoverInfo = {
        accounts: wallet?.extraInfo.accounts || {},
        address: wallet.address || '',
        nickName: wallet?.extraInfo?.nickName,
      };
    }

    if (walletType === WalletTypeEnum.aa) {
      if (TelegramPlatform.isTelegramPlatform()) {
        if (loginOnChainStatus == LoginStatusEnum.SUCCESS) {
          walletInfo.portkeyInfo = Object.assign({}, wallet?.extraInfo?.portkeyInfo);
        }
      } else {
        walletInfo.portkeyInfo = Object.assign({}, wallet?.extraInfo?.portkeyInfo);
      }
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
  };

  useEffect(() => {
    if (isConnected) {
      updateWallet();
    }
    if (!isConnected) {
      dispatch(setWalletInfo({}));
      setLocalWalletInfo({ address: '' });
    }
  }, [isConnected, wallet?.address]);

  return {
    login: connectWallet,
    logout: disConnectWallet,
  };
};

export const useBroadcastChannel = () => {
  const { isConnected, disConnectWallet } = useConnectWallet();
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === storages.accountInfo) {
        const oldValue = JSON.parse(e.oldValue || '{}');
        const newValue = JSON.parse(e.newValue || '{}');
        if (!newValue.account && !!oldValue.account) {
          // old has value and new has no value, logout
          localStorage.removeItem('wallet-info');
          localStorage.removeItem('connectedWallet');
          isConnected && disConnectWallet();
          window.location.reload();
          return;
        }
      }
    };
    window.addEventListener('storage', onStorageChange);
  }, []);
};
