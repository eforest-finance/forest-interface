import { webLoginInstance } from './webLogin';
import {
  ContractMethodType,
  IBatchCreateNFTParams,
  IContractError,
  IContractOptions,
  IForwardCallParams,
  IGetProxyAccountByProxyAccountAddressRes,
  ISendResult,
} from './type';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { SupportedELFChainId } from 'constants/chain';
import { formatErrorMsg } from './formatErrorMsg';

const proxyContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  console.log('=====proxyContractRequest method: ', method);
  // console.log('=====proxyContractRequest type: ', options?.type);

  const info = store.getState().aelfInfo.aelfInfo;

  try {
    const addressList = {
      main: info?.proxyMainAddress,
      side: info?.proxySideAddress,
    };

    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;

    // const address = info?.proxyMainAddress;
    // const curChain = SupportedELFChainId.MAIN_NET; // proxy is only on main net

    console.log('=====proxyContractRequest address: ', address);
    console.log('=====proxyContractRequest curChain: ', curChain);
    console.log('=====proxyContractRequest params: ', params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res.data as unknown as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });
      const result = res as unknown as IContractError;
      console.log('=====proxyContractRequest result: ', result);
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId as string, curChain);
      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====proxyContractRequest error:', JSON.stringify(error));
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError));
  }
};

export const GetProxyAccountByProxyAccountAddress = async (
  address: string,
  chain?: Chain,
): Promise<IGetProxyAccountByProxyAccountAddressRes> => {
  try {
    const res: IGetProxyAccountByProxyAccountAddressRes | ISendResult = (await proxyContractRequest(
      'GetProxyAccountByProxyAccountAddress',
      address,
      {
        chain,
        type: ContractMethodType.VIEW,
      },
    )) as IGetProxyAccountByProxyAccountAddressRes;
    return Promise.resolve(res);
  } catch (_) {
    return Promise.reject(null);
  }
};

export const ForwardCall = async (params: IForwardCallParams, chain?: Chain): Promise<ISendResult> => {
  try {
    const res: ISendResult = await proxyContractRequest('ForwardCall', params, {
      chain,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const BatchCreateNFT = async (params: IBatchCreateNFTParams, chain?: Chain): Promise<ISendResult> => {
  try {
    const res: ISendResult = await proxyContractRequest('BatchCreateNFT', params, {
      chain,
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
