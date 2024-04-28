import BigNumber from 'bignumber.js';

const bigStr = (str: string) => {
  return str === '' ? undefined : new BigNumber(str).toNumber();
};

export function getParamsFromFilter(activeKey: string, walletAddress: string, filterSelect: IFilterSelect) {
  const filterParams = {
    PriceLow: bigStr(filterSelect?.Price?.data?.[0]?.min),
    PriceHigh: bigStr(filterSelect?.Price?.data?.[0]?.max),
  };
  if (activeKey === 'Created') {
    return {
      ...filterParams,
      Address: walletAddress || '',
      IssueAddress: walletAddress || '',
      Sorting: 'ListingTime DESC',
    };
  }
  return {
    ...filterParams,
    Status: 2,
    Address: walletAddress || '',
    Sorting: 'ListingTime DESC',
  };
}
