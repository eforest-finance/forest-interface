import { useRouter } from 'next/navigation';
import { useTimeoutFn } from 'react-use';
import { useCheckLoginAndToken } from './useWalletSync';
import { store } from 'store/store';
import { setHasToken } from 'store/reducer/info';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useEffect } from 'react';

export function useLogoutListener() {
  const nav = useRouter();
  const { isLogin } = useCheckLoginAndToken();
  const { isConnected } = useConnectWallet();

  useEffect(() => {
    if (!isConnected) {
      store.dispatch(setHasToken(false));
      nav.push('/');
      // setMenuModalVisibleModel(false);
    }
  }, [isConnected]);

  // useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
  //   store.dispatch(setHasToken(false));
  //   nav.push('/');
  // });

  useTimeoutFn(() => {
    if (!isLogin) {
      nav.push('/');
    }
  }, 3000);
}
