import { Menu } from 'antd';
import { useSelector, dispatch } from 'store/store';
import { setFilterSelect } from 'store/reducer/layoutInfo';
import React, { useCallback, useMemo, useState } from 'react';
import { useHash } from 'react-use';
import { MultipleChoice, SingleChoice, RangeSelect } from '../components';
import { FilterItemType, FilterType, ItemsSelectSourceType, RangeType, SourceItemType } from '../types';
import styles from './ItemsSideMenu.module.css';
import { SingleChoiceProps } from '../components/SingleChoice';
import { MultipleChoiceProps } from '../components/MultipleChoice';
import { RangeSelectProps } from 'pagesComponents/ExploreItems/components/RangeSelect';
import Arrow from 'assets/images/icon/arrow.svg';

interface ICompProps {
  dataSource: FilterItemType;
  defaultValue: SourceItemType[] | RangeType[] | undefined;
  onChange: (val: ItemsSelectSourceType) => void;
}

export default function ItemsSideMenu() {
  const { filterList, filterSelect } = useSelector((store) => store.layoutInfo);
  const [hash] = useHash();
  const onChange = useCallback(
    (val: ItemsSelectSourceType) => {
      console.log('onChange', val);
      dispatch(setFilterSelect({ ...filterSelect, ...val }));
    },
    [filterSelect],
  );

  const defaultOpenKeys = useMemo(
    () =>
      filterList?.map((item) => {
        return item.key;
      }),
    [filterList],
  );

  const filterBadgesList = (filterList || []).filter((item) =>
    hash === '#Badge' ? item.show === '#Badge' : item.show !== '#Badge',
  );

  const getItemsByType = (type: FilterType): React.FC<ICompProps> => {
    const map: {
      [FilterType.Single]: React.FC<SingleChoiceProps>;
      [FilterType.Multiple]: React.FC<MultipleChoiceProps>;
      [FilterType.Range]: React.FC<RangeSelectProps>;
    } = {
      [FilterType.Single]: SingleChoice,
      [FilterType.Multiple]: MultipleChoice,
      [FilterType.Range]: RangeSelect,
    };
    return map[type] as unknown as React.FC<ICompProps>;
  };

  const items = filterBadgesList.map((item) => {
    const defaultValue = filterSelect?.[item.key]?.data;
    const Comp: React.FC<ICompProps> = getItemsByType(item.type);
    return {
      label: item.title,
      key: item.key,
      children: item
        ? [
            {
              key: item.key + item.type,
              label: <Comp dataSource={item} defaultValue={defaultValue} onChange={onChange} />,
            },
          ]
        : null,
    };
  });

  return (
    <>
      {filterList && (
        <Menu
          selectable={false}
          theme={'light'}
          items={items}
          defaultOpenKeys={defaultOpenKeys}
          className={`${styles['items-side-menu']}`}
          mode="inline"
          expandIcon={({ isOpen }) => {
            return (
              <div className="duration-300">
                <Arrow className={`duration-300 relative flex items-center  ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
              </div>
            );
          }}
        />
      )}
    </>
  );
}
