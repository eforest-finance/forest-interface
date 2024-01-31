import { useEffect } from 'react';
import { clearDropDetailInfo, setDropDetailInfo, setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import useGetState from 'store/state/getState';
import { dispatch, store } from 'store/store';
import { getDropDetail } from '../utils/getDropDetail';

export const useInitialization = () => {
  const { walletInfo } = useGetState();

  const getInfo = async () => {
    try {
      const res = await getDropDetail();
      if (res) {
        dispatch(setDropDetailInfo(res));
        dispatch(
          setDropQuota({
            dropId: res.dropId,
            totalAmount: res.totalAmount,
            claimAmount: res.claimAmount,
            addressClaimLimit: res.addressClaimLimit,
            addressClaimAmount: res.addressClaimAmount,
            state: res.state,
          }),
        );
      }
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    getInfo();
  }, [walletInfo.address]);

  useEffect(() => {
    return () => {
      store.dispatch(clearDropDetailInfo());
    };
  }, []);
};
