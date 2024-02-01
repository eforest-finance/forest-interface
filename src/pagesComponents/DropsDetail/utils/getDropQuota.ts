import { message } from 'antd';
import { DropState } from 'api/types';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { dispatch } from 'store/store';
import { sleep } from 'utils';

export const getDropQuota = async ({ dropId, address }: { dropId: string; address?: string }) => {
  // TODO
  console.log('=====getDropQuota', dropId, address);
  await sleep(1000);
  return {
    dropId: '11111',
    totalAmount: 1000,
    claimAmount: 100,
    addressClaimLimit: 1000,
    addressClaimAmount: 0,
    state: DropState.Live,
  };
};

export const updateDropQuota = async (params: { dropId: string; address?: string }) => {
  try {
    const res = await getDropQuota(params);
    if (res.state === DropState.Canceled) {
      message.error("The event has ended. You'll be automatically redirected to the Drops page.", 3);
      return DropState.Canceled;
    } else {
      dispatch(setDropQuota({ ...res }));
      if (res.state === DropState.End) {
        message.error('The event has ended.');
        return DropState.End;
      }
      return DropState.Live;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
