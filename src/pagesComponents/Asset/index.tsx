import { useRouter } from 'next/navigation';
import { LeftOutlined } from '@ant-design/icons';
import { WalletType, WebLoginState, useComponentFlex, useWebLogin } from 'aelf-web-login';
import useGetState from 'store/state/getState';
import { useTimeoutFn } from 'react-use';

const PORTKEY_LOGIN_CHAIN_ID_KEY = 'PortkeyOriginChainId';

const APP_NAME = 'forest';

export default function MyAsset() {
  const router = useRouter();
  const { loginState, walletType } = useWebLogin();
  const { walletInfo, aelfInfo } = useGetState();
  const isLogin = loginState === WebLoginState.logined;
  const isPortkeyConnect = walletType === WalletType.portkey;

  const originChainId = localStorage.getItem(PORTKEY_LOGIN_CHAIN_ID_KEY) || '';

  const { PortkeyAssetProvider, Asset } = useComponentFlex();

  useTimeoutFn(() => {
    if (!isLogin || !isPortkeyConnect) {
      router.push('/');
    }
  }, 3000);

  if (!isPortkeyConnect) {
    return null;
  }
  return (
    <div>
      <PortkeyAssetProvider
        originChainId={originChainId as Chain}
        pin={walletInfo?.portkeyInfo?.pin}
        caHash={walletInfo?.portkeyInfo?.caInfo?.caHash}
        didStorageKeyName={APP_NAME}>
        <Asset
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
