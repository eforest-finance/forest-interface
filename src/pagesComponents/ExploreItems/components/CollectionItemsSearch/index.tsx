import CollectionSearch from 'pagesComponents/Collections/components/CollectionSearch';
import styles from './styles.module.css';
import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import clsx from 'clsx';
import BaseSelect from '../BaseSelect';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import LargeIcon from 'assets/images/explore/large.svg';
import SmallIcon from 'assets/images/explore/small.svg';
import useResponsive from 'hooks/useResponsive';
import { SelectProps } from 'baseComponents/Select';
import { InputProps } from 'baseComponents/Input/Input';
export enum BoxSizeEnum {
  large,
  small,
}
interface ICollectionItemsSearch {
  size: BoxSizeEnum;
  collapsed: boolean;
  searchParams: InputProps;
  sizeChange: (value: BoxSizeEnum) => void;
  collapsedChange: () => void;
  selectProps: SelectProps;
}

export default function CollectionItemsSearch(params: ICollectionItemsSearch) {
  const { isLG } = useResponsive();
  const { size, collapsed, searchParams, selectProps, sizeChange, collapsedChange } = params;
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
          <div>
            <BaseSelect dataSource={dropDownCollectionsMenu} {...selectProps} />
          </div>
        )}

        {!isLG && (
          <div className={styles.size_container}>
            <div
              className={clsx(styles.large, size === BoxSizeEnum.large && styles.active)}
              onClick={() => {
                sizeChange(BoxSizeEnum.large);
              }}>
              <LargeIcon />
            </div>
            <div
              className={clsx(styles.small, size === BoxSizeEnum.small && styles.active)}
              onClick={() => {
                sizeChange(BoxSizeEnum.small);
              }}>
              <SmallIcon />
            </div>
          </div>
        )}
      </div>
      {isLG && (
        <div className="mt-[16px] !w-full mb-[16px]">
          <BaseSelect className="!w-full" dataSource={dropDownCollectionsMenu} {...selectProps} />
        </div>
      )}
    </>
  );
}
