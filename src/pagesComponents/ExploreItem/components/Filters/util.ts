import BigNumber from 'bignumber.js';
import CheckBoxGroups from '../CheckBoxGroups';
import RangeSelect from '../RangeSelect';
import SearchBoxGroups from '../SearchCheckBoxGroups';
import { FilterType, FilterKeyEnum, SymbolTypeEnum, CollectionsStatus } from '../../constant';
import { formatTokenPrice } from 'utils/format';

export const getComponentByType = (type: FilterType) => {
  const map: {
    [FilterType.Checkbox]: React.FC<CheckboxChoiceProps>;
    [FilterType.Range]: React.FC<RangeSelectProps>;
    [FilterType.SearchCheckbox]: React.FC<SearchCheckboxChoiceProps>;
  } = {
    [FilterType.Checkbox]: CheckBoxGroups,
    [FilterType.Range]: RangeSelect,
    [FilterType.SearchCheckbox]: SearchBoxGroups,
  };
  return map[type] as React.FC<ICompProps>;
};

export const getFilterList = (
  type: string,
  ChainId: string,
): Array<CheckboxItemType | RangeItemType | SearchCheckBoxItemType> => {
  const filterList = [
    {
      key: FilterKeyEnum.Status,
      title: FilterKeyEnum.Status,
      type: FilterType.Checkbox,
      data: [
        {
          value: CollectionsStatus['Buy Now'],
          label: CollectionsStatus[1],
        },
        {
          value: CollectionsStatus['On Auction'],
          label: CollectionsStatus[3],
        },
        {
          value: CollectionsStatus['Has Offers'],
          label: CollectionsStatus[4],
        },
      ],
    },
    {
      key: FilterKeyEnum.Chain,
      title: FilterKeyEnum.Chain,
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `aelf dAppChain`, disabled: true }],
    },
    {
      key: FilterKeyEnum.Price,
      title: FilterKeyEnum.Price,
      type: FilterType.Range,
      data: [],
    },
    {
      key: FilterKeyEnum.Symbol,
      title: FilterKeyEnum.Symbol,
      showClearAll: true,
      type: FilterType.Checkbox,
      data: [
        { value: SymbolTypeEnum.FT, label: 'FT' },
        { value: SymbolTypeEnum.NFT, label: 'NFT' },
      ],
    },
    {
      key: FilterKeyEnum.Traits,
      title: FilterKeyEnum.Traits,
      showClearAll: true,
      type: FilterType.SearchCheckbox,
      data: [],
    },
    {
      key: FilterKeyEnum.Generation,
      title: FilterKeyEnum.Generation,
      showClearAll: true,
      type: FilterType.Checkbox,
      data: [],
    },
    {
      key: FilterKeyEnum.Rarity,
      title: FilterKeyEnum.Rarity,
      showClearAll: true,
      type: FilterType.Checkbox,
      data: [],
    },
  ];
  if (type === 'nft') {
    filterList.splice(3, 1);
    filterList[0].data.splice(1, 1);
  }
  return filterList;
};

