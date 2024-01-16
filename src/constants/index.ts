import { MAX_RESULT_COUNT_10 } from './common';

export interface WalletInfo {
  // connector?: AbstractConnector | string;
  connector?: string;
  name: string;
  icon: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const CHAIN_ID_VALUE = {
  tDVW: 1931928,
  tDVV: 1866392,
  AELF: 9992731,
};

export const currentRpcUrl = {
  AELF: 'rpcUrlAELF',
  tDVW: 'rpcUrlTDVW',
  tDVV: 'rpcUrlTDVV',
};

export const NetworkContextName = 'NETWORK';

export const BadgeNFTSymbol = 'BA994198147';

export const cmsUrl = process.env.REACT_APP_CMS_ORIGIN;

export const DEFAULT_PAGE_SIZE = MAX_RESULT_COUNT_10;

export const DEFAULT_CELL_WIDTH = 120;
