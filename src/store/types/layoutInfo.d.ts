import { FilterItemList, ItemsSource, ItemsSelectSourceType, SingleItemType } from 'components/ItemsLayout/types';
export type LayoutInfoStateType = {
  filterList: null | FilterItemList;
  filterSelect: null | ItemsSelectSourceType;
  isCollapsed: boolean;
  dropDownMenu: null | SingleItemType;
  dropDownDateMenu: null | SingleItemType;
  itemsSource: ItemsSource | null;
  gridType: number | null;
};
