import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { IBaseConfig, IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { TChainId, SignInDesignEnum, NetworkEnum, WalletAdapter } from '@aelf-web-login/wallet-adapter-base';
import { useMemo } from 'react';
import { GlobalConfigProps } from '@portkey/did-ui-react/dist/_types/src/components/config-provider/types';
import { store } from 'store/store';

const APP_NAME = 'forest';

export default function useWebLoginConfig() {
  const info = store.getState().aelfInfo.aelfInfo;

  const connectUrlV2 = info?.connectUrlV2;
  const networkTypeV2 = info?.networkTypeV2;
  const curChain = info.curChain;

  const didConfig: GlobalConfigProps = useMemo(() => {
    return {
      graphQLUrl: info.graphqlServerV2,
      connectUrl: connectUrlV2,
      serviceUrl: info.portkeyServerV2,
      requestDefaults: {
        timeout: networkTypeV2 === 'TESTNET' ? 300000 : 80000,
        baseURL: info.portkeyServerV2 || '',
      },
      socialLogin: {
        // Portkey: {
        //   websiteName: APP_NAME,
        //   websiteIcon: WEBSITE_ICON,
        // },
      },
    };
  }, [connectUrlV2, info.graphqlServerV2, networkTypeV2, info.portkeyServerV2]);

  const baseConfig: IBaseConfig = useMemo(() => {
    return {
      showVconsole: false,
      networkType: networkTypeV2 as NetworkEnum,
      chainId: curChain as TChainId,
      keyboard: true,
      noCommonBaseModal: false,
      design: SignInDesignEnum.CryptoDesign,
      titleForSocialDesign: 'Crypto wallet',
      // iconSrcForSocialDesign: 'url or base64',
    };
  }, [curChain, networkTypeV2]);

  const wallets: WalletAdapter[] = useMemo(() => {
    return [
      new PortkeyAAWallet({
        appName: APP_NAME,
        chainId: curChain as TChainId,
        autoShowUnlock: true,
        noNeedForConfirm: true,
      }),
      new PortkeyDiscoverWallet({
        networkType: networkTypeV2 as NetworkEnum,
        chainId: curChain as TChainId,
        autoRequestAccount: true, // If set to true, please contact Portkey to add whitelist @Rachel
        autoLogoutOnDisconnected: true,
        autoLogoutOnNetworkMismatch: true,
        autoLogoutOnAccountMismatch: true,
        autoLogoutOnChainMismatch: true,
      }),
      new NightElfWallet({
        chainId: curChain as TChainId,
        appName: APP_NAME,
        connectEagerly: true,
        defaultRpcUrl: info.rpcUrlAELF || '',
        nodes: {
          AELF: {
            chainId: 'AELF',
            rpcUrl: info.rpcUrlAELF || '',
          },
          tDVW: {
            chainId: 'tDVW',
            rpcUrl: info.rpcUrlTDVW || '',
          },
          tDVV: {
            chainId: 'tDVV',
            rpcUrl: info.rpcUrlTDVV || '',
          },
        },
      }),
    ];
  }, [curChain, networkTypeV2, info.rpcUrlAELF, info.rpcUrlTDVV, info.rpcUrlTDVW]);

  const config: IConfigProps | null = useMemo(() => {
    if (!info) return null;
    return {
      didConfig,
      baseConfig,
      wallets,
    };
  }, [baseConfig, info, didConfig, wallets]);

  return config;
}
