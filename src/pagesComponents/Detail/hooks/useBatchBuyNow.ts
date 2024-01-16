import { message } from 'antd';
import { checkELFApprove, messageHTML } from 'utils/aelfUtils';
import { BatchBuyNow } from 'contract/market';
import useGetState from 'store/state/getState';
import { IBatchBuyNowParams, IContractError, IPrice } from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function useBatchBuyNow(chainId?: Chain) {
  const { walletInfo } = useGetState();
  const { login, isLogin } = useCheckLoginAndToken();
  const batchBuyNow = async (
    parameter: IBatchBuyNowParams & {
      price: IPrice;
      quantity: number;
    },
  ) => {
    if (isLogin) {
      const approveTokenResult = await checkELFApprove({
        chainId: chainId,
        price: parameter.price,
        quantity: parameter.quantity,
        spender:
          chainId === SupportedELFChainId.MAIN_NET ? getForestContractAddress().main : getForestContractAddress().side,
        address: walletInfo.address || '',
      });

      if (!approveTokenResult) {
        return 'error';
      }

      try {
        const result = await BatchBuyNow({
          symbol: parameter.symbol,
          fixPriceList: parameter.fixPriceList,
        });
        if (result) {
          if (result?.error) {
            message.error(result.errorMessage?.message || result.error?.toString() || DEFAULT_ERROR);
            return 'error';
          }
          const { TransactionId } = result.result || result;
          messageHTML(TransactionId!, 'success', chainId);
          return result;
        } else {
          message.error(DEFAULT_ERROR);
          return 'error';
        }
      } catch (error) {
        const resError = error as unknown as IContractError;
        message.error(resError.errorMessage?.message || DEFAULT_ERROR);
        return 'error';
      }
    } else {
      login();
    }
  };
  return batchBuyNow;
}
