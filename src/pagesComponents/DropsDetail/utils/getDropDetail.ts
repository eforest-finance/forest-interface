import { fetchDropDetail } from 'api/fetch';
import { DropState } from 'api/types';
import moment from 'moment';

export const getDropDetail = async ({ dropId, address }: { dropId: string; address?: string }) => {
  try {
    const res = await fetchDropDetail({
      dropId,
      address,
    });

    let state = res.state;
    const startTime = res.startTime;
    const expireTime = res.expireTime;
    const now = moment().valueOf();

    if (state !== DropState.Canceled) {
      if (startTime > now) {
        state = DropState.Upcoming;
      } else if (expireTime < now) {
        state = DropState.End;
      } else {
        state = DropState.Live;
      }
    }

    console.log('=====fetchDropDetail res', res);

    return {
      ...res,
      state,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
