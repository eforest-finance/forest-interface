import { fetchGenerate, fetchCreateAIRetry } from 'api/fetch';
import BigNumber from 'bignumber.js';
import { SupportedELFChainId } from 'constants/chain';
import { GetAllowance } from 'contract/multiToken';
import { IContractError } from 'contract/type';
import { FailStepOfCollectionEnum } from 'hooks/useCreate';
import useGetState from 'store/state/getState';
import { store } from 'store/store';
import { timesDecimals } from 'utils/calculate';
import { getRawTransaction } from 'utils/getRawTransaction';
import { getForestContractAddress } from 'contract/forest';
import { getRpcUrls } from 'constants/url';
import { approve, openBatchApprovalEntrance } from 'utils/aelfUtils';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

export interface ICreateArt {
  model?: string;
  negativePrompt: string;
  number: string | number;
  promt: string;
  size: string;
  paintingStyle: string;
  style: string;
}

export default function useGeneratePictures() {
  const { walletInfo } = useGetState();
  // const { walletType } = useWebLogin();
  const { walletType } = useConnectWallet();
  const info = store.getState().aelfInfo.aelfInfo;
  const contractAddress = getForestContractAddress().side;
  const chainId = info.curChain as Chain;

  const CreateArt = async (params: ICreateArt, aiGuessFee: number) => {
    try {
      console.log('walletInfo.address', walletInfo.address);
      const allowance = await GetAllowance({
        symbol: 'ELF',
        owner: walletInfo.address,
        spender: contractAddress,
      });

      console.log('allowance---', allowance);

      if (allowance.error) {
        throw new Error(`${allowance.error}`);
      }

      const bigA = timesDecimals(Number(params.number) * aiGuessFee, 8);
      const allowanceBN = new BigNumber(allowance?.allowance || 0);
      console.log(allowanceBN, bigA);

      if (allowanceBN.lt(bigA)) {
        await openBatchApprovalEntrance(false);
        const approveRes = await approve(contractAddress, 'ELF', String(bigA.toNumber()), chainId);

        console.log('token approve finish', approveRes);
      }
    } catch (error) {
      const resError = error as IContractError;
      throw new Error(`${resError?.errorMessage?.message}`);
    }

    let rawTransaction;

    try {
      const caContractAddress = info.sideCaAddressV2;
      const rpcUrl = getRpcUrls()[chainId];

      rawTransaction = await getRawTransaction({
        walletInfo,
        contractAddress,
        caContractAddress,
        methodName: 'CreateArt',
        walletType,
        params: {
          model: 'dall-e-2',
          ...params,
        },
        rpcUrl,
        chainId,
      });
      console.log(rawTransaction);

      if (!rawTransaction) {
        throw new Error(`creation failed. Please try again later.`);
      }
    } catch (error) {
      console.log(error);
      throw new Error(`creation failed. Please try again later.`);
    }

    try {
      const result = await fetchGenerate({
        rawTransaction,
        chainId,
      });

      return result;
    } catch (error) {
      throw 'An error was created by the server';
    }
  };

  const TryAgain = async (transactionId: string) => {
    const { items } = await fetchCreateAIRetry({ transactionId });
    return items;
  };

  return {
    CreateArt,
    TryAgain,
  };
}