export function getFilterFromSearchParams(filterParamsObj: any, generationInfos: any) {
  if (!Object.keys(filterParamsObj).length) return {};

  filterParamsObj[FilterKeyEnum.Status] = {
    type: FilterType.Checkbox,
    data: [],
  };

  filterParamsObj[FilterKeyEnum.Rarity] = {
    type: FilterType.Checkbox,
    data: [],
  };

  filterParamsObj[FilterKeyEnum.Price] = {
    type: FilterType.Range,
    data: [
      {
        min: '',
        max: '',
      },
    ],
  };

  filterParamsObj[FilterKeyEnum.Generation] = {
    type: FilterType.Checkbox,
    data: [],
  };

  const statusMap: any = {
    HasListingFlag: 'Buy Now',
    HasAuctionFlag: 'On Auction',
    HasOfferFlag: 'Has Offers',
  };

  const priceMap: any = {
    PriceLow: 'min',
    PriceHigh: 'max',
  };

  if (filterParamsObj['generation']?.length) {
    filterParamsObj.Generation.data = filterParamsObj['generation'].split('|').map((list: number) => {
      return {
        value: list.toString(),
        label: list.toString(),
      };
    });
    filterParamsObj.generation = filterParamsObj['generation'].split('|');
  }

  if (filterParamsObj['RarityList']?.length) {
    filterParamsObj.Rarity.data = filterParamsObj['RarityList']
      .toString()
      .split('|')
      .map((list: number) => {
        return {
          value: list.toString(),
          label: list.toString(),
        };
      });
    filterParamsObj.RarityList = filterParamsObj['RarityList'].toString().split(',');
  }

  if (filterParamsObj['collectionIds']?.length) {
    filterParamsObj.Collections = {
      type: FilterType.Checkbox,
      data: filterParamsObj['collectionIds']
        .toString()
        .split('|')
        .map((list: number) => {
          return {
            value: list.toString(),
            label: list.toString(),
          };
        }),
    };
  }

  if (filterParamsObj['traits']?.length) {
    const res: Array<{
      key: string;
      values: string;
    }> = [];

    const lists = filterParamsObj['traits'].split('|');

    lists.length > 0 &&
      lists.forEach((k: string) => {
        const [keys, value] = k.split('-');
        res.push({
          key: keys,
          values: value,
        });
      });
    const mergeRes = mergeObjectsByKey(res);

    filterParamsObj['traits'] = mergeRes;
    mergeRes.forEach((list) => {
      filterParamsObj[`Traits-${list.key}`] = {
        type: FilterType.Checkbox,
        data: list.values.map((item: string) => {
          return { value: item, label: item };
        }),
      };
    });
  }

  if (filterParamsObj['SymbolTypeList']?.length) {
    filterParamsObj.Symbol = {
      type: FilterType.Checkbox,
      data: filterParamsObj['SymbolTypeList'].split('|').map((list: string) => {
        return {
          value: Number(list),
          label: list === '1' ? 'NFT' : 'FT',
        };
      }),
    };
  }

  const keys = Object.keys(filterParamsObj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (filterParamsObj[key] == 'true') {
      filterParamsObj[key] = true;
    }
    if (filterParamsObj[key] == 'false') {
      filterParamsObj[key] = false;
    }
    if (filterParamsObj[key] == 'undefined') {
      filterParamsObj[key] = '';
    }

    if (Object.keys(statusMap).includes(key) && filterParamsObj[key]) {
      filterParamsObj[FilterKeyEnum.Status].data.push({
        label: statusMap[key],
        value: CollectionsStatus[statusMap[key]],
      });
    }

    if (Object.keys(priceMap).includes(key)) {
      filterParamsObj[FilterKeyEnum.Price].data[0][priceMap[key]] = filterParamsObj[key];
    }
  }

  console.log('filterParamsObj-------', filterParamsObj);

  return filterParamsObj;
}

function mergeObjectsByKey(arr: any[]) {
  const result: any = {};

  arr.forEach((obj) => {
    const key = obj.key;
    const value = obj.values;
    if (result[key]) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  });
  return Object.keys(result).map((key) => ({
    key: key,
    values: result[key],
  }));
}

// 示例数组
const arr = [
  { key: 'a', value: 1 },
  { key: 'b', value: 2 },
  { key: 'a', value: 3 },
  { key: 'c', value: 4 },
  { key: 'b', value: 5 },
];

// 调用函数合并对象
const mergedResult = mergeObjectsByKey(arr);
console.log(mergedResult);

export const getDefaultFilter = (ChainId: string): IFilterSelect => {
  const res: IFilterSelect = {
    [FilterKeyEnum.Status]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Chain]: {
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `aelf dAppChain`, disabled: true }],
    },
    [FilterKeyEnum.Price]: {
      type: FilterType.Range,
      data: [
        {
          min: '',
          max: '',
        },
      ],
    },
    [FilterKeyEnum.Symbol]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Generation]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Traits]: {
      type: FilterType.Checkbox,
      data: [],
    },
  };

  return res;
};

const bigStr = (str: string) => {
  return str === '' ? undefined : new BigNumber(str).toNumber();
};
export const getFilter = (filterSelect: IFilterSelect, isActivity?: boolean) => {
  const status = filterSelect.Status.data.map((item: SourceItemType) => item.value);
  const generation = filterSelect.Generation.data.map((item: SourceItemType) => item.value);
  const RarityList = filterSelect.Rarity?.data?.map?.((item: SourceItemType) => item.value);
  const traits = getTraitsInfo();
  const params: { [key: string]: any } = {
    ChainList: filterSelect.Chain.data.map((item: SourceItemType) => item.value as 'AELF' | 'tDVV'),
    SymbolTypeList: filterSelect.Symbol.data.map((item: SourceItemType) => item.value as number),
    PriceLow: bigStr(filterSelect.Price.data[0].min),
    PriceHigh: bigStr(filterSelect.Price.data[0].max),
    HasListingFlag: status.includes(CollectionsStatus['Buy Now']),
    HasAuctionFlag: status.includes(CollectionsStatus['On Auction']),
    HasOfferFlag: status.includes(CollectionsStatus['Has Offers']),
  };
  if (generation?.length) {
    Object.assign(params, {
      generation,
    });
  }
  if (traits?.length) {
    Object.assign(params, {
      traits,
    });
  }

  if (RarityList?.length) {
    Object.assign(params, {
      RarityList,
    });
  }

  if (isActivity) {
    ['PriceLow', 'PriceHigh', 'HasListingFlag', 'HasAuctionFlag', 'HasOfferFlag', 'RarityList', 'generation'].forEach(
      (key) => delete params[key],
    );
  }

  return params;

  function getTraitsInfo() {
    const targetKeys = Object.keys(filterSelect).filter((key) => key.includes(FilterKeyEnum.Traits));
    if (!targetKeys.length) return null;
    const res: Array<{
      key: string;
      values: (string | number)[];
    }> = [];

    targetKeys.forEach((key) => {
      const [, subKey] = key.split('-');
      if (!subKey || !filterSelect?.[key]?.data?.length) return;
      res.push({
        key: subKey,
        values: filterSelect[key].data.map((item: SourceItemType) => item.value),
      });
    });

    return res;
  }
};

