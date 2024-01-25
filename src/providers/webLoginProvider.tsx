'use client';

import { PortkeyProvider } from 'aelf-web-login';
import { scheme } from '@portkey/utils';
import dynamic from 'next/dynamic';
import isMobile from 'utils/isMobile';
import { store } from 'store/store';

const APP_NAME = 'forest';
const WebLoginProviderDynamic = dynamic(
  async () => {
    const info = store.getState().aelfInfo.aelfInfo;

    const weblogin = await import('aelf-web-login').then((module) => module);

    weblogin.setGlobalConfig({
      appName: APP_NAME,
      chainId: info.curChain,
      networkType: 'TESTNET',
      portkey: {
        useLocalStorage: true,
        graphQLUrl: info.graphqlServer,
        connectUrl: 'http://192.168.66.203:8001',
        socialLogin: {
          // Portkey: {
          //   websiteName: APP_NAME,
          //   websiteIcon: `${window.location.origin}/logo192.png`,
          // },
        },
        loginConfig: {
          recommendIndexes: [0, 1],
          loginMethodsOrder: ['Google', 'Telegram', 'Apple', 'Phone', 'Email'],
        },
        requestDefaults: {
          timeout: info.networkType === 'TESTNET' ? 300000 : 80000,
          baseURL: `${info.portkeyServer}/v1`,
        },
      },
      portkeyV2: {
        networkType: 'TESTNET',
        useLocalStorage: true,
        graphQLUrl: info.graphqlServer,
        connectUrl: 'http://192.168.67.127:8080',
        socialLogin: {
          // Portkey: {
          //   websiteName: APP_NAME,
          //   websiteIcon: `${window.location.origin}/logo192.png`,
          // },
        },
        loginConfig: {
          recommendIndexes: [0, 1],
          loginMethodsOrder: ['Google', 'Telegram', 'Apple', 'Phone', 'Email'],
        },
        requestDefaults: {
          timeout: info.networkType === 'TESTNET' ? 300000 : 80000,
          baseURL: `${info.portkeyServer}/v2`,
        },
      },
      aelfReact: {
        appName: APP_NAME,
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: info?.rpcUrlAELF as unknown as string,
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: info?.rpcUrlTDVW as unknown as string,
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: info?.rpcUrlTDVV as unknown as string,
          },
        },
      },
      defaultRpcUrl: (info?.[`rpcUrl${String(info?.curChain).toUpperCase()}`] as unknown as string) || info?.rpcUrlTDVW,
    });
    return weblogin.WebLoginProvider;
  },
  { ssr: false },
);

const jumpAppInH5 = (maxWaitingTime: number) => {
  const initialTime = +new Date();
  let waitTime = 0;
  window.location.href = scheme.formatScheme({
    action: 'linkDapp',
    domain: window.location.host,
    custom: {
      url: window.location.href,
    },
  });

  const checkOpen = window.setInterval(() => {
    waitTime = +new Date() - initialTime;
    if (waitTime > maxWaitingTime) {
      window.clearInterval(checkOpen);
      window.open('https://portkey.finance', '_blank');
    } else {
      const hide = document.hidden || document?.webkitHidden;
      if (hide) {
        window.clearInterval(checkOpen);
      }
    }
  }, 100);
};

export default ({ children }: { children: React.ReactNode }) => {
  const info = store.getState().aelfInfo.aelfInfo;
  console.log('networkType---', info?.networkType);

  return (
    <PortkeyProvider networkType={'TESTNET'}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: false,
          checkAccountInfoSync: true,
        }}
        extraWallets={['discover', 'elf']}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
          onClick: (continueDefaultBehaviour) => {
            const mobileType = isMobile(navigator.userAgent);
            const isMobileDevice =
              mobileType.apple.phone ||
              mobileType.android.phone ||
              mobileType.apple.tablet ||
              mobileType.android.tablet;
            if (isMobileDevice) {
              jumpAppInH5(mobileType.apple.phone ? 200 : 1000);
              return;
            }
            continueDefaultBehaviour();
          },
        }}>
        {children}
      </WebLoginProviderDynamic>
    </PortkeyProvider>
  );
};
