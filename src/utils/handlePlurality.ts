import { formatTokenPrice } from './format';

export const handlePlurality = (num: number, noun: string) => {
  if (typeof num !== 'number') return num;
  switch (noun) {
    case 'day':
      if (num > 1) {
        return `${formatTokenPrice(num)} days`;
      }
      return `${formatTokenPrice(num)} day`;
    default:
      if (num > 1) {
        if (noun.endsWith('s') || noun.endsWith('x') || noun.endsWith('ch') || noun.endsWith('sh')) {
          return `${formatTokenPrice(num)} ${noun}es`;
        } else if (noun.endsWith('y')) {
          return `${formatTokenPrice(num)} ${noun.slice(0, -1)}ies`;
        } else {
          return `${formatTokenPrice(num)} ${noun}s`;
        }
      } else {
        return `${formatTokenPrice(num)} ${noun}`;
      }
  }
};
