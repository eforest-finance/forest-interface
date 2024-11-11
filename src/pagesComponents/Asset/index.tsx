import { useRouter } from 'next/navigation';
import { LeftOutlined } from '@ant-design/icons';
// import { WalletType, WebLoginState, useComponentFlex, useWebLogin } from 'aelf-web-login';
import useGetState from 'store/state/getState';
import { useTimeoutFn } from 'react-use';

const PORTKEY_LOGIN_CHAIN_ID_KEY = 'PortkeyOriginChainId';
import { LoginStatusEnum, TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { PortkeyAssetProvider, Asset, did } from '@portkey/did-ui-react';
import { useEffect, useMemo } from 'react';

export default function MyAsset() {
  const router = useRouter();
  // const { loginState, walletType } = useWebLogin();
  const { walletInfo, aelfInfo } = useGetState();
  const { isShowRampBuy, isShowRampSell } = aelfInfo;
  // const isLogin = loginState === WebLoginState.logined;
  // const isPortkeyConnect = walletType === WalletType.portkey;

  const {
    walletInfo: wallet,
    walletType,
    disConnectWallet,
    getSignature,
    isConnected,
    connectWallet,
    loginOnChainStatus,
  } = useConnectWallet();

  const originChainId = localStorage.getItem(PORTKEY_LOGIN_CHAIN_ID_KEY) || '';

  useTimeoutFn(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, 3000);

  // if (!isPortkeyConnect) {
  //   return null;
  // }

  const isLoginOnChain = did.didWallet.isLoginStatus === LoginStatusEnum.SUCCESS;

  if (!wallet?.extraInfo?.portkeyInfo?.pin) {
    return null;
  }

  return (
    <div>
      <PortkeyAssetProvider
        originChainId={originChainId as Chain}
        pin={wallet?.extraInfo?.portkeyInfo?.pin}
        // caHash={walletInfo?.portkeyInfo?.caInfo?.caHash}
        // didStorageKeyName={APP_NAME}
      >
        <Asset
          isShowRamp={isShowRampBuy || isShowRampSell}
          isShowRampBuy={isShowRampBuy}
          isShowRampSell={isShowRampSell}
          isLoginOnChain={isLoginOnChain}
          faucet={{
            faucetContractAddress: aelfInfo?.faucetContractAddress,
          }}
          backIcon={<LeftOutlined />}
          onOverviewBack={() => {
            router.back();
          }}
          onLifeCycleChange={(lifeCycle) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
