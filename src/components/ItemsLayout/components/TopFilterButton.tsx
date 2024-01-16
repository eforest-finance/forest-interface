import { Space, Tooltip } from 'antd';
import BaseSelect from 'components/BaseSelect';
import BaseTag from 'components/BaseTag';
import { dispatch, useSelector } from 'store/store';
import { setFilterSelect, setGridType } from 'store/reducer/layoutInfo';
import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocalStorage } from 'react-use';
import storages from 'storages';
import { SORT_BY } from '../assets';
import { SingleSelectType, FilterType, MultipleSelectType, RangeSelectType, SourceItemType } from '../types';
import FilterBtn from './MFilter';
import styles from './index.module.css';
import GridLargeSize from 'assets/images/light/largeSize.svg';
import GridSmallSize from 'assets/images/light/smallSize.svg';
import USDIcon from 'assets/images/USD.svg';
import { valueType } from 'antd/lib/statistic/utils';
import { DefaultOptionType } from 'antd/lib/select';
import Button from 'baseComponents/Button';

export default function TopFilterButton({ showAdd = false }: { showAdd?: boolean }) {
  const {
    layoutInfo: { filterSelect, dropDownMenu, gridType },
  } = useSelector((store) => store);
  const [, setLayoutType] = useLocalStorage(storages.layout || 'forest-layout', 3);
  const { address: nftCollectionId } = useParams();

  console.log('nftCollectionId', nftCollectionId);
  const tagClose = useCallback(
    (key: string, v: RangeSelectType | MultipleSelectType | SingleSelectType, item?: SourceItemType) => {
      if (!filterSelect) return;
      const select = { ...filterSelect };

      if (v.type === FilterType.Range || v.type === FilterType.Single) {
        delete select[key];
        dispatch(setFilterSelect(select));
        return;
      }
      if (v.type === FilterType.Multiple) {
        if (item) {
          const index = v.data.indexOf(item);
          v.data.splice(index, 1);
        }
        dispatch(
          setFilterSelect({
            ...filterSelect,
            [key]: {
              type: FilterType.Multiple,
              data: [...v.data],
            },
          }),
        );
        return;
      }
    },
    [filterSelect],
  );

  const handleClear = () => dispatch(setFilterSelect(null));

  const isEmpty = useMemo(() => {
    if (!filterSelect) return true;
    return Object.values(filterSelect).every((v) => {
      if (v.type === FilterType.Range) {
        return v?.data?.length === 0 || (v?.data?.length === 1 && v.data[0].min === '' && v.data[0].max === '');
      } else {
        return v?.data?.length === 0;
      }
    });
  }, [filterSelect]);

  const handleChange = (_: valueType, option: DefaultOptionType | DefaultOptionType[]) => {
    console.log(option);
    const { key, children } = option as unknown as { key: string; children: string };
    dispatch(
      setFilterSelect(
        Object.assign({}, filterSelect, {
          [SORT_BY]: {
            type: FilterType.Single,
            data: [{ value: key, label: children }],
          },
        }),
      ),
    );
  };

  const display = useMemo(() => {
    if (dropDownMenu) return 'inline-flex';
    if (showAdd) return 'inline-flex';
    if (gridType) return 'inline-flex';
    if (!isEmpty) return 'inline-flex';
    return 'none';
  }, [dropDownMenu, gridType, isEmpty, showAdd]);

  return (
    <>
      <Space style={{ display: display }} className={styles['top-filter-button']} wrap size={16}>
        {dropDownMenu && (
          <BaseSelect defaultValue={filterSelect?.[SORT_BY]} dataSource={dropDownMenu} onChange={handleChange} />
        )}
        {showAdd && (
          <div className={`${styles['fun-btn-wrap']} flex justify-between items-center w-full`}>
            <FilterBtn type="default" position="top" />
            <Button type="primary" size="ultra">
              <Link
                href={{
                  pathname: '/create-item',
                  query: { collectionId: nftCollectionId },
                }}>
                Add item
              </Link>
            </Button>
          </div>
        )}

        {!!gridType && (
          <div className={styles['display-grid-wrapper']}>
            <Tooltip placement="top" title={'Large Display'}>
              <span
                onClick={() => {
                  dispatch(setGridType(3));
                  setLayoutType(3);
                }}>
                <GridSmallSize />
              </span>
            </Tooltip>
            <Tooltip placement="top" title={'Small Display'}>
              <span
                onClick={() => {
                  dispatch(setGridType(5));
                  setLayoutType(5);
                }}>
                <GridLargeSize />
              </span>
            </Tooltip>
          </div>
        )}

        {!!filterSelect &&
          Object.entries(filterSelect).map(([key, value]) => {
            if (key === SORT_BY) return null;
            const { type } = value;

            if (type === FilterType.Single) {
              return (
                <BaseTag
                  key={key}
                  tagClose={() => {
                    tagClose(key, value);
                  }}>
                  {value?.data?.[0]?.label}
                </BaseTag>
              );
            } else if (type === FilterType.Range) {
              if (value.data[0]?.min === '' && value.data[0]?.max === '') return null;
              const { min, max } = value.data[0];
              const label = min && max ? `${min}-${max}` : (min === '0' || min) && !max ? `≥${min}` : `≤${max}`;
              return (
                <BaseTag
                  key={key}
                  tagClose={() => {
                    tagClose(key, value);
                  }}>
                  <span className={`${styles['filter-button-range']} flex justify-between items-center`}>
                    {label} ELF
                  </span>
                </BaseTag>
              );
            } else if (type === FilterType.Multiple) {
              return value.data.map((item) => (
                <BaseTag
                  key={`${key}/${item.value}`}
                  tagClose={() => {
                    tagClose(key, value, item);
                  }}>
                  {item.label}
                </BaseTag>
              ));
            } else {
              return null;
            }
          })}

        {!isEmpty ? (
          <span className={styles['top-filter-clear-all']} onClick={handleClear}>
            Clear All
          </span>
        ) : null}
      </Space>
    </>
  );
}
