import { message } from 'antd';
import { checkNFTApprove, messageHTML } from 'utils/aelfUtils';
import { Deal } from 'contract/market';
import useGetState from 'store/state/getState';
import { IContractError, IPrice } from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import useDetailGetState from 'store/state/detailGetState';
import ResultModal from 'components/ResultModal';
import { useModal } from '@ebay/nice-modal-react';
import { isERC721 } from 'utils/isTokenIdReuse';
import { handlePlurality } from 'utils/handlePlurality';
import { DealMessage } from 'constants/promptMessage';
import { UserDeniedMessage } from 'contract/formatErrorMsg';

export default function useDeal(chainId?: Chain) {
  const { walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const resultModal = useModal(ResultModal);

  const showErrorModal = ({ quantity }: { quantity: number }) => {
    resultModal.show({
      previewImage: nftInfo?.previewImage || '',
      title: DealMessage.errorMessage.title,
      hideButton: true,
      info: {
        logoImage: nftInfo?.nftCollection?.logoImage || '',
        subTitle: nftInfo?.nftCollection?.tokenName,
        title: nftInfo?.tokenName,
        extra: isERC721(nftInfo!) ? undefined : handlePlurality(quantity, 'item'),
      },
      error: {
        title: DealMessage.errorMessage.tips,
        description: DealMessage.errorMessage.description,
      },
    });
  };

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
      return 'failed';
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
      return {
        TransactionId,
      };
    } catch (error) {
      message.destroy();
      const resError = error as IContractError;
      if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
        return Promise.reject(error);
      }
      showErrorModal({ quantity: 0 });
      return 'failed';
    }
  };
  return deal;
}
