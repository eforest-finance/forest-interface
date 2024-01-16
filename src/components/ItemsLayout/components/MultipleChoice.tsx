import { Checkbox } from 'antd';
import { useCallback, useMemo } from 'react';
import { FilterType, ItemsSelectSourceType, MultipleItemType, SourceItemType } from '../types';
import styles from './MultipleChoice.module.css';
export interface MultipleChoiceProps {
  dataSource?: MultipleItemType;
  defaultValue?: SourceItemType[];
  onChange?: (val: ItemsSelectSourceType) => void;
}
export default function MultipleChoice({ dataSource, defaultValue, onChange }: MultipleChoiceProps) {
  const MultipleChoiceHandler = useCallback(
    (v: Array<string | number | boolean>) => {
      if (!dataSource) return;
      const data = dataSource?.data.filter((item) => {
        return v.some((s) => s === item.value);
      });
      onChange?.({
        [dataSource.key]: {
          type: FilterType.Multiple,
          data,
        },
      });
    },
    [dataSource, onChange],
  );
  const getVal = useMemo(() => {
    return defaultValue?.map((item) => item.value);
  }, [defaultValue]);
  return (
    <Checkbox.Group
      className={`${styles['multiple-choice-wrapper']} p-[24px]`}
      value={getVal}
      options={dataSource?.data}
      onChange={MultipleChoiceHandler}
    />
  );
}
