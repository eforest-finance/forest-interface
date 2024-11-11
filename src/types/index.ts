import { SignatureData, SignatureParams, DiscoverInfo, PortkeyInfo } from 'aelf-web-login';
import { WalletTypeEnum, TWalletInfo } from '@aelf-web-login/wallet-adapter-base';

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
  walletInfo: TWalletInfo;
  walletType: WalletTypeEnum;
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
