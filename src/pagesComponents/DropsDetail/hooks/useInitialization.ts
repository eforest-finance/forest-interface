import { useEffect, useState } from 'react';
import { clearDropDetailInfo } from 'store/reducer/dropDetail/dropDetailInfo';
import useGetState from 'store/state/getState';
import { store } from 'store/store';
import { updateDropDetail } from '../utils/getDropDetail';
import { useParams, useRouter } from 'next/navigation';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import initializeProto from 'utils/initializeProto';
import { message } from 'antd';
import { EventEndedBack } from 'contract/formatErrorMsg';
import { sleep } from 'utils';
import { DropState } from 'api/types';

export const useInitialization = () => {
  const { walletInfo, aelfInfo } = useGetState();
  const { dropDetailInfo, dropQuota } = useDropDetailGetState();
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
      await updateDropDetail({
        dropId,
        address: walletInfo.address,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onCanceled = async () => {
    message.error(EventEndedBack, 3);
    await sleep(3000);
    nav.replace('/drops');
  };

  useEffect(() => {
    if (dropQuota?.state === DropState.Canceled) {
      onCanceled();
    }
  }, [dropQuota?.state]);

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
