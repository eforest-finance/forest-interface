import { fetchGetNftPrices } from 'api/fetch';
import { IPricesList } from 'api/types';

export interface PricePoint {
  price: number;
  timestamp: number;
}

export interface PricesList {
  totalCount: number;
  items: PricePoint[];
}
const getNFTPrices = async (nftInfoId: string | undefined, firstTime: number) => {
  if (!nftInfoId) return;
  const lastTime = new Date().getTime();
  const result: IPricesList = await fetchGetNftPrices({
    timestampMin: firstTime,
    timestampMax: (firstTime && lastTime) || 0,
    nftInfoId: nftInfoId,
  });
  return result?.items;
};

export default getNFTPrices;
