import { useState } from 'react';
import AElf from 'utils/aelf';

import { Approve, GetAllowance } from 'contract/multiToken';
import { CreateToken } from 'contract/tokenAdapter';
import { IContractError, ICreateCollectionParams, ICreateItemsParams, IIssuerParams } from 'contract/type';
import { fetchSyncCollection, fetchSyncResult, fetchSaveNftItemInfos, fetchSaveCollectionInfos } from 'api/fetch';
import { ISaveCollectionInfosParams, ISaveNftInfosParams, ISyncChainParams } from 'api/types';
import { SupportedELFChainId } from 'constants/chain';
import { CHAIN_ID_VALUE } from 'constants/index';
import { store } from 'store/store';
import { ForwardCall, GetProxyAccountByProxyAccountAddress } from 'contract/proxy';
import tokenContractJson from 'proto/token_contract.json';
import { encodedParams } from 'utils/aelfUtils';
import { message } from 'antd';
import { timesDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import { sleep } from 'utils';

const intervalTime = 20 * 1000;
const errorRetryCount = 5;

export enum CreateByEnum {
  Collection = 'collection',
  Items = 'items',
}

export enum CreateCollectionOrNFTStep {
  requestContractAuth = 0,
  crossChainSync = 1,
  issue = 2,
}
export enum StepStatus {
  unStart = 0,
  pending = 1,
  fulfilled = 2,
  rejected = 3,
}

export enum FailStepOfCollectionEnum {
  GetAllowance = 0,
  Approve = 1,
  createToken = 2,
  saveInfosOffChain = 3,
  notifyCrossChain = 4,
  getCrossChain = 5,
  issue = 6,
}

export enum FailStepOfNFTEnum {
  GetProxyAccount = 0,
  CreateNFT = 2,
  saveInfosOffChain = 3,
  notifyCrossChain = 4,
  getCrossChain = 5,
  issue = 6,
}

interface ICreateError {
  step: FailStepOfCollectionEnum | FailStepOfNFTEnum;
  message: string;
}

const getProtoObject = () => {
  return AElf.pbjs.Root.fromJSON(tokenContractJson);
};

const createContractByNft = async (params: ICreateItemsParams) => {
  const info = store.getState().aelfInfo.aelfInfo;
  try {
    const hash = await GetProxyAccountByProxyAccountAddress(params.owner, SupportedELFChainId.MAIN_NET);
    const CreateInputMessage = getProtoObject().lookupType('CreateInput');

    const args = await encodedParams(CreateInputMessage.resolveAll(), params);
    console.log(args, CreateInputMessage.decode(args));
    const result = await ForwardCall(
      {
        proxyAccountHash: hash?.proxyAccountHash,
        contractAddress: info?.mainChainAddress,
        methodName: 'Create',
        args: Buffer.from(args).toString('base64'),
      },
      SupportedELFChainId.MAIN_NET,
    );

    console.log('createContractByNft finish', result);
    return result;
  } catch (error) {
    console.log('createContractByNft fail', error);
    const resError = error as IContractError;
    throw {
      step: FailStepOfNFTEnum.CreateNFT,
      message: resError?.errorMessage?.message,
    } as ICreateError;
  }
};

const createContractByCollection = async (params: ICreateCollectionParams) => {
  const info = store.getState().aelfInfo.aelfInfo;

  let allowance;

  try {
    allowance = await GetAllowance(
      {
        spender: info?.tokenAdapterMainAddress,
        symbol: params.seedSymbol,
        owner: params.owner,
      },
      {
        chain: SupportedELFChainId.MAIN_NET,
      },
    );

    if (allowance.error) {
      throw {
        step: FailStepOfCollectionEnum.GetAllowance,
        message: allowance.errorMessage?.message || 'get Allowance fail',
      } as ICreateError;
    }
  } catch (error) {
    const resError = error as IContractError;
    throw {
      step: FailStepOfCollectionEnum.GetAllowance,
      message: resError?.errorMessage?.message || 'get Allowance fail',
    } as ICreateError;
  }

  try {
    const bigA = timesDecimals(1, '0');
    const allowanceBN = new BigNumber(allowance?.allowance);
    if (allowanceBN.lt(bigA)) {
      const approveRes = await Approve(
        {
          spender: info?.tokenAdapterMainAddress,
          symbol: params.seedSymbol,
          amount: '1',
        },
        {
          chain: SupportedELFChainId.MAIN_NET,
        },
      );
      console.log('token approve finish', approveRes);
    }
  } catch (error) {
    const resError = error as IContractError;
    throw {
      step: FailStepOfCollectionEnum.Approve,
      message: resError?.errorMessage?.message || 'create Token error',
    };
  }

  try {
    const result = await CreateToken(params);
    return result;
  } catch (error) {
    console.log('createContractByCollection fail', error);
    const resError = error as IContractError;
    throw {
      step: FailStepOfCollectionEnum.createToken,
      message: resError?.errorMessage?.message || 'create Token error',
    };
  }
};

const SynchronizeLoop = async (params: ISyncChainParams): Promise<Boolean> => {
  const result = await fetchSyncResult(params);
  if (result?.status === 'CrossChainTokenCreated') {
    return true;
  }

  if (result?.status === 'Failed') {
    return false;
  }
  await sleep(intervalTime);
  return await SynchronizeLoop(params);
};

export default function useCreateByStep() {
  const [currentStep, setCurrentStep] = useState<{ step: CreateCollectionOrNFTStep; status: StepStatus }>({
    step: CreateCollectionOrNFTStep.requestContractAuth,
    status: StepStatus.unStart,
  });

  const createContractStep = async (params: ICreateCollectionParams | ICreateItemsParams, createBy: CreateByEnum) => {
    const issueChainId = params.issueChainId as keyof typeof CHAIN_ID_VALUE;

    let result;
    if (createBy === CreateByEnum.Collection) {
      const externalInfo = params.externalInfo.value as ICreateCollectionParams['externalInfo']['value'];
      const contractParams = {
        ...params,
        issueChainId: CHAIN_ID_VALUE[issueChainId],
        externalInfo: {
          value: {
            __nft_file_hash: externalInfo?.__nft_file_hash || '',
            __nft_feature_hash: externalInfo?.__nft_feature_hash || '',
            __nft_payment_tokens: externalInfo?.__nft_payment_tokens || '',
            __nft_metadata: externalInfo?.__nft_metadata || '',
            __nft_image_url: externalInfo?.__nft_file_url || '',
          },
        },
      } as ICreateCollectionParams;

      result = await createContractByCollection(contractParams);
    } else {
      const externalInfo = params.externalInfo.value as ICreateItemsParams['externalInfo']['value'];
      const contractParams = {
        ...params,
        issueChainId: CHAIN_ID_VALUE[issueChainId],
        externalInfo: {
          value: Object.assign(
            {
              __nft_file_hash: externalInfo?.__nft_file_hash,
              __nft_metadata: externalInfo?.__nft_metadata,
              __nft_fileType: externalInfo?.__nft_fileType,
              __nft_image_url: externalInfo?.__nft_preview_image || externalInfo?.__nft_file_url || '',
            },
            externalInfo?.__nft_fileType === 'audio' || externalInfo?.__nft_fileType === 'video'
              ? {
                  __nft_file_url: externalInfo?.__nft_file_url || '',
                }
              : null,
          ),
        },
      } as ICreateItemsParams;

      result = await createContractByNft(contractParams);
    }

    return result;
  };

  const saveInfosOffChainStep = async (
    params: ICreateCollectionParams | ICreateItemsParams,
    createBy: CreateByEnum,
    TransactionId: string,
  ) => {
    const issueChainId = params.issueChainId as keyof typeof CHAIN_ID_VALUE;

    if (createBy === CreateByEnum.Collection) {
      const createContractParams = params as ICreateCollectionParams;
      const description = createContractParams.externalInfo.value.__nft_description;
      const externalLink = createContractParams.externalInfo.value.__nft_external_link;

      const logoImage = createContractParams.externalInfo.value.__nft_file_url;
      const featuredImage = createContractParams.externalInfo.value.__nft_featured_url;
      const saveNftItemInfosParams: ISaveCollectionInfosParams = {
        fromChainId: issueChainId,
        transactionId: TransactionId || '',
        symbol: createContractParams.symbol,
        tokenName: createContractParams.tokenName,
        logoImage,
        featuredImage,
        description,
        externalLink,
      };

      try {
        await fetchSaveCollectionInfos(saveNftItemInfosParams);
      } catch (error) {
        console.log(error);
        throw {
          step: FailStepOfCollectionEnum.saveInfosOffChain,
          message: 'save infos offChain fail',
        };
      }
    } else {
      const createContractParams = params as ICreateItemsParams;

      const description = createContractParams.externalInfo.value.__nft_description;
      const externalLink = createContractParams.externalInfo.value.__nft_external_link;
      const fileLink = createContractParams.externalInfo.value.__nft_file_url;
      const fileKey = createContractParams.externalInfo.value.__nft_fileType === 'image' ? 'previewImage' : 'file';
      const saveNftItemInfosParams: ISaveNftInfosParams = {
        chainId: issueChainId,
        symbol: createContractParams.symbol,
        transactionId: TransactionId || '',
        description,
        externalLink,
        previewImage: createContractParams.externalInfo.value.__nft_preview_image,
        [fileKey]: fileLink,
      };
      try {
        console.log('saveNftItemInfosParams', saveNftItemInfosParams);
        await fetchSaveNftItemInfos(saveNftItemInfosParams);
      } catch (error) {
        console.log(error);
        throw {
          step: FailStepOfNFTEnum.saveInfosOffChain,
          message: 'save infos offChain fail',
        };
      }
    }
  };

  const notifyCrossChainAndGetSyncResultStep = async ({
    issueChainId,
    symbol,
    TransactionId,
  }: {
    issueChainId: string;
    symbol: string;
    TransactionId: string;
  }) => {
    const requestParams: ISyncChainParams = {
      toChainId: issueChainId,
      fromChainId: SupportedELFChainId.MAIN_NET,
      symbol: symbol,
      txHash: TransactionId,
    };
    try {
      await fetchSyncCollection(requestParams);
    } catch (error) {
      console.log(error);
      throw {
        step: FailStepOfCollectionEnum.notifyCrossChain,
        message: 'notify fetchSyncInfo err',
      };
    }

    try {
      const isFinished = await SynchronizeLoop(requestParams);
      if (!isFinished) {
        throw {
          step: FailStepOfCollectionEnum.getCrossChain,
          message: 'cross chain fail',
        };
      }
      console.log('Synchronizing on-chain account information finished');
      return isFinished;
    } catch (error) {
      console.log(error);
      console.log('Synchronizing on-chain account information err');
      throw {
        step: FailStepOfCollectionEnum.getCrossChain,
        message: 'cross chain fail',
      };
    }
  };

  const catchFailedError = (error: ICreateError) => {
    if (error.step <= 2) {
      setCurrentStep({
        step: CreateCollectionOrNFTStep.requestContractAuth,
        status: StepStatus.rejected,
      });
    } else if (error.step <= 5) {
      setCurrentStep({
        step: CreateCollectionOrNFTStep.crossChainSync,
        status: StepStatus.rejected,
      });
    } else {
      setCurrentStep({
        step: CreateCollectionOrNFTStep.issue,
        status: StepStatus.rejected,
      });
    }
  };

  const create = async (
    params: ICreateCollectionParams | ICreateItemsParams,
    createBy: CreateByEnum,
    issuerParams?: IIssuerParams,
    proxyIssuerAddress?: string,
  ) => {
    try {
      setCurrentStep({
        step: CreateCollectionOrNFTStep.requestContractAuth,
        status: StepStatus.pending,
      });
      const result = await createContractStep(params, createBy);

      setCurrentStep({
        step: CreateCollectionOrNFTStep.requestContractAuth,
        status: StepStatus.fulfilled,
      });
      await sleep(100);

      setCurrentStep({
        step: CreateCollectionOrNFTStep.crossChainSync,
        status: StepStatus.pending,
      });

      await saveInfosOffChainStep(params, createBy, result.TransactionId);
      await notifyCrossChainAndGetSyncResultStep({
        issueChainId: params.issueChainId as keyof typeof CHAIN_ID_VALUE,
        symbol: params.symbol,
        TransactionId: result!.TransactionId,
      });
      await sleep(10000);

      setCurrentStep({
        step: CreateCollectionOrNFTStep.crossChainSync,
        status: StepStatus.fulfilled,
      });

      if (createBy === CreateByEnum.Items) {
        if (!issuerParams || !proxyIssuerAddress) {
          throw {
            step: FailStepOfNFTEnum.issue,
            message: 'issue params or proxyIssuerAddress is empty',
          };
        }
        await sleep(1100);
        setCurrentStep({
          step: CreateCollectionOrNFTStep.issue,
          status: StepStatus.pending,
        });
        await issue(issuerParams, proxyIssuerAddress);
        setCurrentStep({
          step: CreateCollectionOrNFTStep.issue,
          status: StepStatus.fulfilled,
        });
      }
    } catch (err) {
      const error = err as unknown as ICreateError;
      console.error(error);
      message.error(error?.message || error?.toString?.() || String(error));
      catchFailedError(error);
    }
  };

  const issue = async (params: IIssuerParams, proxyIssuerAddress: string) => {
    try {
      const info = store.getState().aelfInfo.aelfInfo;

      const { proxyAccountHash } = await GetProxyAccountByProxyAccountAddress(proxyIssuerAddress);
      const issueInputMessage = getProtoObject().lookupType('IssueInput');

      const issueArgs = await encodedParams(issueInputMessage.resolveAll(), params);
      console.log(issueArgs, issueInputMessage.decode(issueArgs));
      const issRes = await ForwardCall(
        {
          proxyAccountHash,
          contractAddress: info.sideChainAddress,
          methodName: 'Issue',
          args: Buffer.from(issueArgs).toString('base64'),
        },
        info.curChain,
      );

      return issRes;
    } catch (error) {
      const resError = error as IContractError;
      throw {
        step: FailStepOfNFTEnum.issue,
        message: resError?.errorMessage?.message || 'issue error',
      };
    }
  };

  const issueRetry = async (issuerParams?: IIssuerParams, proxyIssuerAddress?: string) => {
    try {
      if (!issuerParams || !proxyIssuerAddress) {
        throw {
          step: FailStepOfNFTEnum.issue,
          message: 'issue params or proxyIssuerAddress is empty',
        };
      }
      await sleep(100);
      setCurrentStep({
        step: CreateCollectionOrNFTStep.issue,
        status: StepStatus.pending,
      });
      await issue(issuerParams, proxyIssuerAddress);
      setCurrentStep({
        step: CreateCollectionOrNFTStep.issue,
        status: StepStatus.fulfilled,
      });
    } catch (err) {
      const error = err as unknown as ICreateError;
      console.error(error);
      message.error(error?.message || error?.toString?.() || String(error));
      catchFailedError(error);
    }
  };

  return { create, issue, currentStep, issueRetry };
}

export { useCreateByStep };
