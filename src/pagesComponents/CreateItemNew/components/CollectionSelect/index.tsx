import type { SelectProps } from 'antd/es/select';
import { Select, Option } from 'baseComponents/Select';
import { CollectionOptionItem, OptionItemForCreate, OptionItemForChoose } from './CollectionOptionItem';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';
import { store } from 'store/store';
import { setCollection } from 'store/reducer/create/item';

interface ICollectionSelectProps extends SelectProps {
  options: any[];
  id?: string;
  disabledOnMainChain?: boolean;
}

export function CollectionSelect({
  id,
  options,
  defaultValue,
  value,
  onChange,
  disabledOnMainChain,
}: ICollectionSelectProps) {
  const router = useRouter();
  const onChangeHandler = (collectionId: string, _option: any) => {
    const collection = options.find((itm) => itm.id === collectionId);
    console.log('---store.dispatch set collection');
    store.dispatch(setCollection(collection));
    onChange?.(collectionId, _option);
  };
  return (
    <Select
      id={id}
      className={styles['collection-select']}
      popupClassName={styles['collection-select-popup']}
      placeholder="select a holder"
      defaultValue={defaultValue || ''}
      value={value || ''}
      onChange={onChangeHandler}>
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
          <Option key={option.id} value={option.id} disabled={disabledOnMainChain && option.isMainChainCreateNFT}>
            <CollectionOptionItem detail={option} />
          </Option>
        );
      })}
    </Select>
  );
}
