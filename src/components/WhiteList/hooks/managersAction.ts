import { IAddExtraInfoParams, IContractError, IResetWhitelistParams } from 'contract/type';
import {
  AddAddressInfoListToWhitelist,
  AddExtraInfo,
  DisableWhitelist,
  EnableWhitelist,
  RemoveInfoFromWhitelist,
  ResetWhitelist,
  UpdateExtraInfo,
} from 'contract/whiteList';
import { IUpdateExtraInfoInput, StrategyType } from 'store/reducer/saleInfo/type';

const errorInfo = {
  error: 50000,
  errorMessage: {
    message: 'Invalid argument',
  },
} as IContractError;

const errorPromise: Promise<IContractError> = Promise.resolve(errorInfo);

export const disableWhiteList = async (whitelistId: string, chainId?: Chain) => {
  console.log('errorPromise disableWhiteList', chainId, whitelistId);
  if (!chainId || !whitelistId) return errorPromise;
  return await DisableWhitelist(whitelistId, {
    chain: chainId,
  });
};

export const enableWhiteList = async (whitelistId: string, chainId?: Chain) => {
  console.log('errorPromise enableWhiteList', chainId, whitelistId);
  if (!chainId || !whitelistId) return errorPromise;
  return await EnableWhitelist(whitelistId, {
    chain: chainId,
  });
};

export const updateOnlyByAddress = async (v: IUpdateExtraInfoInput) => {
  const removeRes = await RemoveInfoFromWhitelist({
    whitelistId: v.whitelistId,
    addressList: v?.extraInfoList?.addressList,
  });
  if (!removeRes?.error) return removeRes;

  return await AddAddressInfoListToWhitelist({
    whitelistId: v.whitelistId,
    extraInfoIdList: {
      value: v.extraInfoList ? [v.extraInfoList] : undefined,
    },
  });
};

export const updateWhitelistUserInfo = async (v: IUpdateExtraInfoInput, strategyType: StrategyType) => {
  if (strategyType === StrategyType.Basic) return await updateOnlyByAddress(v);
  return await UpdateExtraInfo({
    whitelistId: v.whitelistId,
    extraInfoList: v.extraInfoList,
  });
};

export const addExtraInfo = async (v: IAddExtraInfoParams) => {
  return await AddExtraInfo(v);
};

export const addToWhiteList = async (v: IUpdateExtraInfoInput, chainId?: Chain | null) => {
  console.log('errorPromise addToWhiteList', chainId);
  if (!chainId) return errorPromise;
  return await AddAddressInfoListToWhitelist(
    {
      whitelistId: v.whitelistId,
      extraInfoIdList: {
        value: v.extraInfoList ? [v.extraInfoList] : undefined,
      },
    },
    {
      chain: chainId,
    },
  );
};

export const removeFromWhiteList = async (v: IUpdateExtraInfoInput, chainId?: Chain) => {
  if (!chainId || !v.whitelistId || !v?.extraInfoList?.addressList) return errorPromise;

  return await RemoveInfoFromWhitelist(
    {
      whitelistId: v.whitelistId,
      addressList: v?.extraInfoList?.addressList,
    },
    {
      chain: chainId,
    },
  );
};

export const resetWhitelistHandler = async (v: IResetWhitelistParams, chainId: Chain) => {
  if (!chainId) return errorPromise;
  return await ResetWhitelist(
    {
      whitelistId: v.whitelistId,
      projectId: v.projectId,
    },
    {
      chain: chainId,
    },
  );
};
