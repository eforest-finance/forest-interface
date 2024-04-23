import CollectionSearch from 'pagesComponents/Collections/components/CollectionSearch';
import styles from './styles.module.css';
import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import clsx from 'clsx';
import BaseSelect from '../BaseSelect';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import LargeIcon from 'assets/images/explore/large.svg';
import SmallIcon from 'assets/images/explore/small.svg';
import DetailIcon from 'assets/images/explore/detail-icon.svg';
import useResponsive from 'hooks/useResponsive';
import { SelectProps } from 'baseComponents/Select';
import { InputProps } from 'baseComponents/Input/Input';

export enum BoxSizeEnum {
  large,
  small,
  details,
}
interface ICollectionItemsSearch {
  size: BoxSizeEnum;
  collapsed: boolean;
  searchParams: InputProps;
  sizeChange: (value: BoxSizeEnum) => void;
  collapsedChange: () => void;
  selectProps: SelectProps;
  selectTagCount?: number;
}

export default function CollectionItemsSearch(params: ICollectionItemsSearch) {
  const { isLG } = useResponsive();
  const { size, collapsed, searchParams, selectProps, sizeChange, collapsedChange, selectTagCount } = params;
  return (
    <>
      <div className={styles.collection__search}>
        <div className={clsx('flex', collapsed && !isLG ? 'w-[360px] mr-[32px]' : 0)}>
          <div className={clsx(styles.collapsed__button)} onClick={collapsedChange}>
            <CollapsedIcon className={styles.collapsed__icon} />
            <span className={clsx(styles.collapsed__text, isLG && 'w-0 !ml-0 overflow-hidden')}>Filters</span>
            {isLG && selectTagCount ? (
              <span className=" absolute left-8 -top-2 px-1.5 bg-textPrimary text-textWhite text-xs font-medium rounded-3xl">
                {selectTagCount}
              </span>
            ) : null}
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
              className={clsx(styles['btn-icon'], size === BoxSizeEnum.details && styles.active)}
              onClick={() => {
                sizeChange(BoxSizeEnum.details);
              }}>
              <DetailIcon />
            </div>
            <div
              className={clsx(styles['btn-icon'], size === BoxSizeEnum.large && styles.active)}
              onClick={() => {
                sizeChange(BoxSizeEnum.large);
              }}>
              <LargeIcon />
            </div>
            <div
              className={clsx(styles['btn-icon'], size === BoxSizeEnum.small && styles.active)}
              onClick={() => {
                sizeChange(BoxSizeEnum.small);
              }}>
              <SmallIcon />
            </div>
          </div>
        )}
      </div>
      {isLG && (
        <div className="flex my-4">
          <BaseSelect className="!flex-1" dataSource={dropDownCollectionsMenu} {...selectProps} />

          <div className={styles['size_container']}>
            <div
              className={clsx(styles['btn-icon'], size === BoxSizeEnum.details && 'bg-fillHoverBg')}
              onClick={() => {
                sizeChange(BoxSizeEnum.details);
              }}>
              <DetailIcon />
            </div>
            <div
              className={clsx(styles['btn-icon'], size === BoxSizeEnum.small && 'bg-fillHoverBg')}
              onClick={() => {
                sizeChange(BoxSizeEnum.small);
              }}>
              <SmallIcon />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
