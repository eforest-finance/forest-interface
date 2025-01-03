'use client';
import React, { useEffect, Suspense, useCallback } from 'react';
import { Layout as AntdLayout, message } from 'antd';
import clsx from 'clsx';

import { useSelector } from 'react-redux';

import Header from 'components/Header';
import Footer from 'components/BaseFooter';
import PageLoading from 'components/PageLoading';
import isMobile from 'utils/isMobile';
import { store, dispatch } from 'store/store';
import { selectInfo, setHasToken, setIsMobile, setIsSmallScreen, setShowDisconnectTip } from 'store/reducer/info';
import WebLoginInstance, { MethodType } from 'contract/webLogin';
import { SupportedELFChainId } from 'constants/chain';
import useUserInfo from 'hooks/useUserInfo';
import AWS from 'aws-sdk';
import { useEffectOnce, useLocalStorage } from 'react-use';
import storages from '../storages';
import dynamic from 'next/dynamic';
import { useTheme } from 'hooks/useTheme';
import { logOutUserInfo, setUserInfo, setWalletInfo } from 'store/reducer/userInfo';
import 'utils/analytics';
import AWSManagerInstance from 'utils/S3';
// import { formatErrorMsg } from 'contract/formatErrorMsg';
// import { IContractError } from 'contract/type';
import { usePathname } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';
// import { useBroadcastChannel } from 'hooks/useContractConnect';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import WalletAndTokenInfo from 'utils/walletAndTokenInfo';
import VConsole from 'vconsole';

import 'utils/telegram-web-app';
// import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

// Import the functions you need from the SDKs you need

const Layout = dynamic(async () => {
  const info = store.getState().aelfInfo.aelfInfo;
  // const { WebLoginState, useWebLogin, useCallContract, WebLoginEvents, useWebLoginEvent } = await import(
  //   'aelf-web-login'
  // ).then((module) => module);

  const { useConnectWallet } = await import('@aelf-web-login/wallet-adapter-react').then((module) => module);

  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;
    const { isSmallScreen, loading } = useSelector(selectInfo);
    const { isMD } = useResponsive();
    const [theme, initialTheme] = useTheme();
    const [, , removeAccountInfo] = useLocalStorage(storages.accountInfo);
    const [, , removeWalletInfo] = useLocalStorage(storages.walletInfo);
    // const webLoginContext = useWebLogin();
    const { callSendMethod, callViewMethod, isLocking, isConnected, loginError, walletType } = useConnectWallet();

    // const { callSendMethod: callAELFSendMethod, callViewMethod: callAELFViewMethod } = useCallContract({
    //   chainId: SupportedELFChainId.MAIN_NET,
    //   rpcUrl: info?.rpcUrlAELF,
    // });
    // const { callSendMethod: callTDVVSendMethod, callViewMethod: callTDVVViewMethod } = useCallContract({
    //   chainId: SupportedELFChainId.TDVV_NET,
    //   rpcUrl: info?.rpcUrlTDVV,
    // });
    // const { callSendMethod: callTDVWSendMethod, callViewMethod: callTDVWViewMethod } = useCallContract({
    //   chainId: SupportedELFChainId.TDVW_NET,
    //   rpcUrl: info?.rpcUrlTDVW,
    // });

    const webLoginContext = useConnectWallet();

    const getUserInfo = useUserInfo();

    const pathName = usePathname();

    useEffect(() => {
      console.log('pathname change', pathName);
      window.document.body.scrollTo({
        top: 0,
      });
    }, [pathName]);

    useEffect(() => {
      if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        new VConsole();
      }
    }, []);

    const { isLogin } = useCheckLoginAndToken();

    useEffect(() => {
      if (isLogin) {
        getSynchronizedResults();
      }
    }, [isLogin]);

    const getSynchronizedResults = async () => {
      // await getToken();
      await getUserInfo(webLoginContext.walletInfo.address);

      // TODO: get sync results
      // const results = (await fetchSyncResults({})) || [
      //   {
      //     transactionHash: '',
      //     crossChainCreateTokenTxId: '',
      //     validateTokenTxId: '',
      //     status: '',
      //   },
      // ];
    };

    const initAwsConfig = () => {
      AWS.config.update({
        region: 'ap-northeast-1',
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: info.identityPoolID,
        }),
      });
      AWSManagerInstance.updateConfigOfBucket(info?.bucket);
    };

    useEffect(() => {
      console.log('webLoginContext.loginState', webLoginContext.isConnected);

      WebLoginInstance.get().setContractMethod([
        {
          chain: SupportedELFChainId.MAIN_NET,
          sendMethod: callSendMethod as MethodType,
          viewMethod: callViewMethod as MethodType,
        },
        {
          chain: SupportedELFChainId.TDVV_NET,
          sendMethod: callSendMethod as MethodType,
          viewMethod: callViewMethod as MethodType,
        },
        {
          chain: SupportedELFChainId.TDVW_NET,
          sendMethod: callSendMethod as MethodType,
          viewMethod: callViewMethod as MethodType,
        },
      ]);
    }, [callSendMethod, callViewMethod, webLoginContext.isConnected]);

    useEffect(() => {
      store.dispatch(setIsSmallScreen(isMD));
    }, [isMD]);

    const logout = useCallback(() => {
      removeAccountInfo();
      removeWalletInfo();
      dispatch(setUserInfo(logOutUserInfo));
      dispatch(setWalletInfo({}));
    }, [removeAccountInfo, removeWalletInfo]);

    useEffect(() => {
      if (!isConnected) {
        if (walletType === WalletTypeEnum.aa) {
          store.dispatch(setHasToken(false));
          logout();
          WalletAndTokenInfo.reset();
        }

        if (walletType === WalletTypeEnum.discover) {
          logout();
          store.dispatch(setShowDisconnectTip(true));
        }
      }

      if (loginError) {
        message.error(loginError.message);
      }
    }, [isConnected, loginError, walletType]);

    useEffect(() => {
      WalletAndTokenInfo.setWallet(webLoginContext.walletType, webLoginContext.walletInfo);
      WalletAndTokenInfo.setSignMethod(webLoginContext.getSignature);
    }, [webLoginContext]);

    // useBroadcastChannel();

    useEffectOnce(() => {
      initAwsConfig();
      initialTheme(theme);

      const resize = () => {
        const ua = navigator.userAgent;
        const mobileType = isMobile(ua);
        const isMobileDevice =
          mobileType.apple.phone || mobileType.android.phone || mobileType.apple.tablet || mobileType.android.tablet;
        store.dispatch(setIsMobile(isMobileDevice));
        // const isSmallScreen = isMobileDevice || window.innerWidth < 768;
        // store.dispatch(setIsSmallScreen(isSmallScreen));

        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    });

    return (
      <>
        <AntdLayout
          className={clsx(`forest-marketplace`, isSmallScreen && `forest-marketplace-mobile`, '!bg-fillPageBg')}>
          <Header />
          <AntdLayout.Content
            className={`marketplace-content !min-h-[100vh]  ${
              isSmallScreen ? 'marketplace-content-mobile' : 'marketplace-content-pc '
            }`}
            id={`marketplace-content`}>
            <Suspense fallback={<PageLoading />}>{children}</Suspense>
          </AntdLayout.Content>
          <Footer />
        </AntdLayout>
        {loading?.open && <PageLoading />}
      </>
    );
  };
});

export default Layout;
