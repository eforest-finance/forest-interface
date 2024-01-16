import { INftInfo, IListingNftInfo, From, To } from 'types/nftTypes';

export type FormatListingType = {
  price: number;
  quantity: number;
  expiration: string;
  fromName: string;
  ownerAddress: string;
  whitelistHash: string | null;
  purchaseToken: { symbol: string };
  key: string;
  decimals: number;
  startTime: number;
  endTime: number;
};

export type FormatOffersType = {
  expireTime: number;
  key: string;
  token: { symbol: string; id: number };
  decimals: number;
  price: number;
  quantity: number;
  expiration: string;
  from: From | null;
  to: To | null;
  nftInfo: IListingNftInfo | null;
};

export type ItemState = {
  nftInfo: INftInfo | null;
  listings: FormatListingType[] | null;
  offers: FormatOffersType[] | null;
  pageRefreshCount: number;
};

export interface IRangInputState {
  min?: string;
  max?: string;
}

export interface IToolItemInstance<T> {
  getState: () => T;
  onSetState: (v: IRangInputState) => void;
}

export interface IPaginationPage {
  pageSize: number;
  page: number;
}
export type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  supportChains: Chain | null;
  supportTokens: Token | null;
  userInfo: UserInfoType | null;
  theme: string | undefined | null;
  sideChain: 'tDVV' | 'tDVW';
};
