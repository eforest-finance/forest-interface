import { webLoginInstance } from './webLogin';
import {
  IAddAddressInfoListToWhitelistParams,
  IContractError,
  IContractOptions,
  IGetExtraInfoByTagInput,
  IGetWhitelistIdParams,
  IRemoveInfoFromWhitelistParams,
  IRemoveTagInfoParams,
  IUpdateExtraInfoParams,
  IWhitelistInfo,
  IAddExtraInfoParams,
  IResetWhitelistParams,
  IGetWhitelistIdResponse,
  ContractMethodType,
  ISendResult,
} from './type';
import { ITagInfoList } from 'store/reducer/saleInfo/type';
import { SupportedELFChainId } from 'constants/chain';
import { sleep } from 'utils';
import { getTxResult } from 'utils/aelfUtils';
import { store } from 'store/store';
import { formatErrorMsg } from './formatErrorMsg';

const whiteListContractRequest = async <T, R>(
  method: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().aelfInfo.aelfInfo;

  const addressList = {
    main: info?.whiteListMainAddress,
    side: info?.whiteListSideAddress,
  };

  try {
    const address = (options?.chain === SupportedELFChainId.MAIN_NET
      ? addressList.main
      : addressList.side) as unknown as string;
    const curChain = options?.chain || info?.curChain;

    console.log('=====whiteListContractRequest type: ', method, options?.type);
    console.log('=====whiteListContractRequest address: ', method, address);
    console.log('=====whiteListContractRequest curChain: ', method, curChain);
    console.log('=====whiteListContractRequest params: ', method, params);

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

      console.log('=====whiteListContractRequest res: ', method, res);

      return Promise.resolve(res.data);
    } else {
      const res: R = await webLoginInstance.callSendMethod(curChain, {
        contractAddress: address,
        methodName: method,
        args: params,
      });

      console.log('=====whiteListContractRequest res: ', method, res);

      const result = res as unknown as IContractError;

      if (result?.error || result?.code || result?.Error) {
        return Promise.reject(formatErrorMsg(result));
      }

      const { transactionId, TransactionId } = result.result || result;
      const resTransactionId = TransactionId || transactionId;
      await sleep(1000);
      const transaction = await getTxResult(resTransactionId || '', curChain);
      console.log('=====whiteListContractRequest transaction: ', method, transaction);

      return Promise.resolve({ TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult });
    }
  } catch (error) {
    console.error('=====whiteListContractRequest error: ', method, JSON.stringify(error), error);
    const resError = error as IContractError;
    return Promise.reject(formatErrorMsg(resError));
  }
};

export const GetAddressFromWhitelist = async (
  params: { whitelistId?: string; address?: string },
  options?: IContractOptions,
): Promise<boolean & IContractError> => {
  try {
    const res = (await whiteListContractRequest('GetAddressFromWhitelist', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as boolean & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetWhitelist = async (
  params: string,
  options?: IContractOptions,
): Promise<IContractError & IWhitelistInfo> => {
  try {
    const res = (await whiteListContractRequest('GetWhitelist', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IContractError & IWhitelistInfo;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetTagInfoFromWhitelist = async (
  params: IGetExtraInfoByTagInput,
  options?: IContractOptions,
): Promise<boolean & IContractError> => {
  try {
    const res = (await whiteListContractRequest('GetTagInfoFromWhitelist', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as boolean & IContractError;
    return Promise.resolve(res);
  } catch (error: any) {
    if (error?.Error?.Code) {
      return Promise.reject({
        error: error.Error.Code,
        errorMessage: {
          message: error.Error?.Details,
        },
      });
    } else {
      return Promise.reject(error);
    }
  }
};

export const GetWhitelistDetail = async (
  params: { whitelistId?: string },
  options?: IContractOptions,
): Promise<void | IContractError> => {
  try {
    const res = (await whiteListContractRequest('GetWhitelistDetail', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as void | IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetWhitelistId = async (
  params: IGetWhitelistIdParams,
  options?: IContractOptions,
): Promise<IGetWhitelistIdResponse & IContractError> => {
  try {
    const res = (await whiteListContractRequest('GetWhitelistId', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as IGetWhitelistIdResponse & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GetTagInfoListByWhitelist = async (
  params: {
    whitelistId: string;
    projectId: string;
  },
  options?: IContractOptions,
): Promise<ITagInfoList & IContractError> => {
  try {
    const res = (await whiteListContractRequest('GetTagInfoListByWhitelist', params, {
      ...options,
      type: ContractMethodType.VIEW,
    })) as ITagInfoList & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const EnableWhitelist = async (
  whitelistId: string,
  options?: IContractOptions,
): Promise<boolean & IContractError> => {
  try {
    const res = (await whiteListContractRequest('EnableWhitelist', whitelistId, options)) as boolean & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const DisableWhitelist = async (
  whitelistId: string,
  options?: IContractOptions,
): Promise<boolean & IContractError> => {
  try {
    const res = (await whiteListContractRequest('DisableWhitelist', whitelistId, options)) as boolean & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const RemoveInfoFromWhitelist = async (
  params: IRemoveInfoFromWhitelistParams,
  options?: IContractOptions,
): Promise<IContractError> => {
  try {
    const res = (await whiteListContractRequest('RemoveInfoFromWhitelist', params, options)) as IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const AddAddressInfoListToWhitelist = async (
  params: IAddAddressInfoListToWhitelistParams,
  options?: IContractOptions,
): Promise<void & IContractError> => {
  try {
    const res = (await whiteListContractRequest('AddAddressInfoListToWhitelist', params, options)) as void &
      IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const UpdateExtraInfo = async (
  params: IUpdateExtraInfoParams,
  options?: IContractOptions,
): Promise<void & IContractError> => {
  try {
    const res = (await whiteListContractRequest('UpdateExtraInfo', params, options)) as void & IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const RemoveTagInfo = async (
  params: IRemoveTagInfoParams,
  options?: IContractOptions,
): Promise<void | IContractError> => {
  try {
    const res = (await whiteListContractRequest('RemoveTagInfo', params, options)) as void | IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const AddExtraInfo = async (
  params: IAddExtraInfoParams,
  options?: IContractOptions,
): Promise<void | IContractError> => {
  try {
    const res = (await whiteListContractRequest('AddExtraInfo', params, options)) as void | IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const ResetWhitelist = async (
  params: IResetWhitelistParams,
  options?: IContractOptions,
): Promise<void | IContractError> => {
  try {
    const res = (await whiteListContractRequest('ResetWhitelist', params, options)) as void | IContractError;
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
