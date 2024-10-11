import { FilterItemList, FilterType, SingleItemType, MultipleItemType } from 'components/ItemsLayout/types';
export const ADAPT_MAP = {
  5: 1920,
  4: 1600,
  3: 1280,
  2: 1024,
};

export enum OwnerType {
  buyNow = 'Buy Now',
  mine = 'My Items',
}

export const SORT_BY = 'sorting';

export const dropDownMenu: SingleItemType = {
  key: SORT_BY,
  title: SORT_BY,
  type: FilterType.Single,
  data: [
    { value: '&ListingPrice ASC', label: 'Price: Low to High' },
    { value: '&ListingPrice DESC', label: 'Price: High to Low' },
    // { value: 'USDT-ListingPrice ASC', label: 'USDT Price：Low to High' },
    // { value: 'USDT-ListingPrice DESC', label: 'USDT Price：High to Low' },
    { value: '&ListingTime DESC', label: 'Recently Listed' },
  ],
};

export const dropDownCollectionsMenu: SingleItemType = {
  key: SORT_BY,
  title: SORT_BY,
  type: FilterType.Single,
  data: [
    { value: 'Low to High', label: 'Price: Low to High' },
    { value: 'High to Low', label: 'Price: High to Low' },
    // { value: 'USDT-ListingPrice ASC', label: 'USDT Price：Low to High' },
    // { value: 'USDT-ListingPrice DESC', label: 'USDT Price：High to Low' },
    { value: 'Recently Listed', label: 'Recently Listed' },
  ],
};

export const dropDownProfileMenu: SingleItemType = {
  key: SORT_BY,
  title: SORT_BY,
  type: FilterType.Single,
  data: [
    { value: 'High to Low', label: 'List Price: High to Low' },
    { value: 'Low to High', label: 'List Price: Low to High' },
    // { value: 'USDT-ListingPrice ASC', label: 'USDT Price：Low to High' },
    // { value: 'USDT-ListingPrice DESC', label: 'USDT Price：High to Low' },
    // { value: 'Recently Listed', label: 'Recently Listed' },
  ],
};

export const dropDownActivitiesMenu: MultipleItemType = {
  key: 'acitvityType',
  title: 'acitvityType',
  type: FilterType.Multiple,
  data: [
    { label: 'Issue', value: 0 },
    { label: 'Burn', value: 1 },
    { label: 'Transfer', value: 2 },
    { label: 'Sale', value: 3 },
    { label: 'ListWithFixedPrice', value: 4 },
    { label: 'Delist', value: 5 },
    { label: 'Make Offer', value: 6 },
    { label: 'Cancel Offer', value: 7 },
    { label: 'PlaceBid', value: 8 },
  ],
};

export const dropDownDateMenu: SingleItemType = {
  key: SORT_BY,
  title: SORT_BY,
  type: FilterType.Single,
  data: [
    { value: '&GainTime DESC', label: 'Date: Newest' },
    { value: '&GainTime ASC', label: 'Date: Oldest' },
  ],
};

export const filterList: FilterItemList = [
  {
    key: 'address',
    title: 'Status',
    type: FilterType.Single,
    data: [
      { value: '1', label: 'Buy Now' },
      { value: '2', label: 'My Items' },
    ],
  },
  {
    key: 'price',
    title: 'Price',
    type: FilterType.Range,
  },
  // {
  //   key: 'chainId',
  //   title: 'Chains',
  //   type: FilterType.Multiple,
  //   data: [
  //     { value: 'AELF', label: 'Main AELF' },
  //     { value: 'tDVV', label: 'Side tDVV' },
  //   ],
  // },
  // {
  //   key: 'saleTokenId',
  //   title: 'On Sales In',
  //   type: FilterType.Multiple,
  //   data: [
  //     { value: 'ELF', label: 'ELF' },
  //     // { value: 'USDT', label: 'USDT' },
  //   ],
  // },
];

export const profileFilterList: FilterItemList = [
  {
    key: 'price',
    title: 'Price',
    type: FilterType.Range,
  },
  // {
  //   key: 'chainId',
  //   title: 'Chains',
  //   type: FilterType.Multiple,
  //   data: [
  //     // { value: 'AELF', label: 'Main AELF' },
  //     // { value: 'tDVW', label: 'Side tDVW' },
  //   ],
  // },
  {
    key: 'category',
    title: 'Type',
    type: FilterType.Single,
    show: '#Badge',
    data: [
      { value: '1', label: 'Activity' },
      { value: '0', label: 'Trade' },
    ],
  },
  // {
  //   key: 'saleTokenId',
  //   title: 'On Sales In',
  //   type: FilterType.Multiple,
  //   data: [
  //     { value: 'ELF', label: 'ELF' },
  //     { value: 'USDT', label: 'USDT' },
  //   ],
  // },
];

export const defaultFilter = {
  '/account': {
    address: {
      type: FilterType.Single,
      data: [{ value: OwnerType.mine, label: 'My Items' }],
    },
  },
  '#Badge': {
    [SORT_BY]: {
      type: FilterType.Single,
      data: [{ value: '&GainTime DESC', label: 'Date: Newest' }],
    },
  },
  '/explore-items': {
    // address: {
    //   type: FilterType.Single,
    //   data: [{ value: OwnerType.buyNow, label: 'Buy Now' }],
    // },
    [SORT_BY]: {
      type: FilterType.Single,
      data: [{ value: '&ListingTime DESC', label: 'Recently Listed' }],
    },
  },
  sorting: {
    [SORT_BY]: {
      type: FilterType.Single,
      data: [{ value: '&ListingTime DESC', label: 'Recently Listed' }],
    },
  },
};
