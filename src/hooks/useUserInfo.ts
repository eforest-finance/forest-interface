import { useCallback } from 'react';
import { logOutUserInfo, setUserInfo } from 'store/reducer/userInfo';
import { openModal } from 'store/reducer/errorModalInfo';
import { useSelector, store } from 'store/store';
import { fetchUserInfo } from 'api/fetch';

export default function useUserInfo() {
  const {
    userInfo,
    walletInfo: { address: account },
  } = useSelector((store) => store.userInfo);

  const setEmpty = () => store.dispatch(setUserInfo(logOutUserInfo));

  const getUserInfo = useCallback(
    async (address?: string, notStore?: boolean) => {
      if (address) {
        const result = await fetchUserInfo({
          address,
        });
        !notStore && store.dispatch(setUserInfo(result));
        return result;
      }

      if (!account) {
        setEmpty();
        return null;
      }

      const result = await fetchUserInfo({
        address: account,
      });
      if (!result) {
        return store.dispatch(openModal());
      }
      store.dispatch(setUserInfo(result));
      return null;
    },
    [account, userInfo],
  );

  return getUserInfo;
}
