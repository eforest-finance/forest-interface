import { webLoginInstance } from './webLogin';
import {
  ContractMethodType,
  IBatchBuyNowParams,
  IBatchCancelListParams,
  IBatchCancelOfferListParams,
  IBatchDeListParams,
  ICancelOfferParams,
  IContractError,
  IContractOptions,
  IDealParams,
  IDelistParams,
  IGetTotalEffectiveListedNFTAmountParams,
  IGetTotalOfferAmountParams,
  IListWithFixedPriceParams,
  IListedNFTInfo,
  IMakeOfferParams,
  ISendResult,
} from './type';
import { SupportedELFChainId } from 'constants/chain';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { formatErrorMsg } from './formatErrorMsg';

const marketContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().aelfInfo.aelfInfo;

  const addressList = {
    main: info?.marketMainAddress,
    side: info?.marketSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;

    console.log('=====marketContractRequest type: ', method, options?.type);
    console.log('=====marketContractRequest address: ', method, address);
    console.log('=====marketContractRequest curChain: ', method, curChain);
    console.log('=====marketContractRequest params: ', method, params);

    if (options?.type === ContractMethodType.VIEW) {
      const res: { data: R } = await webLoginInstance.callViewMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====marketContractRequest res: ', method, res);

      const result = res.data as unknown as IContractError;
      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====marketContractRequest res: ', method, res);

      const result = res as unknown as IContractError;

      console.log('=====marketContractRequest result: ', method, JSON.stringify(result), result?.Error);

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result, method));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId as string, curChain);

      console.log('=====marketContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====marketContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError, method));
  }
};

export const MakeOffer = async (params: IMakeOfferParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('MakeOffer', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Deal = async (params: IDealParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('Deal', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const Delist = async (params: IDelistParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('Delist', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const CancelOffer = async (params: ICancelOfferParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('CancelOfferListByExpireTime', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetListedNFTInfoList = async (
  params: {
    symbol: string;
    owner: string;
  },
  options?: IContractOptions,
): Promise<IContractError & { value: IListedNFTInfo[] }> => {
  try {
    const res = (await marketContractRequest('GetListedNFTInfoList', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IContractError & { value: IListedNFTInfo[] };
    return Promise.resolve(res);
  } catch (_) {
    return Promise.reject(null);
  }
};

export const ListWithFixedPrice = async (
  params: IListWithFixedPriceParams,
  options?: IContractOptions,
): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('ListWithFixedPrice', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetTotalOfferAmount = async (
  params: IGetTotalOfferAmountParams,
  options?: IContractOptions,
): Promise<
  IContractError & {
    allowance: number;
    totalAmount: number;
  }
> => {
  try {
    const res = (await marketContractRequest('GetTotalOfferAmount', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IContractError & {
      allowance: number;
      totalAmount: number;
    };
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetTotalEffectiveListedNFTAmount = async (
  params: IGetTotalEffectiveListedNFTAmountParams,
  options?: IContractOptions,
): Promise<
  IContractError & {
    allowance: number;
    totalAmount: number;
  }
> => {
  try {
    const res = (await marketContractRequest('GetTotalEffectiveListedNFTAmount', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IContractError & {
      allowance: number;
      totalAmount: number;
    };
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const BatchBuyNow = async (
  params: IBatchBuyNowParams,
  options?: IContractOptions,
): Promise<IContractError & ISendResult> => {
  try {
    const res = (await marketContractRequest('BatchBuyNow', params, options)) as IContractError & ISendResult;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const BatchDeList = async (params: IBatchDeListParams, options?: IContractOptions): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('BatchDeList', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const BatchCancelList = async (
  params: IBatchCancelListParams,
  options?: IContractOptions,
): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('BatchCancelList', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const BatchCancelOfferList = async (
  params: IBatchCancelOfferListParams,
  options?: IContractOptions,
): Promise<IContractError> => {
  try {
    const res = (await marketContractRequest('BatchCancelOfferList', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
