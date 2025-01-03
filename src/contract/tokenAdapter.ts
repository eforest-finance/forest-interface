import { webLoginInstance } from './webLogin';
import { ContractMethodType, IContractError, IContractOptions, IManagerTokenParams, ISendResult } from './type';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { SupportedELFChainId } from 'constants/chain';
import { formatErrorMsg } from './formatErrorMsg';

const tokenAdapterContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  console.log('=====tokenAdapterContractRequest method: ', method);
  console.log('=====tokenAdapterContractRequest type: ', options?.type);

  const info = store.getState().aelfInfo.aelfInfo;

  try {
    const address = info?.tokenAdapterMainAddress;
    const curChain = SupportedELFChainId.MAIN_NET; // tokenAdapter is only on main net

    console.log('=====tokenAdapterContractRequest address: ', address);
    console.log('=====tokenAdapterContractRequest curChain: ', curChain);
    console.log('=====tokenAdapterContractRequest params: ', params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod({
        chainId: curChain,

        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res.data as unknown as IContractError;
      console.error('=====tokenAdapterContractRequest result:', result);
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod({
        chainId: curChain,

        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res as unknown as IContractError;
      console.error('=====tokenAdapterContractRequest result:', result);
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId as string, curChain);
      console.log('=====tokenAdapterContractRequest transaction:', transaction);
      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====tokenAdapterContractRequest error:', error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError));
  }
};

export const CreateToken = async (params: IManagerTokenParams): Promise<ICallSendResponse> => {
  try {
    const res: ICallSendResponse = await tokenAdapterContractRequest('CreateToken', params);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
