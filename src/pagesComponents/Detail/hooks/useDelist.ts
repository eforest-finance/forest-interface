import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { Delist } from 'contract/market';
import useGetState from 'store/state/getState';
import { IContractError, IPrice, ITimestamp } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import BigNumber from 'bignumber.js';

export default function useDelist(chainId?: Chain) {
  const { walletInfo } = useGetState();
  const account = walletInfo.address;

  const delist = async (parameter: { symbol: string; quantity: number; price: IPrice; startTime: ITimestamp }) => {
    if (account) {
      try {
        const result = await Delist(
          {
            symbol: parameter.symbol,
            quantity: parameter.quantity,
            price: { ...parameter.price, amount: new BigNumber(parameter.price.amount).times(10 ** 8).toNumber() },
            startTime: parameter.startTime,
          },
          {
            chain: chainId,
          },
        );

        message.destroy();
        if (result?.error || !result) {
          message.error(result.errorMessage?.message || result.error?.toString());
          return 'error';
        } else {
          const { TransactionId } = result.result || result;
          messageHTML(TransactionId!, 'success', chainId);
        }
        return result;
      } catch (error) {
        const resError = error as IContractError;
        message.error(resError.errorMessage?.message || resError.error?.toString() || DEFAULT_ERROR);
        return 'error';
      }
    }
    return 'error';
  };
  return delist;
}
