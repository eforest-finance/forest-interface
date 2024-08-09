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
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
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

export function getFilterFromSearchParams(filterParamStr: string | null, generationInfos: any) {
  if (!filterParamStr) return {};

  const filterParamsObj = JSON.parse(decodeURI(filterParamStr)) as {
    [FilterKeyEnum.Traits]?: {
      key: string;
      values: string[];
    }[];
  } as any;

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

  const statusMap = {
    HasListingFlag: 'Buy Now',
    HasAuctionFlag: 'On Auction',
    HasOfferFlag: 'Has Offers',
  };

  const priceMap = {
    PriceLow: 'min',
    PriceHigh: 'max',
  };

  const keys = Object.keys(filterParamsObj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Object.keys(statusMap).includes(key) && filterParamsObj[key]) {
      filterParamsObj[FilterKeyEnum.Status].data.push({
        label: statusMap[key],
        value: CollectionsStatus[statusMap[key]],
      });
    }

    if (Object.keys(priceMap).includes(key)) {
      filterParamsObj[FilterKeyEnum.Price].data[0][priceMap[key]] = filterParamsObj[key];
    }

    if (['RarityList'].includes(key) && filterParamsObj[key]) {
      filterParamsObj[key].forEach((rarity) => {
        filterParamsObj[FilterKeyEnum.Rarity].data.push({
          label: rarity,
          value: rarity,
        });
      });
    }
  }

  return filterParamsObj;
}

export const getDefaultFilter = (ChainId: string): IFilterSelect => {
  const res: IFilterSelect = {
    [FilterKeyEnum.Status]: {
      type: FilterType.Checkbox,
      data: [],
    },
    [FilterKeyEnum.Chain]: {
      type: FilterType.Checkbox,
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
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
    ['PriceLow', 'PriceHigh', 'HasListingFlag', 'HasAuctionFlag', 'HasOfferFlag'].forEach((key) => delete params[key]);
  }

  console.log('getFilter', isActivity);
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
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
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
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
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
      data: [{ value: ChainId, label: `SideChain ${ChainId}`, disabled: true }],
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
