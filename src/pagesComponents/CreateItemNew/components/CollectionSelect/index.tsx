import type { SelectProps } from 'antd/es/select';
import { Select, Option } from 'baseComponents/Select';
import { CollectionOptionItem, OptionItemForCreate, OptionItemForChoose } from './CollectionOptionItem';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

interface ICollectionSelectProps extends SelectProps {
  options: any[];
  id?: string;
}

export function CollectionSelect({ id, options, defaultValue, value, onChange }: ICollectionSelectProps) {
  const router = useRouter();
  return (
    <Select
      id={id}
      className={styles['collection-select']}
      popupClassName={styles['collection-select-popup']}
      placeholder="select a holder"
      defaultValue={defaultValue || ''}
      value={value || ''}
      onChange={onChange}>
      <Option key="choose" value="">
        <OptionItemForChoose />
      </Option>
      <Option key="create" value="create">
        <OptionItemForCreate
          onClickHandler={() => {
            router.push('/create-collection');
          }}
        />
      </Option>
      {options.map((option) => {
        return (
          <Option key={option.id} value={option.id}>
            <CollectionOptionItem detail={option} />
          </Option>
        );
      })}
    </Select>
  );
}
