import { TSignatureParams, TWalletInfo, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

import { TipsMessage } from 'constants/message';
import { needCheckTokenUrl } from 'constants/token';
import storages from 'storages';
import { IAccountInfo, ICreateTokenParams } from 'types';
import WalletAndTokenInfo from './walletAndTokenInfo';
import { getOriginalAddress } from 'utils';
import { fetchToken } from 'api/fetch';
import { ITokenParams } from 'api/types';
import { sleep } from '@portkey/utils';
import deleteProvider from '@portkey/detect-provider';
import { TelegramPlatform } from '@portkey/did-ui-react';
import qs from 'qs';

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
  let url = requestPath;
  if (requestPath && requestPath[0] === '/') {
    url = requestPath.substring(1);
  }
  if (needCheckTokenUrl.includes(url)) {
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
  const { signMethod, walletInfo, walletType, signInfo, onError } = props;
  const timestamp = Date.now();

  let sign = null;

  if (!signInfo) {
    try {
      if (walletType === WalletTypeEnum.discover) {
        const signStr = `signature: ${walletInfo?.address}-${timestamp}`;
        const hexDataStr = `${TipsMessage.SignTip}\n\n${signStr}`;
        const hexData = Buffer.from(hexDataStr).toString('hex');

        const provider: any = await deleteProvider({
          providerName: 'Portkey',
        });

        const signature = await provider.request({
          method: 'wallet_getManagerSignature',
          payload: { hexData },
        });

        if (!signature || signature.recoveryParam == null) return;
        const signatureStr = [
          signature.r.toString(16, 64),
          signature.s.toString(16, 64),
          `0${signature.recoveryParam.toString()}`,
        ].join('');
        sign = { signature: signatureStr, error: 0, errorMessage: '', from: '' };
      } else {
        sign = await signMethod({
          appName: 'forest',
          address: walletInfo?.address || '',
          signInfo: AElf.utils.sha256(TipsMessage.SignTip),
        });
      }
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
  if (walletType === WalletTypeEnum.elf) {
    extraParam = {
      pubkey: walletInfo?.extraInfo.publicKey,
      source: 'nightElf',
    };
  }

  console.log(WalletTypeEnum.aa, WalletTypeEnum.discover, walletType);

  if (walletType === WalletTypeEnum.discover) {
    const accounts = walletInfo.extraInfo.accounts;
    const accountInfo = Object.keys(accounts).map((key) => {
      return {
        chainId: key,
        address: getOriginalAddress(accounts[key][0]),
      };
    });
    // const accountInfo = accounts.map(([chainId, address]) => ({
    //   chainId,
    //   address: getOriginalAddress(walletType === WalletTypeEnum.aa ? address : (address as Array<any>)[0]),
    // }));

    extraParam = {
      source: 'portkey',
      accountInfo: JSON.stringify(accountInfo),
    };
  }

  if (walletType === WalletTypeEnum.aa) {
    const accounts = walletInfo.extraInfo.portkeyInfo.accounts;
    const accountInfo = Object.keys(accounts).map((key) => {
      return {
        chainId: key,
        address: getOriginalAddress(accounts[key]),
      };
    });
    // const accountInfo = accounts.map(([chainId, address]) => ({
    //   chainId,
    //   address: getOriginalAddress(walletType === WalletTypeEnum.aa ? address : (address as Array<any>)[0]),
    // }));

    if (TelegramPlatform.isTelegramPlatform()) {
      const data: any = TelegramPlatform.getInitData();
      const startParams = data?.start_param || '';

      const paramsInfo = startParams.split('__').reduce((acc: Record<string, string>, item: string) => {
        const key = item.split('--')?.[0] || '';
        const value = item.split('--')?.[1];
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const telegram: any = TelegramPlatform.getInitData();
      const { username } = JSON.parse(telegram?.user);

      extraParam = {
        source: 'portkey',
        accountInfo: JSON.stringify(accountInfo),
        invite_from: paramsInfo.address,
        invite_type: paramsInfo.type,
        nick_name: username,
      };
    } else {
      extraParam = {
        source: 'portkey',
        accountInfo: JSON.stringify(accountInfo),
      };
    }
  }

  try {
    const res = await loopFetchToken({
      grant_type: 'signature',
      scope: 'NFTMarketServer',
      client_id: 'NFTMarketServer_App',
      timestamp,
      version: 'v2',
      signature: sign?.signature,
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
    const logout = (window as any).logout;
    logout && logout({ noModal: true });
  }
  return undefined;
};

async function loopFetchToken(params: ITokenParams, loopsNum = 10) {
  try {
    const res = await fetchToken(params);
    return res;
  } catch (error) {
    if (loopsNum < 1) {
      throw error;
    } else {
      await sleep(1000);
      return loopFetchToken(params, --loopsNum);
    }
  }
}
