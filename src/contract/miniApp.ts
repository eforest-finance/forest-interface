import { webLoginInstance } from './webLogin';
import { ClaimParams, ContractMethodType, IContractError, IContractOptions, ISendResult } from './type';
import { SupportedELFChainId } from 'constants/chain';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { formatErrorMsg } from './formatErrorMsg';

const miniAppContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().aelfInfo.aelfInfo;

  const addressList = {
    main: info?.miniAppMainAddress,
    side: info?.miniAppSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;

    console.log('=====miniAppContractRequest type: ', method, options?.type);
    console.log('=====miniAppContractRequest address: ', method, address);
    console.log('=====miniAppContractRequest curChain: ', method, curChain);
    console.log('=====miniAppContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod({
        chainId: curChain,

        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====miniAppContractRequest res: ', method, res);

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

      console.log('=====miniAppContractRequest res: ', method, res);

      const result = res as unknown as IContractError;

      console.log('=====miniAppContractRequest result: ', method, JSON.stringify(result), result?.Error);

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId as string, curChain);

      console.log('=====miniAppContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====miniAppContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const AddTreePoints = async (params: ClaimParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await miniAppContractRequest('AddTreePoints', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const TreeLevelUpgrade = async (params: ClaimParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await miniAppContractRequest('TreeLevelUpgrade', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const ClaimTreePoints = async (params: ClaimParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await miniAppContractRequest('ClaimTreePoints', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
