export const TIME_FORMAT_12_HOUR = 12;
export const TIME_FORMAT_24_HOUR = 24;
export const MINUTES_PER_HOUR = 60;

export const HALF_AN_HOUR = 30;
export const SECOND_PER_MINUTES = 60;
export const MILLI_PER_SECOND = 1000;
export const WEEK_DAYS = 7;

export const MILLISECONDS_PER_HALF_HOUR = HALF_AN_HOUR * SECOND_PER_MINUTES * MILLI_PER_SECOND;
export const SECOND_PER_ONE_HOUR = MINUTES_PER_HOUR * SECOND_PER_MINUTES;
export const MILLISECONDS_PER_DAY = TIME_FORMAT_24_HOUR * MINUTES_PER_HOUR * SECOND_PER_MINUTES * MILLI_PER_SECOND;
export const MILLISECONDS_IN_WEEK =
  WEEK_DAYS * TIME_FORMAT_24_HOUR * MINUTES_PER_HOUR * SECOND_PER_MINUTES * MILLI_PER_SECOND;

export const HALF_AN_MINUTES = 30;
export const MONTH_DAYS = 30;
export const YEAR_MONTHS = 12;
export const SIX_MONTHS_DURATION = 6;