export const getTagList = (filterSelect: IFilterSelect, search: string) => {
  const result: TagItemType[] = [];
  for (const [key, value] of Object.entries(filterSelect)) {
    const { data, type } = value;
    if (type === FilterType.Checkbox) {
      data.forEach((element: SourceItemType) => {
        if (!element.disabled) {
          if (typeof element === 'object') {
            result.push({
              type: key,
              ...element,
            });
          } else {
            result.push({
              type: key,
              value: element,
              label: element,
            });
          }
        }
      });
    } else if (type === FilterType.Range) {
      const { min, max } = data[0];
      if (min || max) {
        const label =
          min && max
            ? `${formatTokenPrice(min)}-${formatTokenPrice(max)}`
            : (min === 0 || min) && !max
            ? `≥${formatTokenPrice(min)}`
            : `≤${formatTokenPrice(max)}`;
        result.push({
          type: key,
          label:
            `${key === FilterKeyEnum.Price ? '' : 'Length: '}` + label + `${key === FilterKeyEnum.Price ? ' ELF' : ''}`,
        });
      }
    } else if (type === FilterType.SearchCheckbox) {
      data.forEach((element: SourceItemType) => {
        if (!element.disabled) {
          result.push({
            type: key,
            ...element,
          });
        }
      });
    }
  }
  if (search) {
    result.push({
      type: 'search',
      label: search,
    });
  }

  return result;
};

export const getFilterListForActivity = (
  type: string,
  ChainId: string,
): Array<CheckboxItemType | RangeItemType | SearchCheckBoxItemType> => {
  const filterList = [
    {
      key: FilterKeyEnum.Chain,
      title: FilterKeyEnum.Chain,
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `aelf dAppChain`, disabled: true }],
    },
    {
      key: FilterKeyEnum.Symbol,
      title: FilterKeyEnum.Symbol,
      showClearAll: true,
      type: FilterType.Checkbox,
      data: [
        { value: SymbolTypeEnum.FT, label: 'FT' },
        { value: SymbolTypeEnum.NFT, label: 'NFT' },
      ],
    },
    {
      key: FilterKeyEnum.Traits,
      title: FilterKeyEnum.Traits,
      showClearAll: true,
      type: FilterType.SearchCheckbox,
      data: [],
    },
  ];
  if (type === 'nft') {
    filterList.splice(1, 1);
  }
  return filterList;
};

export const getFilterListForMyItem = (
  ChainId: string,
): Array<CheckboxItemType | RangeItemType | SearchCheckBoxItemType> => {
  const filterList = [
    {
      key: FilterKeyEnum.Status,
      title: FilterKeyEnum.Status,
      type: FilterType.Checkbox,
      data: [
        {
          value: CollectionsStatus['Buy Now'],
          label: CollectionsStatus[1],
        },
        {
          value: CollectionsStatus['Has Offers'],
          label: CollectionsStatus[4],
        },
      ],
    },
    {
      key: FilterKeyEnum.Chain,
      title: FilterKeyEnum.Chain,
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `aelf dAppChain`, disabled: true }],
    },
    {
      key: FilterKeyEnum.Price,
      title: FilterKeyEnum.Price,
      type: FilterType.Range,
      data: [],
    },
    {
      key: FilterKeyEnum.Collections,
      title: FilterKeyEnum.Collections,
      type: FilterType.Checkbox,
      data: [],
    },
  ];

  return filterList;
};

export const getDefaultFilterForMyItems = (ChainId: string): IFilterSelect => {
  const res: IFilterSelect = {
    [FilterKeyEnum.Status]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Chain]: {
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `aelf dAppChain`, disabled: true }],
    },
    [FilterKeyEnum.Price]: {
      type: FilterType.Range,
      data: [
        {
          min: '',
          max: '',
        },
      ],
    },
    [FilterKeyEnum.Symbol]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Generation]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Traits]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Collections]: {
      type: FilterType.Checkbox,
      data: [],
    },
  };

  return res;
};
