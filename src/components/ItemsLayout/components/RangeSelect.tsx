import { useCallback, useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { FilterType, RangeType, ItemsSelectSourceType, RangeItemType } from '../types';
import styles from './RangeSelect.module.css';
import Button from 'baseComponents/Button';
import RangeInputNew from 'pagesComponents/ExploreItems/components/RangeSelect/RangeInput';
import ELFICon from 'assets/images/explore/aelf.svg';

export interface RangeSelectProps {
  dataSource?: RangeItemType;
  defaultValue?: RangeType[];
  onChange?: (val: ItemsSelectSourceType) => void;
}

export default function RangeSelect({ dataSource, defaultValue, onChange }: RangeSelectProps) {
  const [range, setRange] = useState<RangeType>();
  const [applyDis, setApplyDis] = useState<boolean>(true);

  const [status, setStatus] = useState<'warning' | 'error' | ''>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const rangeInputChange = useCallback((min?: number | string, max?: number | string) => {
    setApplyDis(true);
    if (!min || !max) {
      setStatus('');
      setErrorMessage('');
      return;
    }
    setRange({ min: String(min), max: String(max) });

    const minNumber = new BigNumber(min);
    const maxNumber = new BigNumber(max);
    if ((min && !minNumber.s) || (max && !maxNumber.s)) {
      // not number
      setStatus('error');
      setErrorMessage('Please enter only numbers');
      return;
    }

    if (new BigNumber(minNumber).gt(maxNumber) || new BigNumber(maxNumber).lt(minNumber)) {
      setStatus('error');
      setErrorMessage(`Min shouldn't be greater than max`);
      return;
    }

    setStatus('');
    setErrorMessage('');
    setApplyDis(false);

    // range
  }, []);

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
    onChange?.(source);
  }, [dataSource, onChange, range]);
  return (
    <div className={`${styles['range-select']} p-[24px]`}>
      <RangeInputNew
        prefixIcon={
          <div className={styles['pricing']}>
            <ELFICon className="mr-[8px]" />
            <span className={styles.pricing__text}>ELF</span>
          </div>
        }
        defaultValue={defaultValue}
        decimals={4}
        errorMessage={errorMessage}
        status={status}
        onValueChange={rangeInputChange}
      />
      <Button
        className={styles['range-select-apply']}
        isFull={true}
        size="ultra"
        disabled={applyDis}
        type="primary"
        onClick={applyClick}>
        Apply
      </Button>
    </div>
  );
}
