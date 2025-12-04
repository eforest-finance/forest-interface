import { fetchDropDetail } from 'api/fetch';
import { DropState } from 'api/types';
import moment from 'moment';
import { setDropDetailInfo, setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { dispatch } from 'store/store';

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

    return {
      ...res,
      state,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateDropDetail = async ({ dropId, address }: { dropId: string; address?: string }) => {
  try {
    const res = await getDropDetail({
      dropId,
      address,
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
    }
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};
