import { DropState } from 'api/types';
import { sleep } from 'utils';

export const getDropQuota = async () => {
  // TODO
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
