interface SearchCheckboxChoiceProps {
  dataSource?: ICollectionTraitValue[];
  values?: (string | number)[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  parentKey: string;
}
