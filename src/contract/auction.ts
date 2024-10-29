import { webLoginInstance } from './webLogin';
import { ContractMethodType, IAuctionParams, IContractError, IContractOptions, ISendResult } from './type';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { SupportedELFChainId } from 'constants/chain';
import { formatErrorMsg } from './formatErrorMsg';
import { MethodType, SentryMessageType, captureMessage } from 'utils/captureMessage';

const auctionContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().aelfInfo.aelfInfo;

  const addressList = {
    main: '',
    side: info?.auctionSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;
    console.log('finish--curChain', curChain);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res.data as unknown as IContractError;
      if (result?.error || result?.code || result?.Error) {
        captureMessage({
          type: SentryMessageType.CONTRACT,
          params: {
            name: method,
            method: MethodType.CALLVIEWMETHOD,
            query: params,
            description: result,
          },
        });
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      const result = res as unknown as IContractError;

      if (result?.error || result?.code || result?.Error) {
        captureMessage({
          type: SentryMessageType.CONTRACT,
          params: {
            name: method,
            method: MethodType.CALLSENDMETHOD,
            query: params,
            description: result,
          },
        });
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId as string, curChain);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    const resError = error as IContractError;
    console.log(resError, error, 'resError');

    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const PlaceBid = async (params: IAuctionParams): Promise<ICallSendResponse> => {
  const res: ICallSendResponse = await auctionContractRequest('PlaceBid', params);
  return res;
};
