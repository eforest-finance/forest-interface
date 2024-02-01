import { DropState, SocialMediaType } from 'api/types';
import moment from 'moment';
import { sleep } from 'utils';

export const getDropDetail = async () => {
  // TODO
  await sleep(1000);
  let state = DropState.Live;
  const startTime = moment('2024-1-20').valueOf();
  const expireTime = moment('2024-1-21').valueOf();
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

  console.log('time======startTime', startTime);
  console.log('time======expireTime', expireTime);
  console.log('time======now', now);
  return {
    dropId: '11111',
    dropName: 'dropName',
    bannerUrl: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1706165354700-8k.jpeg',
    logoUrl: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1706165354700-8k.jpeg',
    collectionId: 'tDVW-ZZZZZZZXZ-0',
    collectionLogo: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1706165354700-8k.jpeg',
    collectionName: 'collectionName',
    introduction: 'introduction,introduction,introduction',
    totalAmount: 1000,
    claimAmount: 100,
    addressClaimLimit: 1000,
    addressClaimAmount: 0,
    state,
    mintPrice: 500,
    mintPriceUsd: 100,
    burn: true,
    startTime,
    expireTime,
    socialMedia: [
      {
        type: SocialMediaType.discord,
        link: 'link',
      },
    ],
  };
};
