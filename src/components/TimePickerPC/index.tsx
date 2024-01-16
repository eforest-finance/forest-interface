import { DatePicker } from 'antd';
import Arrow from 'assets/images/icon/arrow.svg';
import moment from 'moment';

import styles from './style.module.css';

export default function TimePickerPC(options: {
  onSelect?: (value: moment.Moment) => void;
  value?: moment.Moment;
  popupClassName?: string;
  defaultTime: moment.Moment;
}) {
  const { onSelect, value, popupClassName, defaultTime } = options;
  return (
    <DatePicker
      picker="time"
      defaultValue={defaultTime}
      value={value}
      popupClassName={`${styles['time-picker-wrap']} ${popupClassName}`}
      inputReadOnly
      onSelect={onSelect}
      allowClear={false}
      format={'HH:mm a'}
      className={`${styles['time-picker']} hover-color`}
      showNow={false}
      suffixIcon={<Arrow />}
    />
  );
}
