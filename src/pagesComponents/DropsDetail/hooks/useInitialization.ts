import { useEffect, useState } from 'react';
import { clearDropDetailInfo, setDropDetailInfo, setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import useGetState from 'store/state/getState';
import { dispatch, store } from 'store/store';
import { getDropDetail } from '../utils/getDropDetail';
import { useParams, useRouter } from 'next/navigation';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import initializeProto from 'utils/initializeProto';
import { message } from 'antd';
import { EventEndedBack } from 'contract/formatErrorMsg';
import { sleep } from 'utils';
import { DropState } from 'api/types';

export const useInitialization = () => {
  const { walletInfo, aelfInfo } = useGetState();
  const { dropDetailInfo } = useDropDetailGetState();
  const { dropId } = useParams() as {
    dropId: string;
  };
  const nav = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  const getInfo = async () => {
    try {
      if (!dropId) return;
      if (!dropDetailInfo) {
        setLoading(true);
      }
      const res = await getDropDetail({
        dropId,
        address: walletInfo.address,
      });
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
        setLoading(false);

        if (res.state === DropState.Canceled) {
          message.error(EventEndedBack, 3);
          await sleep(3000);
          nav.replace('/drops');
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfo();
  }, [walletInfo.address]);

  useEffect(() => {
    initializeProto(aelfInfo.dropSideAddress);
  }, [aelfInfo.dropSideAddress]);

  useEffect(() => {
    return () => {
      store.dispatch(clearDropDetailInfo());
    };
  }, []);

  return {
    loading,
  };
};
