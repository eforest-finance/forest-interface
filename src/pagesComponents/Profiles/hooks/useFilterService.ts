import { isEqual } from 'lodash-es';
import { FilterKeyEnum, FilterType } from 'pagesComponents/ExploreItem/constant';
import { useState } from 'react';

export function useFilterService() {
  const filterList = [
    {
      key: FilterKeyEnum.Price,
      title: FilterKeyEnum.Price,
      type: FilterType.Range,
      data: [],
    },
  ];
  const defaultFilter = {
    [FilterKeyEnum.Price]: {
      type: FilterType.Range,
      data: [
        {
          min: '',
          max: '',
        },
      ],
    },
  };

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);

  const onFilterChange = (val: ItemsSelectSourceType) => {
    setFilterSelect((pre) => ({
      ...pre,
      ...val,
    }));
  };

  const clearAll = () => {
    if (isEqual(defaultFilter, filterSelect)) return;
    setFilterSelect(defaultFilter);
  };

  return {
    filterList,
    filterSelect,
    onFilterChange,
    clearAll,
  };
}
