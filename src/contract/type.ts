import BigNumber from 'bignumber.js';

export interface ICreateParams {
  symbol: string;
  tokenName: string;
  totalSupply: number | string;
  decimals: number;
  issuer: string;
  isBurnable: boolean;
  issueChainId: string | number;
  memo?: string;
  to?: string;
  lockWhiteList?: string[];
  externalInfo: {
    value: {
      __nft_description: string;
      __nft_external_link: string;
      __nft_metadata?: string;
    };
  };
}

export interface ICreateCollectionParams extends Omit<ICreateParams, 'externalInfo'> {
  owner: string;
  seedSymbol: string;
  amount: number;
  externalInfo: {
    value: {
      __nft_file_hash: string;
      __nft_feature_hash?: string;
      __nft_payment_tokens?: string[];
      __nft_description: string;
      __nft_external_link: string;
      __nft_featured_url: string;
      __nft_file_url: string;
      __nft_metadata?: string;
      __nft_image_url?: string;
    };
  };
}

export type IManagerTokenParams = Omit<ICreateCollectionParams, 'to'>;

export interface ICreateItemsParams extends Omit<ICreateParams, 'externalInfo'> {
  owner: string;
  externalInfo: {
    value: {
      __nft_file_hash: string;
      __nft_description: string;
      __nft_external_link: string;
      __nft_file_url: string;
      __nft_fileType: string;
      __nft_metadata?: string;
      __nft_preview_image?: string;
      __nft_image_url?: string;
    };
  };
}

export interface IIssuerParams {
  symbol: string;
  amount: number;
  memo: string;
  to: string;
}

export interface IGetBalanceParams {
  symbol: string;
  owner: string;
}

export interface IGetTokenInfoParams {
  symbol: string;
}

export interface IPrice {
  symbol: string;
  amount: number;
}

export interface IMakeOfferParams {
  symbol: string;
  offerTo?: null | string;
  quantity: number;
  expireTime: {
    seconds: string;
    nanos: number;
  };
  price: IPrice;
}

export interface IDealParams {
  symbol: string;
  offerFrom?: null | string;
  quantity: number;
  price: IPrice;
}

export interface IDelistParams {
  symbol: string;
  quantity: number;
  price: IPrice;
  startTime: ITimestamp;
}

export interface ICancelOfferItemParams {
  offerTo?: null | string;
  expireTime: {
    seconds: string;
    nanos: number;
  };
  price: IPrice;
}

export interface ICancelOfferParams {
  symbol: string;
  cancelOfferList: ICancelOfferItemParams[];
  offerFrom?: null | string;
  isCancelBid?: boolean;
}

export interface ITransferParams {
  to: string;
  symbol: string;
  amount: number;
  memo?: string;
}

export interface IGetAllowanceParams {
  symbol: string;
  owner: string;
  spender: string;
}

export enum ContractMethodType {
  SEND,
  VIEW,
}

export interface IContractOptions {
  chain?: Chain | null;
  type?: ContractMethodType;
}

export interface IGetAllowanceResponse {
  symbol: string;
  owner: string;
  spender: string;
  allowance: number;
}

export interface IContractError extends Error {
  code?: number;
  error?:
    | number
    | string
    | {
        message?: string;
      };
  errorMessage?: {
    message: string;
    name?: string;
    stack?: string;
  };
  Error?: string;
  from?: string;
  sid?: string;
  result?: {
    TransactionId?: string;
    transactionId?: string;
  };
  TransactionId?: string;
  transactionId?: string;
  value?: any;
}

export interface IApproveParams {
  spender: string;
  symbol: string;
  amount: number;
}

export interface ITagInfo {
  tagName: string;
  info?: string;
}

export interface IGetExtraInfoByTagInput {
  whitelistId: string;
  projectId: string;
  tagInfo: ITagInfo;
}

export interface IGetWhitelistIdResponse {
  whitelistId: string;
  projectId: string;
}

export interface IGetWhitelistIdParams {
  symbol: string;
  address: string;
}

export interface ITimestamp {
  seconds: number;
  nanos: number;
}

export interface IListDuration {
  startTime: ITimestamp;
  publicTime: ITimestamp;
  durationHours?: number;
  durationMinutes: number;
}

export interface IListWithFixedPriceParams {
  symbol: string;
  price: IPrice;
  quantity?: number;
  duration: IListDuration;
  whitelists: {
    whitelists: {
      priceTag: {
        tagName: string;
        price: {
          amount: BigNumber;
          symbol?: string | undefined;
        };
      };
      addressList: {
        value: string[] | undefined;
      };
    }[];
  } | null;
  isWhitelistAvailable: boolean;
}

export interface IGetTotalOfferAmountParams {
  address: string;
  priceSymbol: string;
}

export interface IGetTotalEffectiveListedNFTAmountParams {
  symbol: string;
  address: string;
}

export enum ListType {
  NOT_LISTED,
  FIXED_PRICE,
  ENGLISH_AUCTION,
  DUTCH_AUCTION,
}

export interface IListedNFTInfo {
  symbol: string;
  owner: string;
  quantity: number;
  listType: ListType;
  price: IPrice;
  duration: IListDuration;
}

export interface IAddressList {
  value: string[];
}

export interface IExtraInfoId {
  addressList: IAddressList;
  id?: string;
}

export interface IExtraInfoIdList {
  value?: IExtraInfoId[];
}

export enum Strategy {
  Basic = 0,
  Price = 1,
  Customize = 2,
}

export interface IWhitelistInfo {
  whitelistId: string;
  projectId: string;
  extraInfoIdList: IExtraInfoIdList;
  isAvailable: boolean;
  isCloneable: boolean;
  remark: string;
  cloneFrom: string;
  creator: string;
  manager: IAddressList;
  strategyType: Strategy;
}

export interface IRemoveInfoFromWhitelistParams {
  whitelistId: string;
  addressList: IAddressList;
}

export interface IAddAddressInfoListToWhitelistParams {
  whitelistId: string;
  extraInfoIdList?: IExtraInfoIdList;
}

export interface IUpdateExtraInfoParams {
  whitelistId: string;
  extraInfoList: IExtraInfoId;
}

export interface IRemoveTagInfoParams {
  whitelistId: string;
  projectId: string;
  tagId: string;
}

export interface IAddExtraInfoParams {
  whitelistId: string;
  projectId: string;
  tagInfo: ITagInfo;
  addressList: IAddressList;
}

export interface IResetWhitelistParams {
  whitelistId: string;
  projectId: string;
}

export interface ISendResult {
  TransactionId: string;
  TransactionResult: string;
}

export interface IGetProxyAccountByProxyAccountAddressRes {
  createChainId: number;
  managementAddresses: {
    address: string;
  }[];
  proxyAccountHash: string;
}

export interface IForwardCallParams {
  proxyAccountHash: string;
  contractAddress: string;
  methodName: string;
  args: any;
}

export interface IAuctionParams {
  auctionId: string;
  amount: number;
}

export interface IFixPriceList {
  offerTo: string;
  quantity: number;
  price: IPrice;
  startTime: ITimestamp;
}

export interface IBatchBuyNowParams {
  symbol: string;
  fixPriceList: IFixPriceList[];
}

export enum BatchDeListType {
  LESS_THAN = 0,
  LESS_THAN_OR_EQUALS = 1,
  GREATER_THAN = 2,
  GREATER_THAN_OR_EQUALS = 3,
  EQUAL = 'EQUAL',
}

export interface IBatchDeListParams {
  symbol: string;
  price: IPrice;
  batchDelistType: BatchDeListType;
}
