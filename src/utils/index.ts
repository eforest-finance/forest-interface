// import { supportedChainId } from 'constants/index';
import EventEmitter from 'events';
import { EXPLORE_URL } from 'constants/url';
import { SupportedELFChainId } from 'constants/chain';
import { store } from 'store/store';
import BigNumber from 'bignumber.js';

export const eventBus = new EventEmitter();

export function shortenAddress(address: string | null, chars = 4): string {
  const parsed = address;
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export function shortenString(address: string | null, chars = 10): string {
  const parsed = address;
  if (!parsed) {
    return '';
  }
  return `${parsed.substring(0, chars)}...${parsed.substring(parsed.length - chars)}`;
}
export function getExploreLink(
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block',
  chainName?: Chain,
): string {
  const target = (chainName && (chainName.toUpperCase() as 'AELF' | 'TDVV' | 'TDVW')) || SupportedELFChainId.MAIN_NET;
  const prefix = EXPLORE_URL[target];
  switch (type) {
    case 'transaction': {
      return `${prefix}tx/${data}`;
    }
    case 'token': {
      return `${prefix}token/${data}`;
    }
    case 'block': {
      return `${prefix}block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}address/${data}`;
    }
  }
}

export const getListByKey = (arr: any[], key: string) =>
  arr.map((item) => {
    return item[key];
  });

export const ellipsisString = (str = '', maxLen: number) => {
  if (str?.length <= maxLen) return str;
  return `${str.slice(0, maxLen)}...`;
};

export enum OmittedType {
  ADDRESS = 'address',
  NAME = 'name',
  CUSTOM = 'custom',
}

export const getOmittedStr = (
  str: string,
  type: OmittedType,
  params?: {
    prevLen: number;
    endLen: number;
    limitLen: number;
  },
) => {
  const defaults: Record<OmittedType, { prevLen: number; endLen: number; limitLen: number }> = {
    [OmittedType.ADDRESS]: { prevLen: 10, endLen: 9, limitLen: 19 },
    [OmittedType.NAME]: { prevLen: 6, endLen: 4, limitLen: 10 },
    [OmittedType.CUSTOM]: { prevLen: 6, endLen: 4, limitLen: 10 },
  };

  const { prevLen, endLen, limitLen } = type === OmittedType.CUSTOM ? params || defaults[type] : defaults[type];

  if (str.length > limitLen) {
    return `${str.slice(0, prevLen)}...${str.slice(-endLen)}`;
  }
  return str;
};

export const addPrefixSuffix = (str: string, ChainId?: string) => {
  if (!str) return str;
  const info = store.getState().aelfInfo.aelfInfo;
  let resStr = str;
  const prefix = 'ELF_';
  const suffix = `_${ChainId || info.curChain}`;
  if (!str.startsWith(prefix)) {
    resStr = `${prefix}${resStr}`;
  }
  if (!str.endsWith(suffix)) {
    resStr = `${resStr}${suffix}`;
  }
  return resStr;
};

export const getfFormatPrice = (price: number | string) => {
  return new BigNumber(price).dividedBy(new BigNumber('10').exponentiatedBy(8));
};

export const getOriginalAddress = (address: string) => {
  if (!address) return '';
  return address.replace(/^ELF_/, '').replace(/_.*$/, '');
};
