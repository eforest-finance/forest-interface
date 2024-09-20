export interface From {
  id: string;
  name: string;
  address: string;
  profileImage: string | null;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
}

export interface To {
  id: string;
  name: string;
  address: string;
  profileImage: string | null;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
}

export type Price = {
  amount: number;
  tokenId: number;
  symbol: string;
};

export interface OfferType {
  chainId: Chain;
  fromAddress: string | null;
  toAddress: string | null;
  from: From | null;
  to: To | null;
  quantity: number;
  price: number;
  expireTime: number;
  id: string;
  nftInfo: IListingNftInfo;
  purchaseToken: IPurchaseToken;
  floorPrice?: number;
  floorPriceSymbol?: string;
}

export type Owner = {
  id: string | null;
  name: string | null;
  address: string | null;
  profileImage: string | null;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
};

export type IListingCollection = {
  id: string;
  chainId: Chain;
  symbol: string;
  totalSupply: number;
  isBurnable: boolean;
  issueChainId: string;
  metadata: MetadataType | null;
  creator: Owner;
  collectionName: string | null;
  nftType: string | null;
  baseUri: string | null;
  isTokenIdReuse: boolean;
};

export type SaleTokens = {
  chainId: Chain;
  address: string;
  symbol: string;
  decimals: number;
  id: string;
};

export type MetadataType =
  | {
      key: string;
      value: string;
    }[]
  | [];

export interface ICreator {
  address: string;
  email: string | null;
  id: string | null;
  instagram: string | null;
  name: string;
  profileImage: string | null;
  twitter: string | null;
}

export enum NftInfoPriceType {
  other = 'OTHER',
  otherMinListing = 'OTHERMINLISTING',
  myMinListing = 'MYMINLISTING',
  maxOffer = 'MAXOFFER',
  latestDeal = 'LATESTDEAL',
}

export interface INftInfo {
  chainId: Chain;
  issueChainId: number;
  issueChainIdStr: Chain;
  description: string | null;
  file: string | undefined;
  fileExtension: string | null;
  id: string;
  isOfficial: boolean;
  issuer: string;
  chainIdStr: string;
  proxyIssuerAddress: string;
  latestDealPrice: number;
  latestDealTime: string;
  latestDealToken: SaleTokens | null;
  latestListingTime: string | null;
  listingAddress: string | null;
  canBuyFlag: boolean;
  showPriceType: NftInfoPriceType;
  listingId: string | null;
  listingPrice: number;
  listingQuantity: number;
  listingEndTime: string | null;
  listingToken: SaleTokens | null;
  maxOfferPrice: number;
  maxOfferEndTime: string | null;
  metadata: MetadataType | null;
  nftSymbol: string;
  nftTokenId: number;
  previewImage: string | null;
  tokenName: string;
  totalQuantity: number;
  uri: string | null;
  whitelistId: string | null;
  price?: number | string;
  priceDescription?: string;
  whitelistPrice: number;
  whitelistPriceToken: SaleTokens | null;
  minter: ICreator | null;
  owner: ICreator | null;
  realOwner?: ICreator | null;
  decimals: string | number;
  nftCollection: {
    chainId: Chain;
    creator: ICreator;
    creatorAddress: string;
    description: string | null;
    featuredImage: string | null;
    id: string;
    isBurnable: boolean;
    isOfficial: boolean;
    issueChainId: number;
    logoImage: string | null;
    metadata: MetadataType | null;
    symbol: string;
    tokenName: string;
    totalSupply: number;
    baseUrl: string;
  } | null;
  createTokenInformation: {
    category: string | null;
    tokenSymbol: string | null;
    expires: number | null;
    registered: number | null;
  } | null;
  alias?: string;
  ownerCount: number;
  inscriptionInfo?: {
    tick?: string;
    issuedTransactionId?: string;
    deployTime?: number;
    mintLimit?: number;
  };
  describe?: string;
  rarity?: string;
  level?: string;
  generation: number;
  traitPairsDictionary: Array<Pick<ITraitInfo, 'key' | 'value'>>;
  _rankStrForShow?: string;
  type?: string;
  makeOfferInfo?: {
    quantity: number | string;
    price: number | string;
  };
}

export interface INftTraitInfo {
  id: string;
  generation: number | string;
  traitInfos: ITraitInfo[];
}

export interface ITraitInfo {
  id: string;
  key: string;
  value: string;
  itemsCount: number;
  allItemsCount: number;
  itemFloorPrice: number;
  itemFloorPriceToken: {
    chainId: Chain;
    address: string;
    symbol: string;
    decimals: number;
    id: string;
  };
}

export interface IListingNftInfo {
  chainId: Chain;
  symbol: string;
  tokenHash: string | null;
  nftCollection: IListingCollection;
  id: string;
}

export interface IPurchaseToken {
  chainId: Chain;
  address: string | null;
  symbol: string;
  decimals: number;
  id: string;
}
export interface NftListingWhiteList {
  address: string;
  price: number;
  purchaseToken: IPurchaseToken;
}

export interface IListingType {
  ownerAddress: string;
  owner: Owner;
  quantity: number;
  prices: number;
  whitelistPrices: number | null;
  symbol: string;
  startTime: number;
  publicTime: number;
  endTime: number;
  whitelistId: string | null;
  nftInfo: IListingNftInfo;
  purchaseToken: IPurchaseToken;
  id: string;
}
