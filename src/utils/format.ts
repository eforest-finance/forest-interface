import BigNumber from 'bignumber.js';
import { MINUTES_PER_HOUR, MONTH_DAYS, SECOND_PER_MINUTES, TIME_FORMAT_24_HOUR, YEAR_MONTHS } from 'constants/time';
import moment from 'moment';

export function formatTime({
  minDigits = 2,
  showSecond = true,
  hours,
  minutes,
  seconds,
}: {
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
  showSecond?: boolean;
  minDigits?: number;
}) {
  if (minDigits === 1) {
    return `${hours}:${minutes}${showSecond ? `:${seconds}` : ''}`;
  } else {
    return `${timeFillDigits(hours)}:${timeFillDigits(minutes)}${showSecond ? `:${timeFillDigits(seconds)}` : ''}`;
  }
}

export function timeFillDigits(n: number | string) {
  return `${String(n).length < 2 ? `0${n}` : n}`;
}

export function formatTokenPrice(
  price: number | BigNumber | string,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;

  if (!priceBig.isEqualTo(0) && priceBig.lt(0.0001)) {
    return '< 0.0001';
  }

  const priceFixed = priceBig.toFixed(decimalPlaces, roundingMode);
  const res = new BigNumber(priceFixed).toFormat();
  return res;
}

export function formatUSDPrice(
  price: number | BigNumber | string,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 4, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const priceBig: BigNumber = BigNumber.isBigNumber(price) ? price : new BigNumber(price);
  if (priceBig.isNaN()) return `${price}`;
  const priceFixed = priceBig.toFixed(decimalPlaces, roundingMode);
  const priceFixedBig = new BigNumber(priceFixed);

  if (priceBig.comparedTo(0) === 0) {
    return '$ 0';
  }

  if (priceFixedBig.comparedTo(0.0001) === -1) {
    return '<$ 0.0001';
  }

  return `$ ${priceFixedBig.toFormat()}`;
}

const KUnit = 1000;
const MUnit = KUnit * 1000;
const BUnit = MUnit * 1000;
const TUnit = BUnit * 1000;

export function formatNumber(
  number: number | string | BigNumber,
  toFixedProps?: {
    decimalPlaces?: number;
    roundingMode?: BigNumber.RoundingMode;
  },
) {
  const { decimalPlaces = 2, roundingMode = BigNumber.ROUND_DOWN } = toFixedProps || {};
  const numberBig: BigNumber = BigNumber.isBigNumber(number) ? number : new BigNumber(number);
  if (numberBig.isNaN() || numberBig.eq(0)) return '0';

  const regexp = /(?:\.0*|(\.\d+?)0+)$/;

  const abs = numberBig.abs();
  if (abs.gt(TUnit)) {
    return numberBig.div(TUnit).toFixed(decimalPlaces, roundingMode).replace(regexp, '$1') + 'T';
  } else if (abs.gte(BUnit)) {
    return numberBig.div(BUnit).toFixed(decimalPlaces, roundingMode).replace(regexp, '$1') + 'B';
  } else if (abs.gte(MUnit)) {
    return numberBig.div(MUnit).toFixed(decimalPlaces, roundingMode).replace(regexp, '$1') + 'M';
  } else if (abs.gte(KUnit)) {
    return numberBig.div(KUnit).toFixed(decimalPlaces, roundingMode).replace(regexp, '$1') + 'K';
  }
  return BigNumber.isBigNumber(number) ? number.toNumber() : number;
}

export function formatShowEmptyValue(value: number | string | undefined, str = '-') {
  if (value === '0' || value === 0) return value;
  if (Number(value) === -1 || !value) return str;
  return value;
}

export function formatNumberEnhance(number: number | string | BigNumber) {
  const numberBig = BigNumber.isBigNumber(number) ? number : new BigNumber(number);
  if (numberBig.isNaN()) return `${number || '-'}`;

  if (!numberBig.isEqualTo(0) && numberBig.lt(0.0001)) {
    return '< 0.0001';
  }

  if (numberBig.lte(1000)) {
    return Number(numberBig.toFixed(4, BigNumber.ROUND_DOWN));
  }

  return formatNumber(number);
}

export const getDateString = (timestamp: number) => {
  const duration = moment.duration(moment().valueOf() - timestamp);
  if (duration.asSeconds() < SECOND_PER_MINUTES) return 'a few seconds ago';
  if (duration.asMinutes() < MINUTES_PER_HOUR) return `${duration.asMinutes().toFixed(0)} minutes ago`;
  if (duration.asHours() < TIME_FORMAT_24_HOUR) return `${duration.asHours().toFixed(0)} hours ago`;
  if (duration.asDays() < MONTH_DAYS) return `${duration.asDays().toFixed(0)} days ago`;
  if (duration.asMonths() < YEAR_MONTHS) return `${duration.asMonths().toFixed(0)} months ago`;
  return `${duration.asYears().toFixed(0)} years ago`;
};
