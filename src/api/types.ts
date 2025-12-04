import { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import { IManagerItem } from 'store/reducer/saleInfo/type';
import { IListingType, ITraitInfo } from 'types/nftTypes';

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
  searchParam: string;
  chainId?: Chain;
  symbol?: string;
  skipCount?: number;
  maxResultCount?: number;
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
  chainId?: string;
  nftInfoId: string;
  type: number;
  from?: IFrom | null;
  to?: ITo | null;
  amount: number;
  price: number;
  priceToken: IPriceToken | null;
  purchaseToken?: IPriceToken | null;
  id: string;
  transactionHash: string;
  timestamp: number;
  nftCollectionName: string;
  collectionName: string;
  nftName: string;
  previewImage: string;
  nftUrl?: string;
  key?: string | number;
  nftSymbol?: string;
  expireTime?: number;
  toAddress?: string;
  quantity?: number;
  startTime?: number;
  originQuantity?: number;
  decimals: number;
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
  SymbolTypeList: number[];
  SkipCount: number;
  Sorting: string;
  generation: number[];
  RarityList: string[];
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
  ipfsToSchrodingerURL?: string;
}

export interface IBanner {
  src?: string;
  title: string;
  link: string;
  target: string;
  poster: string;
}

export interface IBannerItem {
  src: string;
  link: string;
  title: string;
  description?: string;
  type?: 'image' | 'video';
  name: string;
  poster: string;
  buttonTitle: string;
  target?: '_blank' | '_self';
}

export interface IBannerResponse {
  data: Array<IBannerItem>;
}

export interface IUserSettingParams {
  name?: string;
  email?: string;
  twitter?: string;
  instagram?: string;
  bannerImage?: string;
  profileImage?: string;
  userUpdateType?: number;
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
  invite_from?: string;
  invite_type?: string;
  nick_name?: string;
}
export interface IOwnedSymbolsParams extends IListParams {
  address: string;
  seedOwnedSymbol?: string;
}

