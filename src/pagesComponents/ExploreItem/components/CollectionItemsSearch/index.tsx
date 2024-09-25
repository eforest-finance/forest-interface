import CollectionSearch from 'pagesComponents/Collections/components/CollectionSearch';
import styles from './styles.module.css';
import clsx from 'clsx';
import BaseSelect from '../BaseSelect';
import { dropDownCollectionsMenu, dropDownProfileMenu } from 'components/ItemsLayout/assets';
import LargeIcon from 'assets/images/explore/large.svg';
import SmallIcon from 'assets/images/explore/small.svg';
import DetailIcon from 'assets/images/explore/detail-icon.svg';
import useResponsive from 'hooks/useResponsive';
import { SelectProps } from 'baseComponents/Select';
import { InputProps } from 'baseComponents/Input/Input';
import { FilterButton } from '../Filters/FilterButton';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';

interface ICollectionItemsSearch {
  size: BoxSizeEnum;
  hiddenFilter?: boolean;
  hiddenSize?: boolean;
  collapsed: boolean;
  searchParams: InputProps;
  sizeChange: (value: BoxSizeEnum) => void;
  collapsedChange: () => void;
  selectProps: SelectProps;
  selectTagCount?: number;
  extraInfo?: string;
  type?: string;
}

export function CollectionItemsSearch(params: ICollectionItemsSearch) {
  const { isLG } = useResponsive();
  const {
    size,
    hiddenFilter,
    hiddenSize,
    collapsed,
    searchParams,
    selectProps,
    sizeChange,
    collapsedChange,
    selectTagCount,
    extraInfo,
    type,
  } = params;
  console.log('selectProps', selectProps);
  return (
    <>
      <div className={styles.collection__search}>
        {!hiddenFilter ? (
          <div
            className={clsx(
              'flex justify-between items-center',
              !isLG ? 'mr-8' : 'mr-4',
              !collapsed && !isLG ? 'w-[360px]' : 'w-auto',
            )}>
            <FilterButton onClick={collapsedChange} badge={selectTagCount || ''} showBadge={!!selectTagCount && isLG} />
            {extraInfo && !collapsed && !isLG ? (
              <span className=" text-base font-medium text-textPrimary">{extraInfo}</span>
            ) : null}
          </div>
        ) : null}

        <div className={clsx('flex-1', !isLG && 'mr-[32px]', 'search-bar')}>
          <CollectionSearch {...searchParams} />
        </div>
        {!isLG && (
          <div className="base-select">
            <BaseSelect dataSource={type ? dropDownProfileMenu : dropDownCollectionsMenu} {...selectProps} />
          </div>
        )}

        {!isLG && !hiddenSize && (
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
      {isLG && !hiddenSize && (
        <div className="flex mb-4 base-select">
          <BaseSelect
            className="!flex-1"
            dataSource={type ? dropDownProfileMenu : dropDownCollectionsMenu}
            {...selectProps}
          />

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
