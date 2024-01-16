import BigNumber from 'bignumber.js';
import CheckBoxGroups, { CheckboxChoiceProps } from './components/CheckBoxGroups';
import RangeSelect, { RangeSelectProps } from './components/RangeSelect';
import { SupportedELFChainId } from 'constants/chain';

export enum SeedTypesEnum {
  seed,
  nft,
}

export enum FilterType {
  Checkbox = 'Checkbox',
  Range = 'Range',
}

export type SourceItemType = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export enum FilterKeyEnum {
  Status = 'Status',
  Chain = 'Chain',
  Symbol = 'Symbol',
  Price = 'Price',
}

export type CheckboxItemType = {
  key: FilterKeyEnum;
  title: string;
  maxCount?: number;
  decimals?: number;
  AMOUNT_LENGTH?: number;
  type: FilterType.Checkbox;
  showClearAll?: boolean;
  data: SourceItemType[];
};

export type RangeItemType = {
  key: FilterKeyEnum;
  title: string;
  maxCount?: number;
  AMOUNT_LENGTH?: number;
  decimals?: number;
  type: FilterType.Range;
  showClearAll?: boolean;
  data?: SourceItemType[];
};

export enum SymbolTypeEnum {
  FT,
  NFT,
}

export enum CollectionsStatus {
  'Buy Now' = 1,
  'My Items' = 2,
  'On Auction' = 3,
  'Has Offers' = 4,
}

export type RangeType = {
  min: string;
  max: string;
};

export const getFilterList = (type: string, ChainId: string): Array<CheckboxItemType | RangeItemType> => {
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
  ];
  if (type === 'nft') {
    filterList.pop();
    filterList[0].data.splice(1, 1);
  }
  return filterList;
};

export interface IFilterSelect {
  [FilterKeyEnum.Status]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Chain]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Symbol]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Price]: {
    type: FilterType.Range;
    data: RangeType[];
  };
}

export const getDefaultFilter = (ChainId: string): IFilterSelect => {
  return {
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
  };
};

// export const defaultFilter: IFilterSelect = {
//   [FilterKeyEnum.Status]: {
//     type: FilterType.Checkbox,
//     data: [],
//   },
//   [FilterKeyEnum.Chain]: {
//     type: FilterType.Checkbox,
//     data: [{ value: 'tDVV', label: 'SideChain tDVV', disabled: true }],
//   },
//   [FilterKeyEnum.Price]: {
//     type: FilterType.Range,
//     data: [
//       {
//         min: '',
//         max: '',
//       },
//     ],
//   },
//   [FilterKeyEnum.Symbol]: {
//     type: FilterType.Checkbox,
//     data: [],
//   },
// };

export type FilterItemType = CheckboxItemType | RangeItemType;
export type RangeSelectType = {
  type: FilterType.Range;
  data: RangeType[];
};
export type ItemsSelectSourceType = { [x: string]: CheckboxSelectType | RangeSelectType };
export type CheckboxSelectType = {
  type: FilterType.Checkbox;
  data: SourceItemType[];
};

export interface ICompProps {
  dataSource: FilterItemType;
  defaultValue: SourceItemType[] | RangeType[] | undefined;
  onChange: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  disableClearAll?: boolean;
}

export const getComponentByType = (type: FilterType) => {
  const map: {
    [FilterType.Checkbox]: React.FC<CheckboxChoiceProps>;
    [FilterType.Range]: React.FC<RangeSelectProps>;
  } = {
    [FilterType.Checkbox]: CheckBoxGroups,
    [FilterType.Range]: RangeSelect,
  };
  return map[type] as React.FC<ICompProps>;
};

const bigStr = (str: string) => {
  return str === '' ? undefined : new BigNumber(str).toNumber();
};

export const getFilter = (filterSelect: IFilterSelect) => {
  const status = filterSelect.Status.data.map((item) => item.value);
  return {
    ChainList: filterSelect.Chain.data.map((item) => item.value as 'AELF' | 'tDVV'),
    SymbolTypeList: filterSelect.Symbol.data.map((item) => item.value as number),
    PriceLow: bigStr(filterSelect.Price.data[0].min),
    PriceHigh: bigStr(filterSelect.Price.data[0].max),
    HasListingFlag: status.includes(CollectionsStatus['Buy Now']),
    HasAuctionFlag: status.includes(CollectionsStatus['On Auction']),
    HasOfferFlag: status.includes(CollectionsStatus['Has Offers']),
  };
};

export type TagItemType = {
  label: string;
  type: string;
  value?: string | number;
  disabled?: boolean;
};

export const getTagList = (filterSelect: IFilterSelect, search: string) => {
  const result: TagItemType[] = [];
  for (const [key, value] of Object.entries(filterSelect)) {
    const { data, type } = value;
    if (type === FilterType.Checkbox) {
      data.forEach((element: SourceItemType) => {
        if (!element.disabled) {
          result.push({
            type: key,
            ...element,
          });
        }
      });
    } else if (type === FilterType.Range) {
      const { min, max } = data[0];
      if (min || max) {
        const label = min && max ? `${min}-${max}` : (min === 0 || min) && !max ? `≥${min}` : `≤${max}`;
        result.push({
          type: key,
          label:
            `${key === FilterKeyEnum.Price ? '' : 'Length: '}` + label + `${key === FilterKeyEnum.Price ? ' ELF' : ''}`,
        });
      }
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
