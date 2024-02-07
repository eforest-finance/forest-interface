'use client';
import { scheme } from '@portkey/utils';
import dynamic from 'next/dynamic';
import isMobile from 'utils/isMobile';
import { store } from 'store/store';

const APP_NAME = 'forest';

const PortkeyProviderDynamic = dynamic(
  async () => {
    const weblogin = await import('aelf-web-login').then((module) => module);
    return weblogin.PortkeyProvider;
  },
  { ssr: false },
) as any;

const WebLoginProviderDynamic = dynamic(
  async () => {
    const info = store.getState().aelfInfo.aelfInfo;
    const connectUrlV1 = info?.connectUrlV1;
    const connectUrlV2 = info?.connectUrlV2;
    const networkType = info?.networkType;

    const weblogin = await import('aelf-web-login').then((module) => module);

    weblogin.setGlobalConfig({
      appName: APP_NAME,
      chainId: info.curChain,
      networkType,
      portkey: {
        useLocalStorage: true,
        graphQLUrl: info.graphqlServer,
        connectUrl: connectUrlV1,
        requestDefaults: {
          timeout: info.networkType === 'TESTNET' ? 300000 : 80000,
          baseURL: info.portkeyServerV1,
        },
      },
      portkeyV2: {
        networkType,
        useLocalStorage: true,
        graphQLUrl: info.graphqlServerV2,
        connectUrl: connectUrlV2,
        socialLogin: {},
        requestDefaults: {
          timeout: info.networkType === 'TESTNET' ? 300000 : 80000,
          baseURL: info.portkeyServerV2,
        },
        serviceUrl: info.portkeyServerV2,
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

  return (
    <PortkeyProviderDynamic networkType={info.networkType} networkTypeV2={info?.networkTypeV2}>
      <WebLoginProviderDynamic
        nightElf={{
          useMultiChain: true,
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: false,
          checkAccountInfoSync: true,
          design: 'CryptoDesign',
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
    </PortkeyProviderDynamic>
  );
};
