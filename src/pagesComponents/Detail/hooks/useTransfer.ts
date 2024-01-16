import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { Transfer } from 'contract/multiToken';
import { IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';

export default function useTransfer(chainId?: Chain) {
  const transfer = async (parameter: { symbol: string; spender: string; amount: number }) => {
    try {
      const transferResult = await Transfer(
        {
          to: parameter.spender,
          symbol: parameter.symbol,
          amount: parameter.amount,
        },
        {
          chain: chainId,
        },
      );
      message.destroy();
      if (!transferResult || transferResult?.error) {
        message.error(transferResult.errorMessage?.message || DEFAULT_ERROR);
        return false;
      } else {
        const { TransactionId } = transferResult.result || transferResult;
        messageHTML(TransactionId!, 'success', chainId);
        return true;
      }
    } catch (error) {
      const resError = error as unknown as IContractError;
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      return false;
    }
  };
  return transfer;
}
