import { FilterBoardForPC, FilterBoardForPhone } from './FilterBoard';
import { Layout } from 'antd';
import clsx from 'clsx';
import styles from './style.module.css';
import { useMemo } from 'react';
import { ICollecionGenerationInfo, ICollectionRarityInfo, ICollectionTraitInfo } from 'api/types';
import { getComponentByType } from './util';
import CollapsedIcon from 'assets/images/Collapsed.svg';

import SearchCheckBoxGroups from '../SearchCheckBoxGroups';
import { FilterKeyEnum } from 'pagesComponents/ExploreItem/constant';

import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from 'baseComponents/Tooltip';
import useGetState from 'store/state/getState';
import CollectionSearchCheckBoxGroups from '../SearchCheckBoxGroups/collectionSearch';

interface IFilterContainerProps {
  options?: any[];
  clearAll: () => void;
  onClose: () => void;
  onFilterChange: (data: ItemsSelectSourceType) => void;
  open: boolean;
  traitsInfo?: ICollectionTraitInfo[];
  generationInfos?: ICollecionGenerationInfo[];
  rarityInfos?: ICollectionRarityInfo[];
  mineInfos?: any[];
  collectionInfos?: any[];
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
    ).map((itm) => {
      return itm.value;
    });

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

const getCollectionSelectorData = (
  collectionArrayInfo: ICollectionTraitInfo[],
  filterChange: (val: ItemsSelectSourceType) => void,
  filterSelectData: IFilterSelect,
) => {
  const selectValues = filterSelectData[FilterKeyEnum.Collections].data.map((itm: { value: any }) => itm.value);

  return {
    key: FilterKeyEnum.Collections,
    label: FilterKeyEnum.Collections,
    children: [
      {
        key: `${FilterKeyEnum.Collections}-1`,
        label: (
          <CollectionSearchCheckBoxGroups
            dataSource={collectionArrayInfo}
            onChange={filterChange}
            values={selectValues}
          />
        ),
      },
    ],
  };
};

export function FilterContainer({
  clearAll,
  onClose,
  open,
  traitsInfo,
  generationInfos,
  rarityInfos,
  mineInfos,
  collectionInfos,
  onFilterChange,
  filterSelect,
  filterList,
  mobileMode,
  pcRenderMode,
  toggleOpen,
}: IFilterContainerProps) {
  const { aelfInfo } = useGetState();
  console.log('filterSelectfilterSelectfilterSelectfilterSelect', filterSelect);

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

    if (!mineInfos?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Mine);
      index > -1 && resTargetList.splice(index, 1);
    }

    if (!collectionInfos?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Collections);
      index > -1 && resTargetList.splice(index, 1);
    }

    if (!rarityInfos?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Rarity);
      index > -1 && resTargetList.splice(index, 1);
    }

    return resTargetList?.map((item) => {
      const defaultValue = filterSelect[item.key as FilterKeyEnum]?.data;

      if (item.key === FilterKeyEnum.Traits) {
        return getTraitSelectorData(traitsInfo || [], onFilterChange, filterSelect);
      }

      if (item.key === FilterKeyEnum.Collections) {
        return getCollectionSelectorData(collectionInfos || [], onFilterChange, filterSelect);
      }

      if (item.key === FilterKeyEnum.Generation) {
        item.data = (generationInfos || []).map((itm) => ({
          value: `${itm.generation}`,
          label: `${itm.generation}`,
          extra: `${itm.generationItemsCount}`,
        }));
      }

      if (item.key === FilterKeyEnum.Mine) {
        item.data = (mineInfos || []).map((itm: any) => {
          return {
            value: `${itm.value}`,
            label: `${itm.value}`,
            extra: 'Mine',
          };
        });
      }

      const Comp: React.FC<ICompProps> = getComponentByType(item.type);

      if (item.key === FilterKeyEnum.Rarity) {
        item.data = (rarityInfos || []).map((itm) => ({
          value: `${itm.rarity}`,
          label: `${itm.rarity}`,
        }));

        return {
          key: FilterKeyEnum.Rarity,
          label: (
            <div className=" inline-flex items-center">
              <span className=" text-sm font-semibold text-textPrimary">Rarity</span>
              <Tooltip
                overlayInnerStyle={{ borderRadius: '6px' }}
                title={
                  <div className=" flex flex-col gap-y-1">
                    <span className=" text-textDisable text-xs">Rarity rank by Schrödinger.</span>
                    <a href={aelfInfo.officialWebsiteOfSchrodinger} target="_blank" rel="noreferrer">
                      <span className=" text-xs text-textWhite font-medium cursor-pointer hover:text-brandHover">
                        Learn more
                      </span>
                    </a>
                  </div>
                }>
                <QuestionCircleOutlined className="text-textSecondary ml-2" />
              </Tooltip>
            </div>
          ),
          children: [
            {
              key: `${FilterKeyEnum.Rarity}-1`,
              label: (
                <Comp dataSource={item} defaultValue={defaultValue} onChange={onFilterChange} showSelectAll={true} />
              ),
            },
          ],
        };
      }

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
  }, [filterSelect, filterList, traitsInfo, generationInfos, mineInfos, collectionInfos]);

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
