import CollectionSearch from 'pagesComponents/Collections/components/CollectionSearch';
import styles from './styles.module.css';
import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import clsx from 'clsx';
import { dropDownActivitiesMenu } from 'components/ItemsLayout/assets';
import useResponsive from 'hooks/useResponsive';
import { SelectProps } from 'baseComponents/Select';
import { InputProps } from 'baseComponents/Input/Input';
import Dropdown from 'baseComponents/Dropdown';
import { useState } from 'react';
import { MenuProps, Checkbox } from 'antd';
import Arrow from 'assets/images/icon/arrow.svg';

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
  selectTagCount?: number;
  extraInfo?: string;
}

function SelectTag({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 bg-fillCardBg text-sm font-medium text-textPrimary mr-2 rounded-md pointer-events-none">
      {text}
    </span>
  );
}

export default function AcitvityItemsSearch(params: IAcitvityItemsSearch) {
  const { isLG } = useResponsive();
  const { collapsed, searchParams, selectProps, collapsedChange, nftType, selectTagCount, extraInfo } = params;
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

  const renderSelectTags = (maxTagCount: number = 2) => {
    const size = selectProps.value?.length || 0;
    if (!size) {
      return <span className="text-textPrimary font-medium text-base">Filter</span>;
    }

    const extra = size > maxTagCount ? ` +${size - maxTagCount}` : '';

    return selectProps.value.slice(0, maxTagCount).map((val: string | number, index: number) => {
      const item = dropDownActivitiesMenu.data.find((itm) => itm.value === val);
      const showStr = `${item?.label}${index === maxTagCount - 1 ? extra : ''}`;
      return <SelectTag text={showStr} key={val} />;
    });
  };

  return (
    <>
      <div className={styles.collection__search}>
        <div className={clsx('flex justify-between items-center', collapsed && !isLG ? 'w-[360px] mr-[32px]' : 0)}>
          <div className={clsx(styles.collapsed__button)} onClick={collapsedChange}>
            <CollapsedIcon className={styles.collapsed__icon} />
            <span className={clsx(styles.collapsed__text, isLG && 'w-0 !ml-0 overflow-hidden')}>Filters</span>

            {isLG && selectTagCount ? (
              <span className=" absolute left-8 -top-2 px-1.5 bg-textPrimary text-textWhite text-xs font-medium rounded-3xl">
                {selectTagCount}
              </span>
            ) : null}
          </div>
          {extraInfo && collapsed && !isLG ? (
            <span className=" text-base font-medium text-textPrimary">{extraInfo}</span>
          ) : null}
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
            <div className={styles['filter']}>
              <div className="flex-1">{renderSelectTags()}</div>
              <Arrow />
            </div>
          </Dropdown>
        )}
      </div>
      {isLG && (
        <div className="mt-0 !w-full mb-[16px] relative">
          <Dropdown
            trigger={['click']}
            open={visible}
            getPopupContainer={(v) => v}
            onOpenChange={(open) => setVisible(open)}
            overlayClassName={styles['detail-activity-dropdown']}
            menu={dropdownMenu as unknown as MenuProps}>
            <div className={clsx(styles['filter'], '!w-full')}>
              <div className="flex-1">{renderSelectTags()}</div>
              <Arrow />
            </div>
          </Dropdown>
        </div>
      )}
    </>
  );
}
