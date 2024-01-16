import { Radio, RadioChangeEvent } from 'antd';
import { useCallback } from 'react';
import { ItemsSelectSourceType, SingleItemType, SourceItemType } from '../types';
import styles from './SingleChoice.module.css';

export interface SingleChoiceProps {
  dataSource?: SingleItemType;
  defaultValue?: SourceItemType[];
  onChange?: (val: ItemsSelectSourceType) => void;
}
export default function SingleChoice({ dataSource, defaultValue, onChange }: SingleChoiceProps) {
  const SingleChoiceHandler = useCallback(
    (e: RadioChangeEvent) => {
      if (!dataSource) return;
      const item = dataSource.data.find((itm) => itm.value === e.target.value);
      if (!item) return;
      const singleItem: ItemsSelectSourceType = {
        [dataSource.key]: { type: dataSource.type, data: [{ value: item.value, label: item.label }] },
      };
      onChange?.(singleItem);
    },
    [dataSource, onChange],
  );
  return (
    <>
      <Radio.Group
        buttonStyle="solid"
        defaultValue={defaultValue?.[0]?.value}
        value={defaultValue?.[0]?.value}
        className={`${styles['single-choice-wrapper']} p-[24px]`}
        onChange={SingleChoiceHandler}>
        {dataSource?.data.map((item) => (
          <Radio.Button key={item?.value} value={item?.value}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </>
  );
}
