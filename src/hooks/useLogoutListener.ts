import { useRouter } from 'next/navigation';
import { useTimeoutFn } from 'react-use';
import { useCheckLoginAndToken } from './useWalletSync';
import { WebLoginEvents, useWebLoginEvent } from 'aelf-web-login';
import { store } from 'store/store';
import { setHasToken } from 'store/reducer/info';

export function useLogoutListener() {
  const nav = useRouter();
  const { isLogin } = useCheckLoginAndToken();

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    store.dispatch(setHasToken(false));
    nav.push('/');
  });

  useTimeoutFn(() => {
    if (!isLogin) {
      nav.push('/');
    }
  }, 3000);
}
