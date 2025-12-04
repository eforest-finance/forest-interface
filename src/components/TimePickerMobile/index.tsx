import Picker from 'antd-mobile/es/components/picker';
import { PickerValue, PickerValueExtend } from 'antd-mobile/es/components/picker-view';
import { TIME_FORMAT_12_HOUR, MINUTES_PER_HOUR } from 'constants/time';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import styles from './style.module.css';

export default function TimePickerMobile(options: {
  visible: boolean;
  onConfirm: ((value: PickerValue[], extend: PickerValueExtend) => void) | undefined;
  onCancel: () => void;
  className?: string;
}) {
  const { visible, onConfirm, onCancel, className } = options;
  const [columns, setColumns] = useState<
    {
      label: string;
      value: string;
    }[][]
  >([]);

  useEffectOnce(() => {
    setColumns([
      new Array(TIME_FORMAT_12_HOUR).fill(1).reduce((acc, _, index) => {
        acc.push({ label: index.toString(), value: index.toString() });
        return acc;
      }, []),
      new Array(MINUTES_PER_HOUR).fill(1).reduce((acc, _, index) => {
        acc.push({ label: index.toString(), value: index.toString() });
        return acc;
      }, []),
      [
        { label: 'am', value: 'am' },
        { label: 'pm', value: 'pm' },
      ],
    ]);
  });

  return (
    <Picker
      className={`${styles['time-picker-mobile']} ${className}`}
      popupClassName={styles['time-picker-popup']}
      visible={visible}
      confirmText="Done"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      columns={columns}
    />
  );
}
