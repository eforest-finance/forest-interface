import BigNumber from 'bignumber.js';
import { AMOUNT_LENGTH } from 'constants/common';

const formatInputNumber = (value: string) => {
  let deFormateValue = String(value || '').replaceAll(',', '');
  const indexOfDot = deFormateValue.indexOf('.');
  const lastIndexOfDot = deFormateValue.lastIndexOf('.');
  if (indexOfDot > -1 && indexOfDot !== lastIndexOfDot) {
    deFormateValue = deFormateValue.slice(0, -1);
  }
  const pivot = new BigNumber(deFormateValue);
  if ((pivot.e || 0) > AMOUNT_LENGTH - 1) return deFormateValue.slice(0, AMOUNT_LENGTH);
  const [, dec] = deFormateValue.split('.');
  const decimals = 4;
  if (pivot.gt(0)) {
    return (dec?.length || 0) >= +decimals ? pivot.toFixed(+decimals, BigNumber.ROUND_DOWN) : deFormateValue;
  } else {
    return '';
  }
};

export { formatInputNumber };
