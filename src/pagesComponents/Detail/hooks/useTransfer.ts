import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { Transfer } from 'contract/multiToken';
import { IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { getNFTNumber } from '../utils/getNftNumber';
import useGetState from 'store/state/getState';
import { updateDetail } from '../utils/getNftInfo';
import { useParams } from 'next/navigation';
import useDetailGetState from 'store/state/detailGetState';

export default function useTransfer(chainId?: Chain) {
  const { walletInfo, infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { id } = useParams() as { id: string };
  const { updateDetailLoading } = detailInfo;

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
        getNFTNumber({
          owner: walletInfo.address,
          nftSymbol: parameter.symbol,
          chainId: chainId || infoState.sideChain,
        });
        // if (!updateDetailLoading) {
        updateDetail({ nftId: id, address: walletInfo.address });
        // }
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
