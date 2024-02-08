import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { Transfer } from 'contract/multiToken';
import { IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { getNFTNumber } from '../utils/getNftNumber';
import useGetState from 'store/state/getState';
import { updateDetail } from '../utils/getNftInfo';
import { useParams } from 'next/navigation';

export default function useTransfer(chainId?: Chain) {
  const { walletInfo, infoState } = useGetState();
  const { id } = useParams() as { id: string };

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
        return Promise.reject(transferResult.errorMessage?.message || DEFAULT_ERROR);
      } else {
        const { TransactionId } = transferResult.result || transferResult;
        messageHTML(TransactionId!, 'success', chainId);
        getNFTNumber({
          owner: walletInfo.address,
          nftSymbol: parameter.symbol,
          chainId: chainId || infoState.sideChain,
        });
        updateDetail({ nftId: id, address: walletInfo.address });
        return {
          TransactionId,
        };
      }
    } catch (error) {
      const resError = error as unknown as IContractError;
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      return Promise.reject(error);
    }
  };
  return transfer;
}
