import { WalletType } from 'aelf-web-login';
import { TipsMessage } from 'constants/message';
import { needCheckTokenUrl } from 'constants/token';
import storages from 'storages';
import { IAccountInfo, ICreateTokenParams } from 'types';
import WalletAndTokenInfo from './walletAndTokenInfo';
import { getOriginalAddress } from 'utils';
import { fetchToken } from 'api/fetch';
import { ITokenParams } from 'api/types';
const AElf = require('aelf-sdk');

export const isCurrentPageNeedToken = (): boolean => {
  if (['/term-service', '/privacy-policy'].includes(window.location.pathname)) {
    return false;
  }
  return true;
};

export const getAccountInfoFromStorage = (): IAccountInfo => {
  const accountInfo = JSON.parse(localStorage.getItem(storages.accountInfo) || '{}');
  return accountInfo;
};

export const isNeedCheckToken = (requestPath: string): boolean => {
  if (needCheckTokenUrl.includes(requestPath)) {
    return true;
  }
  return false;
};

export const checkAccountExpired = (accountInfo: IAccountInfo, address: string): boolean => {
  if (
    accountInfo?.token &&
    accountInfo?.expirationTime &&
    Date.now() < accountInfo?.expirationTime &&
    accountInfo.account === address
  ) {
    return false;
  }
  return true;
};

export const createToken = async (
  props: ICreateTokenParams,
): Promise<
  | {
      account: string;
      token: string;
      expirationTime: number;
    }
  | undefined
> => {
  const { signMethod, walletInfo, walletType, signInfo, onError, version } = props;

  const timestamp = Date.now();

  let sign = null;

  if (!signInfo) {
    try {
      sign = await signMethod({
        appName: 'forest',
        address: walletInfo?.address || '',
        signInfo: walletType === WalletType.portkey ? AElf.utils.sha256(TipsMessage.SignTip) : TipsMessage.SignTip,
      });
    } catch (error) {
      onError?.(error);
      return;
    }
    if (sign?.error) {
      onError?.(sign);
      return;
    }
    if (sign) {
      WalletAndTokenInfo.setSignInfo(sign);
    }
  } else {
    sign = signInfo;
  }

  let extraParam = {};
  if (walletType === WalletType.elf) {
    extraParam = {
      pubkey: walletInfo?.publicKey,
      source: 'nightElf',
    };
  }
  if (walletType === WalletType.portkey || walletType === WalletType.discover) {
    const accounts = Object.entries(
      (walletInfo?.portkeyInfo || walletInfo?.discoverInfo || { accounts: {} })?.accounts,
    );
    const accountInfo = accounts.map(([chainId, address]) => ({
      chainId,
      address: getOriginalAddress(walletType === WalletType.portkey ? address : (address as Array<any>)[0]),
    }));

    extraParam = {
      source: 'portkey',
      accountInfo: JSON.stringify(accountInfo),
    };
  }

  try {
    const res = await fetchToken({
      grant_type: 'signature',
      scope: 'NFTMarketServer',
      client_id: 'NFTMarketServer_App',
      timestamp,
      version: version === 'v1' ? 'v1' : 'v2',
      signature: sign!.signature,
      ...extraParam,
    } as ITokenParams);
    const tokenRes = {
      account: walletInfo?.address,
      token: res.access_token,
      expirationTime: timestamp + res.expires_in * 1000,
    };
    return tokenRes;
  } catch (error) {
    console.error('fetchToken err:', error);
  }
  return undefined;
};
