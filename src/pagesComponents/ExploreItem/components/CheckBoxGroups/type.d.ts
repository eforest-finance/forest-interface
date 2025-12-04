interface CheckboxChoiceProps {
  dataSource?: CheckboxItemType;
  defaultValue?: SourceItemType[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  showSelectAll?: boolean;
}
