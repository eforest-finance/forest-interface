import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { CancelOffer } from 'contract/market';
import useGetState from 'store/state/getState';
import { ICancelOfferItemParams, IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { UserDeniedMessage } from 'contract/formatErrorMsg';

export default function useCancelOffer(chainId?: Chain) {
  const { isLogin } = useCheckLoginAndToken();
  const { walletInfo } = useGetState();

  const cancelOffer = async (parameter: {
    symbol: string;
    tokenId: number;
    offerFrom: string;
    cancelOfferList: ICancelOfferItemParams[];
  }) => {
    if (isLogin) {
      try {
        const result = await CancelOffer({
          symbol: parameter.symbol,
          offerFrom: walletInfo.address,
          cancelOfferList: parameter.cancelOfferList,
        });
        message.destroy();
        const { TransactionId } = result.result || result;
        TransactionId && messageHTML(TransactionId, 'success', chainId);
        return result;
      } catch (error) {
        const resError = error as IContractError;
        if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
          message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
          return Promise.reject(error);
        }
        message.error(resError.errorMessage?.message || DEFAULT_ERROR);
        return 'failed';
      }
    }
    return 'failed';
  };
  return cancelOffer;
}
