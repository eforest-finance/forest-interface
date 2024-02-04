import { message } from 'antd';
import { fetchDropQuota } from 'api/fetch';
import { DropState } from 'api/types';
import { EventEnded } from 'contract/formatErrorMsg';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { dispatch } from 'store/store';

export const getDropQuota = async ({ dropId, address }: { dropId: string; address: string }) => {
  try {
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
    let state = res.state;
    if (res.state === DropState.Canceled) {
      dispatch(
        setDropQuota({
          state: DropState.Canceled,
        }),
      );
      state = DropState.Canceled;
    } else {
      dispatch(setDropQuota({ ...res }));
      if (res.state === DropState.End) {
        message.error(EventEnded);
        state = DropState.End;
      } else {
        state = DropState.Live;
      }
    }

    return {
      state,
      dropQuota: res,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
