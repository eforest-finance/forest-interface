import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import Button from 'baseComponents/Button';
import { Layout } from 'antd';
import useResponsive from 'hooks/useResponsive';
import { useMemo, useState } from 'react';
import { CollapseForPC, CollapseForPhone } from '../components/FilterContainer';
import { useFilterService } from '../hooks/useFilterService';
import { FilterKeyEnum, ICompProps, IFilterSelect, ItemsSelectSourceType, getComponentByType } from '../type';
import SearchCheckBoxGroups from '../components/SearchCheckBoxGroups';
import { ICollectionTraitInfo } from 'api/types';

interface IFilterProps {
  filterChange: (val: ItemsSelectSourceType) => void;
}

export function Filter({ filterChange }: IFilterProps) {
  const { isLG } = useResponsive();

  const { filterList, generationInfos, filterSelect, traitsInfo } = useFilterService();

  const getTraitSelectorData = (
    traitsArrayInfo: ICollectionTraitInfo[],
    filterChange: (val: ItemsSelectSourceType) => void,
    filterSelectData: IFilterSelect,
  ) => {
    const traitsChildItems = traitsArrayInfo.map((itemTraitInfo) => {
      const defaultValue = (filterSelectData?.[`${FilterKeyEnum.Traits}-${itemTraitInfo.key}`]?.data || []).map(
        (itm: { label: string; value: string }) => itm.value,
      );
      return {
        key: itemTraitInfo.key,
        label: (
          <div className="flex justify-between mr-12">
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

  const collapseItems = useMemo(() => {
    const resTargetList = [...filterList];
    if (!traitsInfo?.items?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Traits);
      resTargetList.splice(index, 1);
    }

    if (!generationInfos?.items?.length) {
      const index = resTargetList.findIndex((itm) => itm.key === FilterKeyEnum.Generation);
      resTargetList.splice(index, 1);
    }

    return resTargetList?.map((item) => {
      const defaultValue = filterSelect[item.key]?.data;

      if (item.key === FilterKeyEnum.Traits) {
        return getTraitSelectorData(traitsInfo?.items || [], filterChange, filterSelect);
      }

      if (item.key === FilterKeyEnum.Generation) {
        item.data = (generationInfos?.items || []).map((itm) => ({
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
                onChange={filterChange}
                {...(item.maxCount && { maxCount: item.maxCount })}
                {...(item.AMOUNT_LENGTH && { AMOUNT_LENGTH: item.AMOUNT_LENGTH })}
                {...((item.decimals || item.decimals === 0) && { decimals: item.decimals })}
              />
            ),
          },
        ],
      };
    });
  }, [filterList, generationInfos]);

  return <CollapseForPC items={collapseItems} />;
}
