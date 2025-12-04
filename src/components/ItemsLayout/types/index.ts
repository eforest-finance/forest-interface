import { INftInfo } from 'types/nftTypes';

export enum FilterType {
  Single = 'Single',
  Multiple = 'Multiple',
  Range = 'Range',
}

export type SourceItemType = {
  value: string | number;
  label: string;
};

export type RangeType = {
  min: string;
  max: string;
};

export type SingleItemType = {
  key: string;
  title: string;
  type: FilterType.Single;
  show?: string;
  data: SourceItemType[];
};

export type MultipleItemType = {
  key: string;
  title: string;
  type: FilterType.Multiple;
  show?: string;
  data: SourceItemType[];
};

export type RangeItemType = {
  key: string;
  title: string;
  type: FilterType.Range;
  show?: string;
  data?: SourceItemType[];
};

export type FilterItemType = MultipleItemType | SingleItemType | RangeItemType;
export type FilterItemList = FilterItemType[];

export type KeyLabel = {
  key: string;
  label: string;
};

export type Owner = {
  id: string;
  userName: string;
  address: string;
  profileImage: string;
};

export interface ItemsSource {
  items: INftInfo[];
  tabType?: string;
  page?: number;
  end?: boolean;
  totalCount: number;
}

export type SingleSelectType = {
  // key: string;
  // title: string;
  type: FilterType.Single;
  data: SourceItemType[];
};

export type MultipleSelectType = {
  // key: string;
  // title: string;
  type: FilterType.Multiple;
  data: SourceItemType[];
};

export type RangeSelectType = {
  // key: string;
  // title: string;
  type: FilterType.Range;
  data: RangeType[];
};

export type ItemsSelectSourceType = { [x: string]: RangeSelectType | MultipleSelectType | SingleSelectType };
