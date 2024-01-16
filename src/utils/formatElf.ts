import BigNumber from 'bignumber.js';
import { isNumber } from 'lodash-es';

const formatAmount = (amount: number) => {
  if (!amount && !isNumber(amount)) {
    return 0;
  }
  const formatSeedPrice = new BigNumber(amount).div(10 ** 8).toNumber();
  return formatSeedPrice;
};

const plusAmountByBigNumber = (...rest: number[]) => {
  return rest.reduce((acc, ele) => {
    return new BigNumber(ele).plus(acc).toNumber();
  }, 0);
};

const fix4NotInt = (num?: number) => {
  if (!num && !isNumber(num)) {
    return '-';
  }
  return Math.round(num * 10000) / 10000;
};

export { formatAmount, plusAmountByBigNumber, fix4NotInt };
