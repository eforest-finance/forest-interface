import { message } from 'antd';
import { fetchDropQuota } from 'api/fetch';
import { DropState } from 'api/types';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { dispatch } from 'store/store';

export const getDropQuota = async ({ dropId, address }: { dropId: string; address: string }) => {
  try {
    console.log('=====getDropQuota', dropId, address);
    const res = await fetchDropQuota({ dropId, address });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateDropQuota = async (params: { dropId: string; address: string }) => {
  try {
    console.log('=====getDropQuota 11111', params);

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
