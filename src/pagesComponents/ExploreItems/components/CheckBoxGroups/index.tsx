import { Checkbox, Col, Row } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxItemType, FilterType, ItemsSelectSourceType, SourceItemType } from '../../type';
import { memo, useCallback, useMemo } from 'react';
import styles from './style.module.css';

export interface CheckboxChoiceProps {
  dataSource?: CheckboxItemType;
  defaultValue?: SourceItemType[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
}

function CheckBoxGroups({ dataSource, defaultValue, onChange }: CheckboxChoiceProps) {
  const valueChange = useCallback(
    (value: CheckboxValueType[]) => {
      if (!dataSource) return;
      const data = dataSource?.data.filter((item) => {
        return value.some((s) => s === item.value);
      });
      onChange?.({
        [dataSource.key]: {
          type: FilterType.Checkbox,
          data,
        },
      });
    },
    [dataSource, onChange],
  );
  const checkboxItem = useMemo(() => {
    const data = dataSource?.data || [];
    return data.map((item: SourceItemType) => {
      return (
        <Col className="px-[8px] py-[17px]" key={item.value} span={24}>
          <Checkbox value={item.value} disabled={item.disabled}>
            {item.label}
          </Checkbox>
        </Col>
      );
    });
  }, [dataSource]);
  const getVal = useMemo(() => {
    return defaultValue?.map((item) => item.value);
  }, [defaultValue]);
  return (
    <>
      <Checkbox.Group value={getVal} className={styles.checkbox} onChange={valueChange}>
        <Row>{checkboxItem}</Row>
      </Checkbox.Group>
    </>
  );
}

export default memo(CheckBoxGroups);
