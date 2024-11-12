import { useComponentFlex, useGetAccount, useWebLogin, WalletType, WebLoginState } from 'aelf-web-login';
import { store, dispatch, useSelector } from 'store/store';
import storages from 'storages';
import { message } from 'antd';
import { useLocalStorage } from 'react-use';
import { useCallback, useEffect, useMemo } from 'react';
import useDiscoverProvider from './useDiscoverProvider';
import { getOriginalAddress } from 'utils';
import { setWalletInfo } from 'store/reducer/userInfo';
import { TipsMessage } from 'constants/message';
import { ChainId } from '@portkey/types';
// import { did } from '@portkey/did-ui-react';
import { MethodsWallet } from '@portkey/provider-types';
import { useGetToken } from './useContractConnect';
import { selectInfo, setHasToken } from 'store/reducer/info';
import { useModal } from '@ebay/nice-modal-react';
import LoginModal from 'components/LoginModal';
import { usePathname } from 'next/navigation';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { WalletTypeEnum, LoginStatusEnum } from '@aelf-web-login/wallet-adapter-base';
import { TelegramPlatform } from '@portkey/did-ui-react';

export const useWalletSyncCompleted = (contractChainId = 'AELF') => {
  // const info = store.getState().aelfInfo.aelfInfo;
  // const getAccountInAELF = useGetAccount('AELF');
  const { getWalletSyncIsCompleted } = useConnectWallet();

  const getAccountInfoSync = async () => {
    const address = await getWalletSyncIsCompleted(contractChainId);
    return address;
  };

  // const { wallet, walletType } = useWebLogin();
  // const { walletInfo } = useSelector((store: any) => store.userInfo);
  // const [, setLocalWalletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);
  // const { discoverProvider } = useDiscoverProvider();

  // const { did } = useComponentFlex();

  // const getAccount = useCallback(async () => {
  //   try {
  //     const aelfChainAddress = await getAccountInAELF();
  //     const walletInfoRes = {
  //       ...walletInfo,
  //       aelfChainAddress: getOriginalAddress(aelfChainAddress),
  //     };

  //     dispatch(setWalletInfo(walletInfoRes));
  //     setLocalWalletInfo(walletInfoRes);
  //     if (!aelfChainAddress) {
  //       message.info(TipsMessage.Synchronizing);
  //       return '';
  //     } else {
  //       return walletInfoRes.aelfChainAddress;
  //     }
  //   } catch (error) {
  //     message.info(TipsMessage.Synchronizing);
  //     return '';
  //   }
  // }, [walletInfo, getAccountInAELF, setLocalWalletInfo]);

  // const getAccountInfoSync = useCallback(async () => {
  //   let caHash;
  //   let address: any;
  //   console.log(WalletType, walletInfo, 'WalletType');
  //   if (walletType === WalletType.elf) {
  //     return walletInfo.aelfChainAddress;
  //   }
  //   if (walletType === WalletType.portkey) {
  //     const didWalletInfo = wallet.portkeyInfo;
  //     caHash = didWalletInfo?.caInfo?.caHash;
  //     address = didWalletInfo?.walletInfo?.address;
  //     // const currentChainId = chainId as ChainId;
  //     const originChainId = didWalletInfo?.chainId;

  //     if (originChainId === contractChainId) {
  //       if (contractChainId === 'AELF') {
  //         return await getAccount();
  //       } else {
  //         return wallet.address;
  //       }
  //     }
  //     try {
  //       const holder = await did.didWallet.getHolderInfoByContract({
  //         chainId: contractChainId as ChainId,
  //         caHash: caHash as string,
  //       });
  //       const filteredHolders = holder.managerInfos.filter((manager) => manager?.address === address);
  //       if (filteredHolders.length) {
  //         return await getAccount();
  //       } else {
  //         message.info(TipsMessage.Synchronizing);
  //         return '';
  //       }
  //     } catch (error) {
  //       message.info(TipsMessage.Synchronizing);
  //       return '';
  //     }
  //   } else {
  //     const provider = await discoverProvider();
  //     const status = await provider?.request({
  //       method: MethodsWallet.GET_WALLET_MANAGER_SYNC_STATUS,
  //       payload: { chainId: info.curChain },
  //     });
  //     if (status) {
  //       return await getAccount();
  //     } else {
  //       message.info(TipsMessage.Synchronizing);
  //       return '';
  //     }
  //   }
  // }, [wallet, walletType, walletInfo, contractChainId]);
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

  const {
    connectWallet: loginMethod,
    disConnectWallet,
    isConnected,
    walletInfo,
    walletType,
    isLocking,
    loginOnChainStatus,
  } = useConnectWallet();
  // const isWalletLogin = useMemo(() => isConnected, [isConnected]);

  // const { loginState, login: aelfLogin, loginEagerly, logout, walletType } = useWebLogin();
  // const isWalletLogin = loginState === WebLoginState.logined;
  // const isEagerly = loginState === WebLoginState.eagerly;

  // if (loginOnChainStatus !== LoginStatusEnum.SUCCESS) {
  //   return;
  // }

  console.log('loginOnChainStatus---loginOnChainStatus', loginOnChainStatus);
  const getToken = useGetToken();

  const [accountInfo] = useLocalStorage<{
    account?: string;
    token?: string;
    expirationTime?: number;
  }>(storages.accountInfo);
  const { hasToken } = useSelector(selectInfo);

  const isLogin = isConnected && hasToken && walletInfo;

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
    if (walletType === WalletTypeEnum.aa) {
      try {
        await getToken();
      } finally {
        getTokenLoading = false;
      }
      return;
    }
    if (!TelegramPlatform.isTelegramPlatform()) {
      loginModal.show({
        onConfirm: async () => {
          try {
            await getToken();
          } finally {
            getTokenLoading = false;
          }
        },
        onCancel: () => {
          isConnected && disConnectWallet();
          loginModal.hide();
          getTokenLoading = false;
        },
      });
    }
  };

  // useEffect(() => {}, [accountInfo]);

  useEffect(() => {
    if (pathName.includes('/term-service') || pathName.includes('/privacy-policy')) {
      return;
    }

    if (accountInfo?.token) {
      store.dispatch(setHasToken(true));
      return;
    } else {
      if (isConnected) {
        if (TelegramPlatform.isTelegramPlatform()) {
          if (!hasToken && !getTokenLoading && walletInfo?.extraInfo?.publicKey) {
            initToken();
          }
        } else {
          if (!hasToken && !getTokenLoading) {
            initToken();
          }
        }
      }

      // store.dispatch(setHasToken(false));
    }
  }, [accountInfo, isConnected, pathName, walletInfo?.extraInfo?.publicKey]);

  return {
    isLogin,
    login,
  };
};
