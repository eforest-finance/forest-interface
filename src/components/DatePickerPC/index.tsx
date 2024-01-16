import { DatePicker } from 'antd';
import Arrow from 'assets/images/arrow.svg';
import moment, { Moment } from 'moment';

import styles from './style.module.css';
import { MILLISECONDS_PER_HALF_HOUR } from 'constants/time';
import { useMemo } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';

export default function DatePickerPC(options: {
  value?: moment.Moment;
  onSelect: (value: Moment) => void;
  popupClassName?: string;
  className?: string;
  defaultValue: moment.Moment;
  disabledDate?: RangePickerProps['disabledDate'];
  disabledTime?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { value, onSelect, popupClassName, className, defaultValue, disabledDate, disabledTime, ...extendProps } =
    options;

  const currentDefaultValue = useMemo(() => {
    return moment(defaultValue.valueOf() + MILLISECONDS_PER_HALF_HOUR);
  }, [defaultValue]);

  return (
    <DatePicker
      defaultValue={currentDefaultValue}
      showNow={false}
      value={value}
      format={'YYYY/MM/DD hh:mm a'}
      onSelect={onSelect}
      allowClear={false}
      popupClassName={`${styles['date-picker-wrap']} ${popupClassName}`}
      inputReadOnly
      className={`w-full hover-color rounded-[12px] ${styles['date-picker']} ${className}`}
      suffixIcon={<Arrow />}
      showTime
      disabledDate={disabledDate}
      disabledTime={disabledTime}
      {...extendProps}
    />
  );
}
