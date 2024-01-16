declare type ChainValue = { label: 'AELF' | 'tDVV' | 'tDVW'; value: string };
declare type Chain = 'AELF' | 'tDVV' | 'tDVW';
declare type Token = { [label: string]: { label: string; value: string; decimals: number; address: string } };

declare type UserInfoType = {
  id: string;
  address: string;
  fullAddress: string;
  name: string;
  profileImage: string;
  bannerImage: string;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
  token?: string;
  [key: string]: string | null;
};

declare type InfoStateType = {
  isMobile?: boolean;
  isSmallScreen?: boolean;
  showDisconnectTip?: false;
  supportChains: Chain | null;
  supportTokens: Token | null;
  userInfo: UserInfoType | null;
  theme: string | undefined | null;
  sideChain: 'tDVV' | 'tDVW';
  loading: {
    open: boolean;
  };
  hasToken: boolean;
};

declare type WalletInfoType = {
  address: string;
  publicKey?: string;
  token?: string;
  discoverInfo?: DiscoverInfo;
  portkeyInfo?: PortkeyInfo;
  aelfChainAddress?: string;
};
