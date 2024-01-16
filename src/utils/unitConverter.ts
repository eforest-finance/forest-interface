import BigNumber from 'bignumber.js';

const KUnit = 1000;
const MUnit = KUnit * 1000;
const BUnit = MUnit * 1000;
const TUnit = BUnit * 1000;

export const fixedDecimals = (count?: number | BigNumber | string, num = 4) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.dp(num, BigNumber.ROUND_DOWN).toFixed();
};

function enConverter(num: BigNumber, decimal = 3) {
  const abs = num.abs();
  if (abs.gt(TUnit)) {
    return fixedDecimals(num.div(TUnit), decimal) + 'T';
  } else if (abs.gte(BUnit)) {
    return fixedDecimals(num.div(BUnit), decimal) + 'B';
  } else if (abs.gte(MUnit)) {
    return fixedDecimals(num.div(MUnit), decimal) + 'M';
  } else if (abs.gte(KUnit)) {
    return fixedDecimals(num.div(KUnit), decimal) + 'K';
  }
}
export const unitConverter = (num?: number | BigNumber | string, decimal = 5) => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num || '');
  if (bigNum.isNaN() || bigNum.eq(0)) return '0';
  const conversionNum = enConverter(bigNum, decimal);
  if (conversionNum) return conversionNum;
  return fixedDecimals(bigNum, decimal);
};

export const unitFormatter = (num: number | BigNumber | string, decimal = 1) => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num);
  if (bigNum.isNaN() || num === -1) return '-';
  if (bigNum.eq(0)) return '0';
  const abs = bigNum.abs();
  if (abs.gt(KUnit)) {
    return (
      Number(fixedDecimals(bigNum.div(KUnit), decimal)).toLocaleString(undefined, { maximumFractionDigits: 8 }) + 'K'
    );
  } else {
    return bigNum.toNumber();
  }
};

export const thousandsNumber = (number?: string | number): string => {
  const num = Number(number);
  if (number === '' || Number.isNaN(num)) return '-';
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
};
