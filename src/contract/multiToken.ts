import { webLoginInstance } from './webLogin';
import {
  ContractMethodType,
  IApproveParams,
  IContractError,
  IContractOptions,
  ICreateParams,
  IGetAllowanceParams,
  IGetAllowanceResponse,
  IGetBalanceParams,
  IGetTokenInfoParams,
  IIssuerParams,
  ISendResult,
  ITransferParams,
} from './type';
import { SupportedELFChainId } from 'constants/chain';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { formatErrorMsg } from './formatErrorMsg';

const multiTokenContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().aelfInfo.aelfInfo;

  const addressList = {
    main: info?.mainChainAddress,
    side: info?.sideChainAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;

    console.log('=====multiTokenContractRequest type: ', method, options?.type);
    console.log('=====multiTokenContractRequest address: ', method, address);
    console.log('=====multiTokenContractRequest curChain: ', method, curChain);
    console.log('=====multiTokenContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====multiTokenContractRequest res: ', method, res);

      const result = res.data as unknown as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod({
        chainId: curChain,
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====multiTokenContractRequest res: ', method, res);

      const result = res as unknown as IContractError;

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId as string, curChain);

      console.log('=====multiTokenContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====multiTokenContractRequest error:', method, JSON.stringify(error));
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const Create = async (params: ICreateParams): Promise<ICallSendResponse> => {
  try {
    const res: ICallSendResponse = await multiTokenContractRequest('Create', params, {
      chain: SupportedELFChainId.MAIN_NET,
    });
    return Promise.resolve(res);
  } catch (_) {
    return Promise.reject(null);
  }
};

export const Issue = async (params: IIssuerParams): Promise<ICallSendResponse> => {
  try {
    const res: ICallSendResponse = await multiTokenContractRequest('Issue', params);
    return Promise.resolve(res);
  } catch (_) {
    return Promise.reject(null);
  }
};

export const GetBalance = async (
  params: IGetBalanceParams,
  options?: IContractOptions,
): Promise<{ balance: number }> => {
  try {
    const res = (await multiTokenContractRequest('GetBalance', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as { balance: number };
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetTokenInfo = async (
  params: IGetTokenInfoParams,
  options?: IContractOptions,
): Promise<{ supply: number; totalSupply: number; decimals: number }> => {
  try {
    const res = (await multiTokenContractRequest('GetTokenInfo', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as { supply: number; totalSupply: number; decimals: number };
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Transfer = async (params: ITransferParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await multiTokenContractRequest('Transfer', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetAllowance = async (
  params: IGetAllowanceParams,
  options?: IContractOptions,
): Promise<IGetAllowanceResponse & IContractError> => {
  try {
    const res = (await multiTokenContractRequest('GetAllowance', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IGetAllowanceResponse & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Approve = async (params: IApproveParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await multiTokenContractRequest('Approve', params, {
      ...options,
    })) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
