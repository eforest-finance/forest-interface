import BigNumber from 'bignumber.js';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { RangeType } from '../types';
import styles from './RangeSelect.module.css';
import { AMOUNT_LENGTH } from 'constants/common';
import Input from 'baseComponents/Input';

export interface RangeInputProps {
  defaultValue?: RangeType[];
  onValueChange?: (min?: number | string, max?: number | string) => void;
}

export default function RangeInput({ defaultValue, onValueChange }: RangeInputProps) {
  const [min, setMin] = useState<number | string>('');
  const [max, setMax] = useState<number | string>('');

  useEffect(() => {
    setMin(defaultValue?.[0]?.min ?? '');
    setMax(defaultValue?.[0]?.max ?? '');
  }, [defaultValue]);

  const formatNumber = (v: ChangeEvent) => {
    const { value } = v.target as HTMLInputElement;

    const pivot = new BigNumber(value);

    if ((pivot.e || 0) > AMOUNT_LENGTH - 1) return value.slice(0, AMOUNT_LENGTH);
    const [, dec] = value.split('.');
    const decimals = 2;
    if (pivot.gte(0)) {
      return (dec?.length || 0) >= +decimals ? pivot.toFixed(+decimals, BigNumber.ROUND_DOWN) : value;
    } else {
      return '';
    }
  };
  const minHandler = useCallback((v: ChangeEvent) => {
    const val = formatNumber(v);
    if (!val) return setMin('');
    // if (!max) return setMin(val);
    // if (val <= max) return setMin(val);
    setMin(val);
  }, []);

  const maxHandler = useCallback((v: ChangeEvent) => {
    const val = formatNumber(v);
    if (!val) return setMax('');
    // if (!min) return setMax(val);
    // if (val >= min) return setMax(val);
    setMax(val);
  }, []);
  useEffect(() => {
    onValueChange?.(min, max);
  }, [min, max, onValueChange]);

  return (
    <div className={`${styles['range-wrapper']} flex justify-between items-center`}>
      <Input placeholder="Min" value={min} type="number" onChange={minHandler} />
      <span className="text">TO</span>
      <Input placeholder="Max" value={max} type="number" onChange={maxHandler} />
    </div>
  );
}