export interface IOwnedAllSymbolsParams extends IListParams {
  addressList: string[];
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
  chainId?: Chain;
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

export interface ICollectionRarityInfo {
  rarity: string;
}
export interface ICollectionRarityInfoRes {
  totalCount: number;
  id: string;
  items: ICollectionRarityInfo[];
}

export interface INftRankingInfoParams {
  address: string;
  catsTraits: string[][][][];
}

export interface IRankData {
  rank: number;
  total: number;
  probability: string;
  percent: string;
  traitsProbability?: {
    [key: string]: number | string;
  };
}
export interface INftRankingInfo {
  rankGenOne: IRankData;
  rankTwoToNine: IRankData;
  rank: IRankData;
}

export interface INftTraitsInfoRes {
  generation: number;
  id: string;
  traitInfos: ITraitInfo[];
}

export interface ICollectionActivitiesParams {
  ChainList: Chain[];
  CollectionType: string;
  CollectionId: string;
  Type: number[];
  SkipCount: number;
  MaxResultCount: number;
  generation: number[];
  RarityList: string[];
  traits: Array<{
    key: string;
    values: string[];
  }>;
}

export interface ICollectionActivitiesRes {
  totalCount: number;
  items: IActivitiesItem[];
}

export interface IHotNFT {
  describe: string | null;
  collectionName: string;
  collectionSymbol: string;
  collectionImage: string;
  collectionId: string;
  nftName: string;
  nftSymbol: string;
  previewImage: string;
  nftId: string;
  latestDealPrice: number;
  offerPrice: number;
  price: number;
  link?: string;
  chainId: string;
  id: string;
  rarity?: string;
  level?: string;
}

export interface IHotNFTsRes {
  items: IHotNFT[];
}

export interface ICreateArt {
  promt: string;
  negativePrompt: string;
  model: string;
  quality?: string;
  style?: string;
  size: string;
  number: string;
  paintingStyle: string;
}

export interface IGenerateParams {
  rawTransaction: string;
  chainId: string;
}

export interface IAIImage {
  url: string;
  hash: string;
}

export interface IGenerateRes {
  totalCount: number;
  items: IAIImage[];
}

export interface ICreateAIArtResult {
  canRetry: boolean;
  transactionId: string;
  success: boolean;
  errorMsg: string;
  totalCount: number;
  isSensitive: boolean;
  items: IAIImage[];
}
export interface IFailedAIArt {
  aiPaintingStyleType: string;
  size: string;
  quality: string;
  number: number;
  transactionId: string;
  negativePrompt: string;
  prompt: string;
}

export interface IFailedAIArtRes {
  totalCount: number;
  items: IFailedAIArt[];
}

export interface IMessage {
  id: string;
  title: string;
  body: string;
  singlePrice: string;
  totalPrice: string;
  amount: number;
  image: string;
  status: number;
  businessId: string;
  secondLevelType: string;
  ctime: string;
}

export interface IMessageListRes {
  totalCount: number;
  items: IMessage[];
}

export interface IMyHold {
  skipCount: number;
  maxResultCount: number;
  address: string;
  keyWord: string;
  queryType: string;
}

export interface CollectionHoldItem {
  chainId: Chain;
  symbol: string;
  tokenName: string;
  logoImage: string;
  itemTotal: number;
  floorPrice: number;
  floorPriceSymbol: string;
}

export interface IMyHoldSearch {
  collectionIds?: string[];
  chainList?: string[];
  hasListingFlag?: boolean;
  hasAuctionFlag?: boolean;
  hasOfferFlag?: boolean;
  sorting: string;
  priceLow?: number;
  priceHigh?: number;
  skipCount: number;
  maxResultCount: number;
  address: string;
  keyWord: string;
  queryType: string;
}

export interface NFTHoldItem {
  collectionSymbol?: string[];
  nftSymbol?: string[];
  previewImage?: boolean;
  priceDescription?: boolean;
  price?: boolean;
  tokenName: string;
  issueChainIdStr?: number;
  chainIdStr?: number;
  fileExtension: number;
  generation: number;
  traitPairsDictionary: string[];
  listingPrice: number;
  listingPriceCreateTime: string;
  offerPrice: number;
  latestDealPrice: number;
  allOwnerCount: number;
  realOwner: {
    address: string;
    name: string;
    aelfAddress: string;
    profileImage: string;
    email: string;
    twitter: string;
    instagram: string;
    id: string;
  };
  rank: string;
  level: string;
  grade: string;
  star: string;
  rarity: string;
  describe: string;
  id: string;
}

export interface IMyHoLdCollectionRes {
  totalCount: number;
  items: CollectionHoldItem[];
}

export interface TrendingCollectionItem {
  chainId: string;
  symbol: string;
  tokenName: string;
  logoImage: string;
  previewImage: string;

