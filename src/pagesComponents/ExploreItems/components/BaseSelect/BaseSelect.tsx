import { SingleItemType } from 'components/ItemsLayout/types';
import styles from './BaseSelect.module.css';
import { Select, Option, SelectProps } from 'baseComponents/Select';
export interface BaseSelectProps {
  dataSource: SingleItemType;
}
export default function BaseSelect({ dataSource, ...params }: SelectProps & BaseSelectProps) {
  return (
    <Select className={styles['base-items-select']} getPopupContainer={(v) => v} {...params}>
      {dataSource?.data?.map((item) => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
}
