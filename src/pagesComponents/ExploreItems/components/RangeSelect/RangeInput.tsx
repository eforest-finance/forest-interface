import BigNumber from 'bignumber.js';
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import styles from './RangeSelect.module.css';
import { RangeType } from '../../type';
import clsx from 'clsx';
import Input from 'baseComponents/Input';
export interface RangeInputProps {
  defaultValue?: RangeType[];
  prefixIcon?: ReactNode;
  decimals: number;
  errorMessage?: string;
  minStatus?: 'warning' | 'error' | '';
  maxStatus?: 'warning' | 'error' | '';
  maxCount?: number;
  AMOUNT_LENGTH?: number;
  onValueChange?: (min: number | string, max: number | string) => void;
}

export default function RangeInput(props: RangeInputProps) {
  const {
    defaultValue,
    errorMessage,
    AMOUNT_LENGTH = 11,
    minStatus,
    maxStatus,
    decimals,
    prefixIcon,
    onValueChange,
  } = props;
  const [min, setMin] = useState<number | string>('');
  const [max, setMax] = useState<number | string>('');

  useEffect(() => {
    setMin(defaultValue?.[0]?.min ?? '');
    setMax(defaultValue?.[0]?.max ?? '');
  }, [defaultValue]);

  const formatNumber = (v: ChangeEvent) => {
    let { value } = v.target as HTMLInputElement;
    if (value.startsWith('-') || value.startsWith('.')) {
      return '';
    }
    value = value.replace(/^0*(\d+(\.\d*)?)$/, '$1');
    const pivot = new BigNumber(value);
    if (pivot.e !== -1 && value.startsWith('0') && !value.startsWith('0.') && value !== '0') {
      return '0';
    }
    if (pivot.s) {
      const [val, dec] = value.split('.');
      if ((pivot.e || 0) > AMOUNT_LENGTH - 1) return value.slice(0, AMOUNT_LENGTH);
      if (decimals === 0) return val;
      if (dec?.length >= decimals) return pivot.toFixed(+decimals, BigNumber.ROUND_DOWN);
    } else {
      if (!value.startsWith('.') && value.includes('.')) {
        const val = value.split('.')[0] + '.';
        return val.slice(0, AMOUNT_LENGTH);
      } else {
        return value.slice(0, AMOUNT_LENGTH);
      }
    }
    return value;
  };
  const minHandler = useCallback((v: ChangeEvent) => {
    const val = formatNumber(v);
    setMin(val);
  }, []);

  const maxHandler = useCallback((v: ChangeEvent) => {
    const val = formatNumber(v);
    setMax(val);
  }, []);
  useEffect(() => {
    onValueChange?.(min, max);
  }, [min, max, onValueChange]);
  return (
    <div className="w-full">
      <div className={`${styles['range-wrapper']} flex justify-between items-center`}>
        {prefixIcon}
        <Input
          className={clsx(styles['range-input'])}
          placeholder="Min"
          value={min}
          status={minStatus}
          onChange={minHandler}
        />
        <span className="text-[var(--color-primary)] text-[16px] leading-[24px] font-medium mx-[8px]">to</span>
        <Input
          className={clsx(styles['range-input'])}
          placeholder="Max"
          value={max}
          status={maxStatus}
          onChange={maxHandler}
        />
      </div>
      {(minStatus || maxStatus) && (
        <div className="text-[var(--message-error)] text-[16px] font-medium leading-[16px] pt-[4px]">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
