import { message } from 'antd';
import { checkNFTApprove, messageHTML } from 'utils/aelfUtils';
import { Deal } from 'contract/market';
import useGetState from 'store/state/getState';
import { IContractError, IPrice } from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { DEFAULT_ERROR } from 'constants/errorMessage';

export default function useDeal(chainId?: Chain) {
  const { walletInfo } = useGetState();

  const deal = async (parameter: { symbol: string; offerFrom: string; price: IPrice; quantity: number }) => {
    const approveTokenResult = await checkNFTApprove({
      chainId: chainId,
      spender:
        chainId === SupportedELFChainId.MAIN_NET ? getForestContractAddress().main : getForestContractAddress().side,
      symbol: parameter.symbol,
      address: walletInfo.address || '',
      amount: parameter.quantity,
    });
    if (!approveTokenResult) {
      setTimeout(() => {
        message.destroy();
      }, 3000);
      return 'error';
    }

    try {
      const result = await Deal(
        {
          symbol: parameter.symbol,
          offerFrom: parameter.offerFrom,
          price: parameter.price,
          quantity: Number(parameter.quantity),
        },
        {
          chain: chainId,
        },
      );
      message.destroy();
      const { TransactionId } = result.result || result;
      messageHTML(TransactionId!, 'success', chainId);
      return result;
    } catch (error) {
      message.destroy();
      const resError = error as IContractError;
      return message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    }
  };
  return deal;
}
