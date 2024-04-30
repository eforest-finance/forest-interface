enum FilterType {
  Checkbox = 'Checkbox',
  Range = 'Range',
  SearchCheckbox = 'SearchCheckbox',
  Single = 'Single',
  Multiple = 'Multiple',
}

enum FilterKeyEnum {
  Status = 'Status',
  Chain = 'Chain',
  Symbol = 'Symbol',
  Price = 'Price',
  Generation = 'Generation',
  Traits = 'Traits',
  ActivityType = 'ActivityType',
}

enum SymbolTypeEnum {
  FT,
  NFT,
}

enum CollectionsStatus {
  'Buy Now' = 1,
  'My Items' = 2,
  'On Auction' = 3,
  'Has Offers' = 4,
}
enum BoxSizeEnum {
  large,
  small,
  details,
}

const AcitvityItemArray = [
  'Issue',
  'Burn',
  'Transfer',
  'Sale',
  'ListWithFixedPrice',
  'DeList',
  'MakeOffer',
  'CancelOffer',
  'PlaceBid',
];

export { FilterType, FilterKeyEnum, SymbolTypeEnum, CollectionsStatus, AcitvityItemArray, BoxSizeEnum };
