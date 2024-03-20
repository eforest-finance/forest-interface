import { SignatureData, SignatureParams, WalletType } from 'aelf-web-login';
import { message } from 'antd';
import { formatErrorMsg } from 'contract/formatErrorMsg';
import { IContractError } from 'contract/type';
import storages from 'storages';
import {
  checkAccountExpired,
  createToken,
  getAccountInfoFromStorage,
  isCurrentPageNeedToken,
  isNeedCheckToken,
} from './token';
import { ICreateTokenParams } from 'types';

export default class WalletAndTokenInfo {
  public static signInfo: SignatureData | null;
  public static walletType: WalletType | null;
  public static walletInfo: WalletInfoType | null;
  public static getSignature: ((params: SignatureParams) => Promise<SignatureData>) | null;
  public static version: string | null;

  public static setSignInfo(data: SignatureData) {
    this.signInfo = data;
  }

  public static setWallet(walletType: WalletType, walletInfo: WalletInfoType, version: string) {
    this.walletInfo = walletInfo;
    this.walletType = walletType;
    this.version = version;
  }

  public static setSignMethod(method: (params: SignatureParams) => Promise<SignatureData>) {
    this.getSignature = method;
  }

  public static getToken(requestPath: string) {
    return new Promise(async (resolve, reject) => {
      if (!isCurrentPageNeedToken()) {
        return resolve(false);
      }

      const accountInfo = getAccountInfoFromStorage();

      if (!isNeedCheckToken(requestPath)) {
        return resolve(accountInfo.token);
      }

      if (!checkAccountExpired(accountInfo, this.walletInfo?.address || '')) {
        return resolve(accountInfo.token);
      }

      if (!(this.getSignature && this.walletInfo && this.walletType && this.version)) {
        return reject();
      }

      const createTokenParams: ICreateTokenParams = {
        signMethod: this.getSignature,
        walletInfo: this.walletInfo,
        walletType: this.walletType,
        version: this.version,
        onError: (error) => {
          const resError = error as unknown as IContractError;
          message.error(formatErrorMsg(resError).errorMessage?.message);
          console.log('=====signResError', resError);
          return reject(resError);
        },
      };

      if (this.signInfo) {
        createTokenParams.signInfo = this.signInfo;
      }

      const res = await createToken(createTokenParams);

      if (res) {
        localStorage.setItem(storages.accountInfo, JSON.stringify(res));
        return resolve(res.token);
      }
      return reject();
    });
  }

  public static reset() {
    this.signInfo = null;
    this.walletInfo = null;
    this.walletType = null;
    this.getSignature = null;
    this.version = null;
  }
}
