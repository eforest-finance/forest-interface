import useGetState from 'store/state/getState';
import { message } from 'antd';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { IClaimDropParams, IContractError, ISendResult } from 'contract/type';
import { getResult } from 'utils/deserializeLog';
import { EventEnded, EventEndedBack, UserDeniedMessage } from 'contract/formatErrorMsg';
import { ClaimDrop } from 'contract/drop';
import { checkTokenApproveCurrying } from 'utils/aelfUtils';
import { dispatch } from 'store/store';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { DropState } from 'api/types';
import BigNumber from 'bignumber.js';

export const useClaimDrop = (chainId?: Chain) => {
  const { walletInfo, aelfInfo } = useGetState();
  const checkELFApprove = checkTokenApproveCurrying();

  const claimDrop = async (
    params: IClaimDropParams & {
      price: string;
    },
  ) => {
    try {
      if (!BigNumber(params.price).isEqualTo(0)) {
        const approveTokenResult = await checkELFApprove({
          chainId: chainId,
          symbol: 'ELF',
          address: walletInfo.address || '',
          spender: aelfInfo.dropSideAddress,
          amount: params.price,
          decimals: 8,
          approveSymbol: 'ELF',
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
        dispatch(setDropQuota({ state: DropState.Canceled }));
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
