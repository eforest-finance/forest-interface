type SourceItemType = {
  value: string | number;
  label: string;
  disabled?: boolean;
  extra?: string | number;
};

type CheckboxItemType = {
  key: FilterKeyEnum;
  title: string;
  maxCount?: number;
  decimals?: number;
  AMOUNT_LENGTH?: number;
  type: FilterType.Checkbox;
  showClearAll?: boolean;
  data: SourceItemType[];
};

type SingleItemType = {
  key: string;
  title: string;
  type: FilterType.Single;
  show?: string;
  data: SourceItemType[];
};

type MultipleItemType = {
  key: string;
  title: string;
  type: FilterType.Multiple;
  show?: string;
  data: SourceItemType[];
};

type RangeItemType = {
  key: FilterKeyEnum;
  title: string;
  maxCount?: number;
  AMOUNT_LENGTH?: number;
  decimals?: number;
  type: FilterType.Range;
  showClearAll?: boolean;
  data?: SourceItemType[];
};

type SearchCheckBoxItemType = {
  key: FilterKeyEnum;
  title: string;
  type: FilterType.SearchCheckbox;
  showClearAll?: boolean;
  data?: SourceItemType[];
  maxCount?: number;
  AMOUNT_LENGTH?: number;
  decimals?: number;
};

type ItemsSelectSourceType = {
  [x: string]: CheckboxSelectType | RangeSelectType;
};

interface ICompProps {
  dataSource: FilterItemType;
  defaultValue: SourceItemType[] | RangeType[] | undefined;
  onChange: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  disableClearAll?: boolean;

  maxCount?: number;
  decimals?: number;
  AMOUNT_LENGTH?: number;
}

interface IFilterSelect {
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
  [FilterKeyEnum.Generation]: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.Traits]?: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [FilterKeyEnum.ActivityType]?: {
    type: FilterType.Checkbox;
    data: SourceItemType[];
  };
  [key: string]: any;
}
type TagItemType = {
  label: string;
  type: string;
  value?: string | number;
  disabled?: boolean;
};
