import { webLoginInstance } from './webLogin';
import { ContractMethodType, IClaimDropParams, IContractError, IContractOptions, ISendResult } from './type';
import { SupportedELFChainId } from 'constants/chain';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { formatErrorMsg } from './formatErrorMsg';

const dropContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().aelfInfo.aelfInfo;

  const addressList = {
    main: info?.dropMainAddress,
    side: info?.dropSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;

    console.log('=====dropContractRequest type: ', method, options?.type);
    console.log('=====dropContractRequest address: ', method, address);
    console.log('=====dropContractRequest curChain: ', method, curChain);
    console.log('=====dropContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: R = await webLoginInstance.contractViewMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====dropContractRequest res: ', method, res);

      const result = res as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res);
    } else {
      const res: R = await webLoginInstance.contractSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====dropContractRequest res: ', method, res);

      const result = res as IContractError;

      console.log('=====dropContractRequest result: ', method, JSON.stringify(result), result?.Error);

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId!, curChain);

      console.log('=====dropContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====dropContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const ClaimDrop = async (params: IClaimDropParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await dropContractRequest('ClaimDrop', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
