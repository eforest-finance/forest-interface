import { SignatureData, SignatureParams, WalletType, DiscoverInfo, PortkeyInfo } from 'aelf-web-login';

export interface RoutesProps {
  path: string;
  exact?: boolean;
  strict?: boolean;
  element: React.ComponentType<any>;
  authComp?: React.ComponentType<any>;
}
export type ChainType = 'ERC' | 'ELF';

export interface IAccountInfo {
  account?: string;
  token?: string;
  expirationTime?: number;
}

export interface ICreateTokenParams {
  signMethod: (params: SignatureParams) => Promise<SignatureData>;
  walletInfo: WalletInfoType;
  walletType: WalletType;
  version: string;
  onError?: <T>(error: T) => void;
  signInfo?: SignatureData;
}

export type WalletInfoType = {
  address: string;
  publicKey?: string;
  token?: string;
  aelfChainAddress?: string;
  discoverInfo?: DiscoverInfo;
  portkeyInfo?: PortkeyInfo;
};
