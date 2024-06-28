interface SearchCheckboxChoiceProps {
  dataSource?: ICollectionTraitValue[];
  values?: (string | number)[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
  parentKey?: string;
}

interface CollectionSearchCheckboxChoiceProps {
  dataSource?: INftCollection[];
  values?: (string | number)[];
  onChange?: (val: ItemsSelectSourceType) => void;
  clearAll?: () => void;
}
