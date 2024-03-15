import { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import { IManagerItem } from 'store/reducer/saleInfo/type';
import { IListingType } from 'types/nftTypes';

export type requestConfig = {
  method?: Method;
  params?: any;
  data?: any;
  errMessage?: string;
  query?: string;
  headers?: AxiosRequestHeaders;
};

export type API_REQ_FUNCTION = (config?: requestConfig) => Promise<any | AxiosResponse<any>>;

export interface IBaseRequest {
  url: string;
  method?: Method;
  params?: any;
  data?: any;
  errMessage?: string;
  query?: string; //this for url parameter； example: test/:id
  headers?: AxiosRequestHeaders;
}

export type BaseConfig = string | { target: string; baseConfig: requestConfig };
export type UrlObj = { [key: string]: BaseConfig };

export interface NFTMarketRequestParams {
  chainId?: string;
  nftInfoId?: string;
  timestampMin?: number;
  timestampMax?: number;
}
export interface ITokensParams {
  nftCollectionId: string;
  chainId: string;
}

export interface ITokensItems {
  chainId: string;
  address: string | null;
  symbol: string;
  decimals: number;
  id: string;
}

export interface ITokens {
  items: ITokensItems[];
}

export interface INftOffersParams {
  chainId: string;
  nftInfoId?: string;
  skipCount: number;
  maxResultCount: number;
}
export interface INftTypes {
  items: {
    shortName: string;
    fullName: string;
  }[];
}

export interface INftOffersParams {
  chainId: string;
  nftInfoId?: string;
  skipCount: number;
  maxResultCount: number;
}

export interface ITokenData {
  price: number;
  timestamp: number;
}

export interface INftPricesParams {
  timestampMin: number;
  timestampMax: number;
  nftInfoId: string;
}

export interface IPricePoint {
  price: number;
  timestamp: number;
}

export interface IPricesList {
  items: IPricePoint[];
}

export interface IListingsParams {
  chainId: Chain;
  symbol: string;
  skipCount: number;
  maxResultCount: number;
  excludedAddress?: string;
  address?: string;
}

export interface IListingsResponse {
  items: IListingType[];
  totalCount: number;
}

export interface IActivitiesParams {
  nftInfoId: string;
  types: number[];
  skipCount: number;
  maxResultCount: number;
}

export interface IFrom {
  id: string;
  name: string;
  address: string;
  profileImage?: string | null;
  email?: string | null;
  twitter?: string | null;
  instagram?: string | null;
}

export interface ITo {
  id: string;
  name: string;
  address: string;
  profileImage?: string | null;
  email?: string | null;
  twitter?: string | null;
  instagram?: string | null;
}

export interface IPriceToken {
  id: string;
  chainId: string;
  address?: string | null;
  symbol: string;
  decimals: number;
}

export interface IActivitiesItem {
  nftInfoId: string;
  type: number;
  from?: IFrom | null;
  to?: ITo | null;
  amount: number;
  price: number;
  priceToken: IPriceToken;
  id: string;
  transactionHash: string;
  timestamp: number;
}

export interface IActivities {
  items: IActivitiesItem[] | null;
  totalCount: number;
}

export interface IWhitelistExtraInfosParams {
  chainId: Chain;
  projectId: string;
  whitelistHash: string;
  currentAddress: string;
  searchAddress?: string;
  tagHash?: string;
  skipCount: number;
  maxResultCount: number;
}

export interface IWhitelistExtraInfosItem {
  id: string;
  chainId: string;
  address: string;
  whitelistInfo: {
    id: string;
    chainId: string;
    whitelistHash: string;
    projectId: string;
    strategyType: number;
  };
  tagInfo: {
    id: string;
    chainId: string;
    tagHash: string;
    name: string;
    info: string;
    priceTagInfo: {
      symbol: string;
      price: number;
    };
  };
}

export interface IWhitelistExtraInfosResponse {
  items: IWhitelistExtraInfosItem[];
  totalCount: number;
}

export interface IWhitelistManagersParams {
  chainId: Chain;
  projectId: string;
  whitelistHash: string;
  address: string;
  skipCount: number;
  maxResultCount: number;
}

export interface ITokenInfoBase {
  address: string;
  chainId: string;
  decimals: number;
  symbol: string;
}
export interface IWhitelistPriceTokensResponse {
  items: ITokenInfoBase[];
  totalCount: number;
}
export interface INftInfoParams {
  Address: string;
  NFTCollectionId: string;
  IssueAddress: string;
  MaxResultCount: number;
  PriceHigh: number;
  PriceLow: number;
  SkipCount: number;
  Sorting: string;
  Status: number;
}

export interface CompositeNftInfosParams {
  address: string;
  CollectionType: string; // seed,nft
  CollectionId: string;
  SearchParam: string;
  MaxResultCount: number;
  HasListingFlag: boolean;
  HasAuctionFlag: boolean;
  HasOfferFlag: boolean;
  PriceHigh: number;
  PriceLow: number;
  ChainList: ('AELF' | 'tDVV')[];
  SkipCount: number;
  Sorting: string;
  generation: number[];
  traits: Array<{
    key: string;
    values: string[];
  }>;
}

export interface IWhiteListTagsParams {
  chainId: Chain;
  projectId: string;
  whitelistHash: string;
  priceMin?: number;
  priceMax?: number;
  skipCount: number;
  maxResultCount: number;
}

export interface IWhitelistManagersResponse {
  items: IManagerItem[];
  totalCount: number;
  error?: string;
}

export interface IWhiteListTagsItem {
  chainId: Chain;
  tagHash: string;
  name: string;
  info: string;
  priceTagInfo: {
    symbol: string;
    price: number;
  };
  whitelistInfo: {
    chainId: Chain;
    whitelistHash: string;
    projectId: string;
    strategyType: number;
  };
  addressCount: number;
}

export interface IWhiteListTagsResponse {
  items: IWhiteListTagsItem[];
  totalCount: number;
  error?: string;
}

export interface INftCollectionParams {
  fromChainId?: string;
  toChainId?: string;
  symbol?: string;
  nftSymbol?: string;
  description?: string;
  logoImageFile?: any;
  featuredImageFile?: any;
}

export interface ISyncChainParams {
  fromChainId: string;
  toChainId: string;
  symbol: string;
  txHash: string;
}

export interface ISyncChainResult {
  transactionHash: string;
  crossChainCreateTokenTxId: string;
  validateTokenTxId: string;
  status: string;
}

export interface ISaveNftInfosParams {
  chainId: string;
  transactionId: string;
  symbol?: string;
  description?: string;
  externalLink?: string;
  previewImage?: string;
  file?: string;
}

export interface ISaveCollectionInfosParams {
  fromChainId: string;
  transactionId: string;
  symbol?: string;
  tokenName?: string;
  description?: string;
  externalLink?: string;
  logoImage?: string;
  featuredImage?: string;
}

export interface ICommunityItems {
  id: number;
  link: string;
  name: string;
}

export interface IConfigResponse {
  data: IConfigItems;
}
export interface IConfigItems {
  networkType?: string;
  networkTypeV2?: string;
  connectServer?: string;
  graphqlServer?: string;
  graphqlServerV2?: string;
  portkeyServer?: string;
  mainChainAddress?: string;
  sideChainAddress?: string;
  forestMainAddress?: string;
  forestSideAddress?: string;
  marketMainAddress?: string;
  marketSideAddress?: string;
  whiteListMainAddress?: string;
  whiteListSideAddress?: string;
  curChain?: string;
  rpcUrlAELF?: string;
  rpcUrlTDVV?: string;
  rpcUrlTDVW?: string;
  identityPoolID?: string;
  tsm?: string;
  faucetContractAddress?: string;
  ipfsToS3ImageURL?: string;
}

export interface IUserSettingParams {
  name?: string;
  email?: string;
  twitter?: string;
  instagram?: string;
  bannerImage?: string;
  profileImage?: string;
}

export interface ITokenParams {
  grant_type: string;
  scope: string;
  client_id: string;
  pubkey?: string;
  signature?: string;
  timestamp?: number;
  version?: string;
  accountInfo?: Array<{ chainId: string; address: string }>;
  source: string;
}
export interface IOwnedSymbolsParams extends IListParams {
  address: string;
  seedOwnedSymbol?: string;
}

export interface IOwnedSymbol {
  id: string;
  symbol: string;
  issuer: string;
  isBurnable: boolean;
  createTime: string;
  seedOwnedSymbol: string;
  seedExpTimeSecond: number;
  seedSymbol: string;
  seedExpTime: string;
}

export interface IOwnedSymbolsResponse {
  items: IOwnedSymbol[];
  totalCount: number;
}

export interface ICollectionItemData {
  symbol: string;
  price: number;
  metadata: Array<{
    key: string;
    value: string;
  }>;
}

export interface IRecommendCollectionsRes {
  data: ICollectionItemData[];
}

export interface ISeedItemData {
  symbol: string;
  symbolLength: number;
  seedImage: string;
  seedName: string;
  status: number;
  tokenType: number;
  seedType: number;
  auctionType: number;
  tokenPrice: {
    symbol: string;
    amount: number;
  };
  topBidPrice?: {
    symbol: string;
    amount: number;
  };
  auctionEndTime: number;
  bidsCount: number;
  biddersCount: number;
}

export interface ISpecialSeedRes {
  items: ISeedItemData[];
}

export interface ISpecialSeedParams {
  IsApplyNow?: boolean;
  LiveAuction?: boolean;
  ChainIds?: ['AELF', 'tDVV'];
  SymbolLengthMin?: number;
  SymbolLengthMax?: number;
  TokenTypes?: Array<number>; // ['FT/NFT']; // 0 FT ，1 NFT
  SeedTypes?: Array<number>; // ['Notable/Unique/Regular']; // 0 Unknown, 1 Disable, 2 Notable, 3 Unique, 4 Regular
  PriceMin?: number;
  PriceMax?: number;
  SkipCount?: number;
  MaxResultCount?: number;
}
export interface IBidInfo {
  id: string;
  auctionId: string;
  blockHeight: number;
  seedSymbol: string;
  bidder: string;
  priceAmount: number;
  priceSymbol: string;
  bidTime: number;
  transactionHash: string;
  priceUsdAmount: number;
  priceUsdSymbol: string;
}
export interface IBidInfosResponse {
  totalCount: number;
  items: Array<IBidInfo>;
}

export interface IAuctionInfoResponse {
  id: string;
  seedSymbol: string;
  startPrice: {
    symbol: string;
    amount: number;
  };
  startTime: number;
  endTime: number;
  maxEndTime: number;
  minMarkup: number;
  finishIdentifier: number;
  finishBidder: string;
  finishTime: number;
  duration: number;
  finishPrice: {
    symbol: string;
    amount: number;
  };
  blockHeight: number;
  creator: string;
  receivingAddress: string;
  collectionSymbol: string;
  currentUSDPrice: number;
  currentELFPrice: number;
  minElfPriceMarkup: number;
  minDollarPriceMarkup: number;
  calculatorMinMarkup: number;
}

export interface IMinMarkupPriceResponse {
  elfBidPrice: number;
  dollarBidPrice: number;
  minElfPriceMarkup: number;
  minDollarPriceMarkup: number;
  dollarExchangeRate: number;
  minMarkup: number;
}

export interface ITransactionFeeResponse {
  transactionFee: number;
  transactionFeeOfUsd: number;
}

export interface INftInfoOwnersParams {
  id: string;
  chainId: Chain;
  SkipCount: number;
  MaxResultCount: number;
}

export interface INftInfoOwners {
  address: string;
  fullAddress: string;
  name: string | null;
  profileImage: string | null;
  profileImageOriginal: string | null;
  bannerImage: string | null;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
}

export interface INftInfoOwnersItems {
  owner: INftInfoOwners;
  itemsNumber: number;
}

export interface INftInfoOwnersResponse {
  totalCount: number;
  supply: number;
  chainId: Chain;
  items: INftInfoOwnersItems[];
}

export interface INftSaleInfoItem {
  tokenName: string;
  logoImage: string;
  collectionName: string;
  floorPrice?: number;
  floorPriceSymbol?: string;
  lastDealPrice?: number;
  lastDealPriceSymbol?: string;
  listingPrice?: number;
  maxOfferPrice?: number;
  availableQuantity?: number;
}
export interface INftSaleInfoParams {
  id: string;
  excludedAddress?: string;
}
export interface INftSaleInfoResponse {
  data: INftSaleInfoItem;
}

export enum SocialMediaType {
  tweet = 'tweet',
  discord = 'discord',
  telegram = 'telegram',
  web = 'web',
}

export interface ISocialMedia {
  type: SocialMediaType;
  link: string;
}

export enum DropState {
  'Upcoming',
  'Live',
  'Canceled',
  'End',
}

export interface IDropQuotaResponse {
  dropId: string;
  totalAmount: number;
  claimAmount: number;
  addressClaimLimit: number;
  addressClaimAmount: number;
  state: DropState;
}

export interface IDropDetailInfo {
  dropId: string;
  dropName: string;
  bannerUrl: string;
  logoUrl: string;
  collectionId: string;
  collectionLogo: string;
  collectionName: string;
  introduction: string;
  mintPrice: string;
  mintPriceUsd: string;
  burn: boolean;
  startTime: number;
  expireTime: number;
  socialMedia: ISocialMedia[];
}

export type IDropDetailResponse = IDropDetailInfo & IDropQuotaResponse;
export interface IActionDetail {
  dropId: string;
  dropName: string;
  bannerUrl?: string;
  logoUrl?: string;
  introduction: string;
  mintPrice: number;
  mintPriceUsd?: number;
  startTime: number;
  expireTime: number;
}

export interface IDropListParams {
  pageIndex: number;
  pageSize: number;
  state: number;
}

export interface IDropListRes {
  totalCount: number;
  items: IActionDetail[];
}

export interface ICollectionTraitValue {
  value: string;
  itemsCount: number;
}
export interface ICollectionTraitInfo {
  key: string;
  valueCount: number;
  values: ICollectionTraitValue[];
}
export interface ICollecionTraitsInfoRes {
  totalCount: number;
  id: string;
  items: ICollectionTraitInfo[];
}

export interface ICollecionGenerationInfo {
  generation: number;
  generationItemsCount: number;
}
export interface ICollecionGenerationInfoRes {
  totalCount: number;
  id: string;
  items: ICollecionGenerationInfo[];
}
