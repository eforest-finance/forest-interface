import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { CancelOffer } from 'contract/market';
import useGetState from 'store/state/getState';
import { ICancelOfferItemParams, IContractError, IMakeOfferParams } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

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
        if (result?.error) {
          message.error(result?.errorMessage?.message || result?.error.toString() || DEFAULT_ERROR);
        } else {
          const { TransactionId } = result.result || result;
          messageHTML(TransactionId!, 'success', chainId);
        }
        return result;
      } catch (error) {
        const resError = error as IContractError;
        message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      }
    }
    return 'error';
  };
  return cancelOffer;
}
