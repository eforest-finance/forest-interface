import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import RangeInput from './RangeInput';
import ELFICon from 'assets/images/explore/aelf.svg';
import BigNumber from 'bignumber.js';
const ZERO = new BigNumber(0);
import styles from './RangeSelect.module.css';
import { FilterType, ItemsSelectSourceType, RangeItemType, RangeType } from '../../type';
import clsx from 'clsx';
import Button from 'baseComponents/Button';

export interface RangeSelectProps {
  dataSource?: RangeItemType;
  maxCount?: number;
  decimals?: number;
  AMOUNT_LENGTH?: number;
  defaultValue?: RangeType[];
  onChange?: (val: ItemsSelectSourceType) => void;
}

function RangeSelect({ dataSource, maxCount, AMOUNT_LENGTH, decimals, defaultValue, onChange }: RangeSelectProps) {
  const customDecimals = decimals === 0 || decimals ? decimals : 4;
  const [range, setRange] = useState<RangeType>({ ...defaultValue?.[0] } as RangeType);
  const [applyDis, setApplyDis] = useState<boolean>(true);
  const [clearDis, setClearDis] = useState<boolean>(true);
  const [isApply, setIsApply] = useState<boolean>(false);
  const [minStatus, setMinStatus] = useState<'warning' | 'error' | ''>('');
  const [maxStatus, setMaxStatus] = useState<'warning' | 'error' | ''>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const rangeInputChange = useCallback(
    (min: number | string, max: number | string) => {
      setApplyDis(true);
      if (!min) {
        setMinStatus('');
      }
      if (!max) {
        setMaxStatus('');
      }
      if (!min && !max) {
        setErrorMessage('');
        return;
      }
      setClearDis(false);
      setRange({ min: String(min), max: String(max) });
      const minNumber = new BigNumber(min);
      const maxNumber = new BigNumber(max);
      if ((min && !minNumber.s) || (max && !maxNumber.s)) {
        // not number
        if (min && !minNumber.s) {
          setMinStatus('error');
        }
        if (max && !maxNumber.s) {
          setMaxStatus('error');
        }
        setErrorMessage('Numeric inputs only');
        return;
      }
      if (new BigNumber(minNumber).gt(maxNumber) || new BigNumber(maxNumber).lt(minNumber)) {
        if (new BigNumber(minNumber).gt(maxNumber)) {
          setMinStatus('error');
        }
        if (new BigNumber(maxNumber).lt(minNumber)) {
          setMaxStatus('error');
        }
        setErrorMessage(`Min shouldn't be greater than max`);
        return;
      }
      // if (new BigNumber(min).eq(ZERO) && new BigNumber(max).eq(ZERO)) return;
      if (maxCount && (new BigNumber(min).gt(30) || new BigNumber(max).gt(30))) {
        if (new BigNumber(min).gt(30)) {
          setMinStatus('error');
        }
        if (new BigNumber(max).gt(30)) {
          setMaxStatus('error');
        }
        setErrorMessage(`The Symbol Length must be no more than ${maxCount}`);
        return;
      }
      setMinStatus('');
      setMaxStatus('');
      setErrorMessage('');
      setApplyDis(false);
    },
    [maxCount],
  );

  useEffect(() => {
    setRange({ ...(defaultValue?.[0] as RangeType) });
  }, [defaultValue]);

  const applyClick = useCallback(() => {
    if (!range || !dataSource) return;
    const source: ItemsSelectSourceType = {
      [dataSource.key]: {
        type: FilterType.Range,
        data: [range],
      },
    };
    setApplyDis(true);
    setIsApply(true);
    onChange?.(source);
  }, [dataSource, onChange, range]);
  const defaultInputValue = useMemo(() => {
    return [range];
  }, [range]);
  const clearClick = useCallback(() => {
    if (!dataSource) return;
    if (JSON.stringify(defaultValue) === JSON.stringify([{ min: '', max: '' }])) {
      setApplyDis(true);
    } else {
      setApplyDis(false);
    }
    setClearDis(true);
    setRange({ min: '', max: '' });
    if (isApply) {
      const source: ItemsSelectSourceType = {
        [dataSource.key]: {
          type: FilterType.Range,
          data: [{ min: '', max: '' }],
        },
      };
      onChange?.(source);
      setIsApply(false);
    }
  }, [dataSource, defaultValue, isApply, onChange]);

  return (
    <div className={styles['range-select']}>
      <div className="mb-[16px] flex">
        <RangeInput
          prefixIcon={
            dataSource?.key.toLowerCase() === 'price' && (
              <div className={styles['pricing']}>
                <ELFICon className="mr-[8px]" />
                <span className={styles.pricing__text}>ELF</span>
              </div>
            )
          }
          minStatus={minStatus}
          maxStatus={maxStatus}
          AMOUNT_LENGTH={AMOUNT_LENGTH}
          errorMessage={errorMessage}
          maxCount={maxCount}
          decimals={customDecimals}
          defaultValue={defaultInputValue}
          onValueChange={rangeInputChange}
        />
      </div>
      <div className={styles['range-button']}>
        <Button
          size="large"
          className={clsx(styles['range-select-apply'], styles['range-default-button'])}
          onClick={clearClick}>
          Clear
        </Button>
        <Button
          size="large"
          className={clsx(styles['range-select-apply'], styles['range-primary-button'])}
          disabled={applyDis}
          type="primary"
          onClick={applyClick}>
          Apply
        </Button>
      </div>
    </div>
  );
}

export default memo(RangeSelect);
