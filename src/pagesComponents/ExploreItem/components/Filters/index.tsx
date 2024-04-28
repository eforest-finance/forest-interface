import { FilterBoardForPC, FilterBoardForPhone } from './FilterBoard';
import { Layout } from 'antd';
import clsx from 'clsx';
import styles from './style.module.css';
import { useMemo } from 'react';
import { ICollecionGenerationInfo, ICollectionTraitInfo } from 'api/types';
import { getComponentByType } from './util';
import CollapsedIcon from 'assets/images/Collapsed.svg';

import SearchCheckBoxGroups from '../SearchCheckBoxGroups';
import { FilterKeyEnum } from 'pagesComponents/ExploreItem/constant';

interface IFilterContainerProps {
  options?: any[];
  clearAll: () => void;
  onClose: () => void;
  onFilterChange: (data: ItemsSelectSourceType) => void;
  open: boolean;
  traitsInfo?: ICollectionTraitInfo[];
  generationInfos?: ICollecionGenerationInfo[];
  filterSelect: IFilterSelect;
  filterList: (CheckboxItemType | RangeItemType | SearchCheckBoxItemType)[];
  mobileMode?: boolean;
  collapsedWidth?: number;
  pcRenderMode?: string;
  toggleOpen?: () => void;
}

const getTraitSelectorData = (
  traitsArrayInfo: ICollectionTraitInfo[],
  filterChange: (val: ItemsSelectSourceType) => void,
  filterSelectData: IFilterSelect,
) => {
  const traitsChildItems = traitsArrayInfo.map((itemTraitInfo) => {
    const defaultValue = (
      (filterSelectData?.[`${FilterKeyEnum.Traits}-${itemTraitInfo.key}`]?.data as unknown as SourceItemType[]) || []
    ).map((itm) => itm.value);
    return {
      key: itemTraitInfo.key,
      label: (
        <div className="flex justify-between mr-12 text-textPrimary">
          <span>{itemTraitInfo.key}</span>
          <span>{itemTraitInfo.valueCount}</span>
        </div>
      ),
      children: [
        {
          key: `${itemTraitInfo.key}-1`,
          label: (
            <SearchCheckBoxGroups
              key={itemTraitInfo.key}
              parentKey={itemTraitInfo.key}
              values={defaultValue}
              onChange={filterChange}
              dataSource={itemTraitInfo.values}
            />
          ),
        },
      ],
    };
  });

  return {
    key: FilterKeyEnum.Traits,
    label: FilterKeyEnum.Traits,
    children: traitsChildItems,
  };
};

export function FilterContainer({
  clearAll,
  onClose,
  open,
  traitsInfo,
  generationInfos,
  onFilterChange,
  filterSelect,
  filterList,
  mobileMode,
  pcRenderMode,
  toggleOpen,
}: IFilterContainerProps) {
  const collapseItems = useMemo(() => {
    const resTargetList = [...filterList];

    if (!traitsInfo?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Traits);
      index > -1 && resTargetList.splice(index, 1);
    }

    if (!generationInfos?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Generation);
      index > -1 && resTargetList.splice(index, 1);
    }

    return resTargetList?.map((item) => {
      const defaultValue = filterSelect[item.key as FilterKeyEnum]?.data;

      if (item.key === FilterKeyEnum.Traits) {
        return getTraitSelectorData(traitsInfo || [], onFilterChange, filterSelect);
      }

      if (item.key === FilterKeyEnum.Generation) {
        item.data = (generationInfos || []).map((itm) => ({
          value: `${itm.generation}`,
          label: `${itm.generation}`,
          extra: `${itm.generationItemsCount}`,
        }));
      }

      const Comp: React.FC<ICompProps> = getComponentByType(item.type);
      return {
        key: item.key,
        label: item.title,
        children: [
          {
            key: item.key + '-1',
            label: (
              <Comp
                dataSource={item}
                defaultValue={defaultValue}
                onChange={onFilterChange}
                {...(item.maxCount && { maxCount: item.maxCount })}
                {...(item.AMOUNT_LENGTH && { AMOUNT_LENGTH: item.AMOUNT_LENGTH })}
                {...((item.decimals || item.decimals === 0) && { decimals: item.decimals })}
              />
            ),
          },
        ],
      };
    });
  }, [filterSelect, filterList, traitsInfo, generationInfos]);

  if (mobileMode) {
    return (
      <FilterBoardForPhone
        items={collapseItems}
        defaultOpenKeys={Object.values(FilterKeyEnum)}
        clearAll={() => {
          onClose();
          clearAll();
        }}
        doneChange={onClose}
        showDropMenu={open}
        onCloseHandler={onClose}
      />
    );
  }

  if (pcRenderMode === 'left') {
    return (
      <Layout.Sider
        collapsed={!open}
        collapsedWidth={64}
        width={open ? 360 : 0}
        trigger={null}
        className={clsx('!bg-transparent m-0 border-0 border-l border-solid border-lineBorder')}>
        <div className={clsx(styles['collapsed-wrapper'], !open && '!justify-center')} onClick={toggleOpen}>
          {open && <span>Filter</span>}
          <CollapsedIcon width={16} height={16} className="fill-textPrimary" />
        </div>
        {open ? <FilterBoardForPC items={collapseItems} defaultOpenKeys={Object.values(FilterKeyEnum)} /> : null}
      </Layout.Sider>
    );
  }

  return (
    <Layout.Sider
      collapsed={!open}
      collapsedWidth={0}
      width={open ? 360 : 0}
      trigger={null}
      className={clsx('!bg-transparent m-0', !open ? '!mr-0' : '!mr-8', styles['fixed-left'])}>
      {open ? <FilterBoardForPC items={collapseItems} defaultOpenKeys={Object.values(FilterKeyEnum)} /> : null}
    </Layout.Sider>
  );
}
