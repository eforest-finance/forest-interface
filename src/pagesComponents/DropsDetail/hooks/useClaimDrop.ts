import useGetState from 'store/state/getState';
import { message } from 'antd';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { IClaimDropParams, IContractError, ISendResult } from 'contract/type';
import { getResult } from 'utils/deserializeLog';
import { EventEnded, EventEndedBack, UserDeniedMessage } from 'contract/formatErrorMsg';
import { ClaimDrop } from 'contract/drop';
import { checkELFApprove } from 'utils/aelfUtils';
import { SupportedELFChainId } from 'constants/chain';
import { getForestContractAddress } from 'contract/forest';
import { useRouter } from 'next/navigation';
import { dispatch } from 'store/store';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { DropState } from 'api/types';
import { timesDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';

export const useClaimDrop = (chainId?: Chain) => {
  const { walletInfo, aelfInfo } = useGetState();
  const navigator = useRouter();

  const claimDrop = async (
    params: IClaimDropParams & {
      price: number;
    },
  ) => {
    try {
      if (!BigNumber(params.price).isEqualTo(0)) {
        const approveTokenResult = await checkELFApprove({
          chainId: chainId,
          price: {
            symbol: 'ELF',
            amount: timesDecimals(params.price, 8).toNumber(),
          },
          quantity: params.claimAmount,
          spender:
            chainId === SupportedELFChainId.MAIN_NET
              ? getForestContractAddress().main
              : getForestContractAddress().side,
          address: walletInfo.address || '',
        });

        if (!approveTokenResult) {
          return Promise.reject('failed');
        }
      }

      const result = await ClaimDrop({
        dropId: params.dropId,
        claimAmount: params.claimAmount,
      });
      if (result) {
        const { TransactionId, TransactionResult } = (result.result || result) as ISendResult;
        if (TransactionResult) {
          const res = await getResult(aelfInfo.dropSideAddress, 'DropClaimAdded', TransactionResult, TransactionId);
          if (res) {
            return {
              ...res,
              TransactionId,
            };
          } else {
            message.error(DEFAULT_ERROR);
            return 'failed';
          }
        }
        return 'failed';
      } else {
        message.error(DEFAULT_ERROR);
        return 'failed';
      }
    } catch (error) {
      message.destroy();
      const resError = error as unknown as IContractError;
      if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
        return Promise.reject(error);
      }
      if (resError.errorMessage?.message.includes(EventEndedBack)) {
        message.error(EventEndedBack, 3);
        navigator.back();
        return 'failed';
      }
      if (resError.errorMessage?.message.includes(EventEnded)) {
        message.error(EventEnded);
        dispatch(setDropQuota({ state: DropState.End }));
        return 'failed';
      }
      message.error(resError.errorMessage?.message);
      return 'error';
    }
  };

  return { claimDrop };
};
