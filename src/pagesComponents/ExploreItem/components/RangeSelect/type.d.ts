interface RangeInputProps {
  defaultValue?: RangeType[];
  prefixIcon?: ReactNode;
  decimals: number;
  errorMessage?: string;
  minStatus?: 'warning' | 'error' | '';
  maxStatus?: 'warning' | 'error' | '';
  maxCount?: number;
  AMOUNT_LENGTH?: number;
  onValueChange?: (min: number | string, max: number | string) => void;
}

interface RangeSelectProps {
  dataSource?: RangeItemType;
  maxCount?: number;
  decimals?: number;
  AMOUNT_LENGTH?: number;
  defaultValue?: RangeType[];
  onChange?: (val: ItemsSelectSourceType) => void;
}

type RangeType = {
  min: string;
  max: string;
};