  floorPrice: number;
  floorChange: number;
  floorPriceSymbol: string;
  volumeTotal: number;
  volumeTotalChange: number;
  collectionName: string;
  id: string;
}

export interface ITrendingCollectionsRes {
  totalCount: number;
  items: TrendingCollectionItem[];
}

export interface IMyHoldSearchRes {
  totalCount: number;
  items: NFTHoldItem[];
}

export interface IActivitySearch {
  collectionIdList?: string[];
  chainList?: string[];
  traits?: {
    key: string;
    value: string;
  }[];
  type: string[];
  skipCount: number;
  maxResultCount: number;
  address: string;
  hasListingFlag?: boolean;
  hasAuctionFlag?: boolean;
  hasOfferFlag?: boolean;
  sorting: string;
  priceLow?: number;
  priceHigh?: number;
  keyWord: string;
  queryType: string;
}

export interface ActivityNFTItem {
  nftInfoId: string;
  type: number;
  from: {
    address: string;
    aelfAddress: string;
    caHash: string;
    name: string;
    profileImage: string;
    email: string;
    twitter: string;
    instagram: string;
    id: string;
  };
  to: {
    address: string;
    aelfAddress: string;
    caHash: string;
    name: string;
    profileImage: string;
    email: string;
    twitter: string;
    instagram: string;
    id: string;
  };
  amount: number;
  priceToken: string;
  symbol: string;
  collectionName: string;
  totalPrice: number;
  nftUrl: string;
  nftName: string;
  id: string;
  collectionSymbol?: string[];
  nftSymbol?: string[];
  previewImage?: boolean;
  priceDescription?: boolean;
  price?: number;
  tokenName: string;
  issueChainIdStr?: number;
  chainIdStr?: number;
  fileExtension: number;
  generation: number;
  traitPairsDictionary: string[];
  listingPrice: number;
  listingPriceCreateTime: string;
  offerPrice: number;
  latestDealPrice: number;
  allOwnerCount: number;
  rank: string;
  level: string;
  grade: string;
  star: string;
  rarity: string;
  describe: string;
}

export interface IActivitySearchRes {
  totalCount: number;
  items: ActivityNFTItem[];
}

export interface IOfferMadeParams {
  skipCount?: number;
  maxResultCount?: number;
  address?: string;
  collectionIdList?: string[];
  chainList?: string[];
  traits?: {
    key?: string;
    value?: string;
  }[];
}

export interface OfferMadeItem {
  nftInfoId: string;
  nftCollectionName: string;
  type: number;
  chainId: string;
  fromAddress: string;
  toAddress: string;
  floorPrice: number;
  floorPriceSymbol: string;
  quantity: number;
  nftInfo: string;
  purchaseToken: {
    chainId: string;
    address: string;
    symbol: string;
    decimals: number;
    id: string;
  };
  from: {
    address: string;
    aelfAddress: string;
    caHash: string;
    name: string;
    profileImage: string;
    email: string;
    twitter: string;
    instagram: string;
    id: string;
  };
  to: {
    address: string;
    aelfAddress: string;
    caHash: string;
    name: string;
    profileImage: string;
    email: string;
    twitter: string;
    instagram: string;
    id: string;
  };
  amount: number;
  priceToken: string;
  symbol: string;
  collectionName: string;
  totalPrice: number;
  nftUrl: string;
  nftName: string;
  id: string;
  collectionSymbol?: string[];
  nftSymbol?: string[];
  previewImage?: string;
  priceDescription?: boolean;
  price?: number;
  tokenName: string;
  issueChainIdStr?: number;
  chainIdStr?: number;
  fileExtension: number;
  generation: number;
  traitPairsDictionary: string[];
  listingPrice: number;
  listingPriceCreateTime: string;
  offerPrice: number;
  latestDealPrice: number;
  allOwnerCount: number;
  rank: string;
  level: string;
  grade: string;
  star: string;
  rarity: string;
  describe: string;
}

export interface IOfferMadeItemRes {
  totalCount: number;
  items: OfferMadeItem[];
}

export interface IReceivedOfferParams {
  skipCount: number;
  maxResultCount: number;
  address: string;
  collectionIdList?: string[];
  chainList?: string[];
  traits?: {
    key: string;
    value: string;
  }[];
}

export interface ICreatePlatformParams {
  NFTUrl: string;
  NFTName: string;
  urlHash: string;
}

export interface ICreatePlatformRes {
  collectionSymbol: string;
  collectionId: string;
  nftSymbol: string;
  nftId: string;
  collectionIcon: string;
}

export interface UserData {
  id: string;
  address: string;
  nickName: string | null;
  totalPoints: number;
  waterInfo: WaterInfo;
  treeInfo: TreeInfo;
  pointsDetails: PointsDetail[];
}

export interface WaterInfo {
  current: number;
  updateTime: number;
  max: number;
  produce: number;
  frequency: number;
  wateringIncome: number;
  timeUnit: number;
}

export interface TreeInfo {
  current: LevelInfo;
  next: LevelInfo;
  nextLevelCost: number;
}

export interface LevelInfo {
  level: number;
  levelTitle: string;
  produce: number;
  frequency: number;
  timeUnit: number;
  minPoints: number;
}

export interface PointsDetail {
  id: string;
  address: string;
  type: number;
  amount: number;
  updateTime: number;
  remainingTime: number;
  claimLimit: number;
  timeUnit: number;
}

export interface Activity {
  id: string;
  originId: string;
  imageUrl: string;
  activityName: string;
  activityDesc: string;
  rewardName: string;
  totalReward: number;
  leftReward: number;
  redeemRewardOnce: number;
  redeemType: number;
  minPoints: number;
  costPoints: number;
  rewardLogo: string;
  rewardType: number;
  treeActivityStatus: number;
  hideFlag: boolean;
  beginDateTime: string;
  createTime: string;
  lastModifyTime: string;
  frequency: number;
  canClaim: boolean;
}
