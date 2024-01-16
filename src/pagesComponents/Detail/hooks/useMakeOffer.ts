import { message } from 'antd';
import moment from 'moment';
import { checkELFApprove, messageHTML } from 'utils/aelfUtils';
import useDetailGetState from '../../../store/state/detailGetState';
import { MakeOffer } from 'contract/market';
import useGetState from 'store/state/getState';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { IContractError, IPrice } from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function useMakeOffer(chainId?: Chain) {
  const { walletInfo } = useGetState();
  const { login, isLogin } = useCheckLoginAndToken();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const makeOffer = async (parameter: {
    symbol: string;
    offerTo?: string;
    quantity: number;
    price: IPrice;
    expireTime?: number;
  }) => {
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
        setTimeout(() => {
          message.destroy();
        }, 3000);
        return 'error';
      }

      try {
        const result = await MakeOffer(
          {
            symbol: parameter.symbol,
            offerTo: parameter.offerTo || null,
            quantity: parameter.quantity,
            price: parameter.price,
            expireTime: {
              seconds: ((parameter.expireTime || moment().add(6, 'M').valueOf()) / 1000).toFixed(0),
              nanos: 0,
            },
          },
          {
            chain: chainId,
          },
        );
        message.destroy();
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
      message.destroy();
      login();
    }
  };
  return makeOffer;
}
