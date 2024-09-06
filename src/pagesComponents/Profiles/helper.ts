import BigNumber from 'bignumber.js';
import { CollectionsStatus } from 'pagesComponents/ExploreItem/constant';

const bigStr = (str: string) => {
  return str === '' ? undefined : new BigNumber(str).toNumber();
};

export function getParamsFromFilter(activeKey: string, walletAddress: string, filterSelect: IFilterSelect) {
  const status = filterSelect.Status.data.map((item: SourceItemType) => item.value);

  const filterParams = {
    ChainList: filterSelect.Chain.data.map((item: SourceItemType) => item.value as 'AELF' | 'tDVV'),

    PriceLow: bigStr(filterSelect?.Price?.data?.[0]?.min),
    PriceHigh: bigStr(filterSelect?.Price?.data?.[0]?.max),
    HasListingFlag: status.includes(CollectionsStatus['Buy Now']),
    HasAuctionFlag: status.includes(CollectionsStatus['On Auction']),
    HasOfferFlag: status.includes(CollectionsStatus['Has Offers']),
    collectionIds: filterSelect.Collections.data.map((itm: SourceItemType) => itm.value),
  };
  if (activeKey === 'created') {
    return {
      ...filterParams,
      address: walletAddress || '',
      Sorting: 'Low to High',
    };
  }
  return {
    ...filterParams,
    address: walletAddress || '',
    Sorting: 'Low to High',
  };
}
