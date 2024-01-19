import { resolve } from 'path';
import request from './request';
import { IActionDetail, IDropListParams, IDropListRes } from './types';

export const fetchRecommendAction = async (): Promise<IActionDetail[]> => {
  return request.get<IActionDetail[]>('app/drop/recommendation');
};

export const fetchDropList = async ({
  pageIndex = 1,
  pageSize = 8,
  state = 0,
}: IDropListParams): Promise<IDropListRes> => {
  console.log('execute fetchDropList', pageIndex, pageSize, state);
  const res = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCount: 23,
        items: [
          {
            dropId: `1-even-${Math.random()}`,
            dropName: `dropName-ef`,
            bannerUrl: '',
            introduction:
              'Activity Description Text:Launchpad is your gateway to exclusive NFT launches on Forest NFT Marketplace.Engage inactivities like allowlisting, airdrops, minting, and subscriptions.Explore first-class collectibles and never miss out.',
            startTime: Date.now(),
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            mintPrice: 1,
          },
          {
            dropId: `1-even-${Math.random()}`,
            dropName: `dropName-ab`,
            bannerUrl: '',
            introduction:
              'Activity Description Text:Launchpad is your gateway to exclusive NFT launches on Forest NFT Marketplace.Engage inactivities like allowlisting, airdrops, minting, and subscriptions.Explore first-class collectibles and never miss out.',
            startTime: Date.now(),
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            mintPrice: 1,
          },
          {
            dropId: `1-even-${Math.random()}`,
            dropName: `dropName-sgs`,
            bannerUrl: '',
            introduction:
              'Activity Description Text:Launchpad is your gateway to exclusive NFT launches on Forest NFT Marketplace.Engage inactivities like allowlisting, airdrops, minting, and subscriptions.Explore first-class collectibles and never miss out.',
            startTime: Date.now(),
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            mintPrice: 1,
          },
          {
            dropId: `1-even-${Math.random()}`,
            dropName: `dropName-sg`,
            bannerUrl: '',
            introduction:
              'Activity Description Text:Launchpad is your gateway to exclusive NFT launches on Forest NFT Marketplace.Engage inactivities like allowlisting, airdrops, minting, and subscriptions.Explore first-class collectibles and never miss out.',
            startTime: Date.now(),
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            mintPrice: 1,
          },
        ],
      });
    }, 300);
  });
  return res as IDropListRes;
  const params = {
    skipCount: (pageIndex - 1) * pageSize,
    maxResultCount: pageSize,
    state,
  };
  return request.get<IDropListRes>('app/drop/list', {
    params,
  });
};
