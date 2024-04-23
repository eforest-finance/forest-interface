import CollectionSearch from 'pagesComponents/Collections/components/CollectionSearch';
import styles from './styles.module.css';
import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import clsx from 'clsx';
import BaseSelect from '../BaseSelect';
import { dropDownActivitiesMenu } from 'components/ItemsLayout/assets';
import useResponsive from 'hooks/useResponsive';
import { SelectProps } from 'baseComponents/Select';
import { InputProps } from 'baseComponents/Input/Input';
import Dropdown from 'baseComponents/Dropdown';
import { DownOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { MenuProps, Checkbox } from 'antd';

export enum BoxSizeEnum {
  large,
  small,
  details,
}
interface IAcitvityItemsSearch {
  collapsed: boolean;
  searchParams: InputProps;
  collapsedChange: () => void;
  selectProps: SelectProps;
  nftType: string;
}

export default function AcitvityItemsSearch(params: IAcitvityItemsSearch) {
  const { isLG } = useResponsive();
  const { collapsed, searchParams, selectProps, collapsedChange, nftType } = params;
  const [visible, setVisible] = useState<boolean>(false);

  const menuForShow =
    nftType === 'nft'
      ? {
          ...dropDownActivitiesMenu,
          data: dropDownActivitiesMenu.data.slice(0, 8),
        }
      : dropDownActivitiesMenu;

  const onSelectChange = (isChecked: boolean, value: number | string) => {
    if (isChecked && !selectProps.value.includes(value)) {
      const res = [...selectProps.value, value];
      selectProps?.onChange?.(res);
    }
    if (!isChecked && selectProps.value.includes(value)) {
      const pre = selectProps.value;
      const index = pre.findIndex((itm) => itm === value);
      const res = pre.slice(0, index).concat(pre.slice(index + 1));
      selectProps?.onChange?.(res);
    }
  };

  const dropdownMenu = {
    items: menuForShow.data.map((item) => {
      return {
        label: (
          <Checkbox
            key={item.value}
            className={styles['detail-activity-checkbox']}
            checked={selectProps.value.includes(item.value)}
            onChange={(e) => {
              onSelectChange(e.target.checked, item.value);
            }}>
            {item.label}
          </Checkbox>
        ),
        key: item,
      };
    }),
  };
  return (
    <>
      <div className={styles.collection__search}>
        <div className={clsx('flex', collapsed && !isLG ? 'w-[360px] mr-[32px]' : 0)}>
          <div className={clsx(styles.collapsed__button)} onClick={collapsedChange}>
            <CollapsedIcon className={styles.collapsed__icon} />
            <span className={styles.collapsed__text}>Filters</span>
          </div>
        </div>
        <div className={clsx('flex-1', !isLG && 'mr-[32px]')}>
          <CollectionSearch {...searchParams} />
        </div>
        {!isLG && (
          <Dropdown
            trigger={['click']}
            open={visible}
            onOpenChange={(open) => setVisible(open)}
            overlayClassName={styles['detail-activity-dropdown']}
            menu={dropdownMenu as unknown as MenuProps}>
            <div
              className={styles['filter']}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setVisible(true);
              }}>
              <p className="text-textPrimary">Filter</p>
              <DownOutlined />
            </div>
          </Dropdown>
        )}
      </div>
      {isLG && (
        <div className="mt-[16px] !w-full mb-[16px] relative">
          <Dropdown
            trigger={['click']}
            open={visible}
            getPopupContainer={(v) => v}
            onOpenChange={(open) => setVisible(open)}
            overlayClassName={styles['detail-activity-dropdown']}
            menu={dropdownMenu as unknown as MenuProps}>
            <div className={clsx(styles['filter'], '!w-full')}>
              <p className="text-textPrimary">Filter</p>
              <DownOutlined />
            </div>
          </Dropdown>
        </div>
      )}
    </>
  );
}
