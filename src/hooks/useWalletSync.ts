import { useGetAccount, useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { store, dispatch, useSelector } from 'store/store';
import storages from 'storages';
import { message } from 'antd';
import { useLocalStorage } from 'react-use';
import { useCallback, useEffect } from 'react';
import useDiscoverProvider from './useDiscoverProvider';
import { getOriginalAddress } from 'utils';
import { setWalletInfo } from 'store/reducer/userInfo';
import { TipsMessage } from 'constants/message';
import { ChainId } from '@portkey/types';
import { did } from '@portkey/did-ui-react';
import { MethodsWallet } from '@portkey/provider-types';
import { useGetToken } from './useContractConnect';
import { selectInfo, setHasToken } from 'store/reducer/info';
import { useModal } from '@ebay/nice-modal-react';
import LoginModal from 'components/LoginModal';
import { usePathname } from 'next/navigation';

export const useWalletSyncCompleted = () => {
  const info = store.getState().aelfInfo.aelfInfo;
  const getAccountInAELF = useGetAccount('AELF');
  const { wallet, walletType } = useWebLogin();
  console.log(walletType, wallet, 'walletType');
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  const { discoverProvider } = useDiscoverProvider();

  const getAccount = useCallback(async () => {
    try {
      const aelfChainAddress = await getAccountInAELF();
      const walletInfoRes = {
        ...walletInfo,
        aelfChainAddress: getOriginalAddress(aelfChainAddress),
      };

      dispatch(setWalletInfo(walletInfoRes));
      setLocalWalletInfo(walletInfoRes);
      if (!aelfChainAddress) {
        return '';
      } else {
        return walletInfoRes.aelfChainAddress;
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
  const loginModal = useModal(LoginModal);
  const pathName = usePathname();

  const { loginState, login: aelfLogin, loginEagerly, logout, walletType } = useWebLogin();
  const isWalletLogin = loginState === WebLoginState.logined;
  const isEagerly = loginState === WebLoginState.eagerly;
  const loginMethod = isEagerly ? loginEagerly : aelfLogin;
  const getToken = useGetToken();
  const [accountInfo] = useLocalStorage<{
    account?: string;
    token?: string;
    expirationTime?: number;
  }>(storages.accountInfo);
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
    if (walletType === WalletType.portkey) {
      try {
        await getToken();
      } finally {
        getTokenLoading = false;
      }
      return;
    }
    loginModal.show({
      onConfirm: async () => {
        try {
          await getToken();
        } finally {
          getTokenLoading = false;
        }
      },
      onCancel: () => {
        isWalletLogin && logout({ noModal: true });
        loginModal.hide();
        getTokenLoading = false;
      },
    });
  };

  useEffect(() => {
    if (accountInfo?.token) {
      store.dispatch(setHasToken(true));
      return;
    }
    store.dispatch(setHasToken(false));
  }, [accountInfo]);

  useEffect(() => {
    if (pathName.includes('/term-service') || pathName.includes('/privacy-policy')) {
      return;
    }

    if (isWalletLogin) {
      if (!hasToken && !getTokenLoading) {
        initToken();
      }
    }
  }, [isWalletLogin, pathName]);

  return {
    isLogin,
    login,
  };
};
