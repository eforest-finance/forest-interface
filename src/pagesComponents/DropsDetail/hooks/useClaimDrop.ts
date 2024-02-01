import useGetState from 'store/state/getState';
import { message } from 'antd';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { IClaimDropParams, IContractError, ISendResult } from 'contract/type';
import { getResult } from 'utils/deserializeLog';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { ClaimDrop } from 'contract/drop';
import { checkELFApprove } from 'utils/aelfUtils';
import { SupportedELFChainId } from 'constants/chain';
import { getForestContractAddress } from 'contract/forest';

export const useClaimDrop = (chainId?: Chain) => {
  const { walletInfo, aelfInfo } = useGetState();

  const claimDrop = async (
    params: IClaimDropParams & {
      price: number;
    },
  ) => {
    try {
      const approveTokenResult = await checkELFApprove({
        chainId: chainId,
        price: {
          symbol: 'ELF',
          amount: params.price,
        },
        quantity: params.claimAmount,
        spender:
          chainId === SupportedELFChainId.MAIN_NET ? getForestContractAddress().main : getForestContractAddress().side,
        address: walletInfo.address || '',
      });

      if (!approveTokenResult) {
        return 'failed';
      }
      const result = await ClaimDrop({
        dropId: params.dropId,
        claimAmount: params.claimAmount,
      });
      if (result) {
        const { TransactionId, TransactionResult } = (result.result || result) as ISendResult;
        if (TransactionResult) {
          const res = await getResult(aelfInfo.dropSideAddress, 'ClaimDrop', TransactionResult, TransactionId);
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
      message.error(resError.errorMessage?.message);
      return 'failed';
    }
  };

  return { claimDrop };
};
