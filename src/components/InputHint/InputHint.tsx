import { InputProps } from 'antd-mobile/es/components/input';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { SyncOutlined } from '@ant-design/icons';

import styles from './InputHint.module.css';
import Input from 'baseComponents/Input';

export default function InputHint({
  onChange,
  maxCount,
  defaultValue,
  loading,
  delay = 300,
  className,
}: InputProps & {
  maxCount?: number; // number string
  delay?: number;
  loading?: boolean;
  className?: string;
}) {
  const [text, setText] = useState<string | number>(defaultValue ?? '');

  useDebounce(
    () => {
      onChange?.(text ? text.toString() : '');
    },
    delay,
    [text],
  );

  const inputChange = useCallback(
    (e: any) => {
      const val = parseInt(e.target.value);
      if ((maxCount ?? 0) <= 0 || val < 0 || isNaN(val)) return setText('0');
      if (maxCount) {
        if (val > maxCount) {
          setText(maxCount);
          return;
        }
      }
      if (val) return setText(val);
      return setText('0');
    },
    [maxCount],
  );

  return (
    <div className={`flex items-center justify-center ${styles['input-hint-wrapper']} ${className}`}>
      <Input
        className={`${styles['input-wrapper']}`}
        value={text}
        onKeyDown={(e) => {
          /\d|Backspace/.test(e.key) || e.preventDefault();
        }}
        onChange={inputChange}
        type="number"
      />
      <span className="bg-transparent text-transparent text-base">{text}</span>
      <span className={`${styles['max-count-wrapper']} flex-1`}>
        /{loading ? <SyncOutlined spin /> : maxCount || 0}
      </span>
    </div>
  );
}
