import type { SelectProps } from 'antd/es/select';
import { Select, Option } from 'baseComponents/Select';
import { CollectionOptionItem, OptionItemForCreate, OptionItemForChoose } from './CollectionOptionItem';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';
import { useState } from 'react';

interface ICollectionSelectProps extends SelectProps {
  options: any[];
}

export function CollectionSelect({ options }: ICollectionSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState('');
  return (
    <Select
      className={styles['collection-select']}
      popupClassName={styles['collection-select-popup']}
      placeholder="select a holder"
      defaultValue={value}
      onChange={setValue}>
      <Option key="create" value="">
        <OptionItemForChoose />
      </Option>
      <Option key="create">
        <OptionItemForCreate
          onClickHandler={() => {
            console.log('click');
            router.push('/create-collection');
          }}
        />
      </Option>
      {options.map((option, index) => {
        return (
          <Option key={index} value={option.symbol}>
            <CollectionOptionItem detail={option} />
          </Option>
        );
      })}
    </Select>
  );
}
