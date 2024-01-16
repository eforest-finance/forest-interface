import BigNumber from 'bignumber.js';

export const USER_ADDRESS_REG = /^[,a-zA-Z0-9]+$/;
const P_N_REG = /^[0-9]+.?[0-9]*$/;

export function isValidNumber(n: string) {
  if (n.includes('-')) return false;
  return P_N_REG.test(n);
}

export function parseInputChange(value: string, min: BigNumber, maxLength = 8) {
  if (!isValidNumber(value)) return '';
  const pivot = new BigNumber(value);
  if (pivot.gte(0)) {
    if (min.gt(pivot)) return min.toFixed();
    const [, dec] = value.split('.');
    return (dec?.length || 0) >= maxLength ? pivot.toFixed(maxLength, 1) : value;
  }
  return value;
}
