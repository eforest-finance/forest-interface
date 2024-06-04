import { useWebLogin } from 'aelf-web-login';
import { fetchGenerate } from 'api/fetch';
import BigNumber from 'bignumber.js';
import { SupportedELFChainId } from 'constants/chain';
import { Approve, GetAllowance } from 'contract/multiToken';
import { IContractError } from 'contract/type';
import { FailStepOfCollectionEnum } from 'hooks/useCreate';
import useGetState from 'store/state/getState';
import { store } from 'store/store';
import { timesDecimals } from 'utils/calculate';
import { getRawTransaction } from 'utils/getRawTransaction';
import { getForestContractAddress } from 'contract/forest';
import { getRpcUrls } from 'constants/url';

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
  const { walletType } = useWebLogin();
  const info = store.getState().aelfInfo.aelfInfo;
  const contractAddress = getForestContractAddress().side;
  const { version } = useWebLogin();
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
        console.log('create error');
        throw {
          step: FailStepOfCollectionEnum.Approve,
          message: allowance.error || 'create error',
        };
      }

      const bigA = timesDecimals(Number(params.number) * aiGuessFee, 8);
      const allowanceBN = new BigNumber(allowance?.allowance || 0);
      console.log(allowanceBN, bigA);

      if (allowanceBN.lt(bigA)) {
        const approveRes = await Approve(
          {
            spender: contractAddress,
            symbol: 'ELF',
            amount: bigA.toNumber(),
          },
          {
            chain: chainId,
          },
        );
        console.log('token approve finish', approveRes);
      }
    } catch (error) {
      const resError = error as IContractError;
      throw {
        step: FailStepOfCollectionEnum.Approve,
        message: resError?.errorMessage?.message || 'create error',
      };
    }

    try {
      const caContractAddress = version === 'v2' ? info.sideCaAddressV2 : info.sideCaAddress;
      const rpcUrl = getRpcUrls()[chainId];

      const rawTransaction = await getRawTransaction({
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
        throw {
          step: FailStepOfCollectionEnum.Approve,
          message: 'rawTransaction error',
        };
      }

      const { items = [] } = await fetchGenerate({
        rawTransaction,
        chainId: 'tDVW',
      });
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    CreateArt,
  };
}
