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
import WebLoginInstance from 'contract/webLogin';
import { SupportedELFChainId } from 'constants/chain';
import { useGetToken } from 'hooks/useContractConnect';
import useUserInfo from 'hooks/useUserInfo';
import AWS from 'aws-sdk';
import { useEffectOnce, useLocalStorage } from 'react-use';
import storages from '../storages';
import dynamic from 'next/dynamic';
import { useTheme } from 'hooks/useTheme';
import { logOutUserInfo, setUserInfo, setWalletInfo } from 'store/reducer/userInfo';
import 'utils/analytics';
import AWSManagerInstance from 'utils/S3';
import { formatErrorMsg } from 'contract/formatErrorMsg';
import { IContractError } from 'contract/type';
import { useRouter, usePathname } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';
import { useBroadcastChannel } from 'hooks/useContractConnect';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import WalletAndTokenInfo from 'utils/walletAndTokenInfo';

// Import the functions you need from the SDKs you need

const Layout = dynamic(async () => {
  const info = store.getState().aelfInfo.aelfInfo;
  const { WebLoginState, useWebLogin, useCallContract, WebLoginEvents, useWebLoginEvent } = await import(
    'aelf-web-login'
  ).then((module) => module);

  return (props: React.PropsWithChildren<{}>) => {
    const { children } = props;
    const { isSmallScreen, loading } = useSelector(selectInfo);
    const { isMD } = useResponsive();
    const [theme, initialTheme] = useTheme();
    const [, , removeAccountInfo] = useLocalStorage(storages.accountInfo);
    const [, , removeWalletInfo] = useLocalStorage(storages.walletInfo);
    const webLoginContext = useWebLogin();
    const { version } = webLoginContext;

    const { callSendMethod: callAELFSendMethod, callViewMethod: callAELFViewMethod } = useCallContract({
      chainId: SupportedELFChainId.MAIN_NET,
      rpcUrl: info?.rpcUrlAELF,
    });
    const { callSendMethod: callTDVVSendMethod, callViewMethod: callTDVVViewMethod } = useCallContract({
      chainId: SupportedELFChainId.TDVV_NET,
      rpcUrl: info?.rpcUrlTDVV,
    });
    const { callSendMethod: callTDVWSendMethod, callViewMethod: callTDVWViewMethod } = useCallContract({
      chainId: SupportedELFChainId.TDVW_NET,
      rpcUrl: info?.rpcUrlTDVW,
    });

    (window as any).logout = webLoginContext.logout;
    WebLoginInstance.get().setWebLoginContext(webLoginContext);

    const getToken = useGetToken();
    const getUserInfo = useUserInfo();

    const nav = useRouter();

    const pathName = usePathname();

    useEffect(() => {
      console.log('pathname change', pathName);
      window.document.body.scrollTo({
        top: 0,
      });
    }, [pathName]);

    const { isLogin } = useCheckLoginAndToken();

    useEffect(() => {
      if (isLogin) {
        getSynchronizedResults();
      }
    }, [isLogin]);

    const getSynchronizedResults = async () => {
      // await getToken();
      await getUserInfo(webLoginContext.wallet.address);

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
      console.log('webLoginContext.loginState', webLoginContext.loginState);
      if (webLoginContext.loginState === WebLoginState.logined) {
        WebLoginInstance.get().setContractMethod([
          {
            chain: SupportedELFChainId.MAIN_NET,
            sendMethod: callAELFSendMethod,
            viewMethod: callAELFViewMethod,
          },
          {
            chain: SupportedELFChainId.TDVV_NET,
            sendMethod: callTDVVSendMethod,
            viewMethod: callTDVVViewMethod,
          },
          {
            chain: SupportedELFChainId.TDVW_NET,
            sendMethod: callTDVWSendMethod,
            viewMethod: callTDVWViewMethod,
          },
        ]);
        // getSynchronizedResults();
      }
    }, [webLoginContext.loginState]);

    useEffect(() => {
      store.dispatch(setIsSmallScreen(isMD));
    }, [isMD]);

    const logout = useCallback(() => {
      removeAccountInfo();
      removeWalletInfo();
      dispatch(setUserInfo(logOutUserInfo));
      dispatch(setWalletInfo({}));
    }, [removeAccountInfo, removeWalletInfo]);

    useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
      store.dispatch(setHasToken(false));
      logout();
      WalletAndTokenInfo.reset();
    });

    useWebLoginEvent(WebLoginEvents.DISCOVER_DISCONNECTED, () => {
      logout();
      store.dispatch(setShowDisconnectTip(true));
    });

    useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, (error) => {
      const resError = error as IContractError;
      message.error(formatErrorMsg(resError).errorMessage.message);
    });

    useEffect(() => {
      WalletAndTokenInfo.setWallet(webLoginContext.walletType, webLoginContext.wallet, webLoginContext.version);
      WalletAndTokenInfo.setSignMethod(webLoginContext.getSignature);
    }, [webLoginContext]);

    useBroadcastChannel();

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
            className={`marketplace-content, ${
              isSmallScreen ? 'marketplace-content-mobile' : 'marketplace-content-pc'
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
