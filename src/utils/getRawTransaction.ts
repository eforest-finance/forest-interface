import { TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

import { WalletInfoType } from 'types';
import { getRawTransactionPortkey } from './getRawTransactionPortkey';
import { getRawTransactionDiscover } from './getRawTransactionDiscover';
import { getRawTransactionNightELF } from './getRawTransactionNightELF';

export interface IRowTransactionPrams {
  walletInfo: WalletInfoType;
  walletType: any;
  params: any;
  methodName: string;
  contractAddress: string;
  caContractAddress: string;
  rpcUrl: string;
  chainId: Chain;
}

export const getRawTransaction: (params: IRowTransactionPrams) => Promise<string | null> = async ({
  walletInfo,
  contractAddress,
  caContractAddress,
  methodName,
  walletType,
  params,
  rpcUrl,
  chainId,
}: IRowTransactionPrams) => {
  console.log('getRawTransaction params', rpcUrl, methodName, chainId, walletType);
  if (!rpcUrl || !chainId) return Promise.reject('');

  let res = null;

  try {
    switch (walletType) {
      case WalletTypeEnum.aa:
        if (!walletInfo.portkeyInfo) return Promise.reject('');
        res = await getRawTransactionPortkey({
          caHash: walletInfo.portkeyInfo.caInfo.caHash,
          privateKey: walletInfo.portkeyInfo.walletInfo.privateKey,
          contractAddress,
          caContractAddress,
          rpcUrl,
          params,
          methodName,
        });
        break;
      case WalletTypeEnum.discover:
        if (!walletInfo.discoverInfo) return Promise.reject('');
        res = await getRawTransactionDiscover({
          contractAddress,
          caAddress: walletInfo.discoverInfo.address,
          caContractAddress,
          rpcUrl,
          params,
          methodName,
        });
        break;
      case WalletTypeEnum.elf:
        res = await getRawTransactionNightELF({
          contractAddress,
          params,
          chainId,
          account: walletInfo.address,
          methodName,
          rpcUrl,
        });
        break;
    }

    return res;
  } catch (error) {
    console.log('getRawTransaction error', error);
    return Promise.reject(error);
  }
};
