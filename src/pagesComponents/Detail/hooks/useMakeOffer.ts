import { message } from 'antd';
import moment from 'moment';
import { checkELFApprove, messageHTML } from 'utils/aelfUtils';
import { MakeOffer } from 'contract/market';
import useGetState from 'store/state/getState';
import { IContractError, IPrice } from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function useMakeOffer(chainId?: Chain) {
  const { walletInfo } = useGetState();
  const { login, isLogin } = useCheckLoginAndToken();
  const makeOffer = async (parameter: {
    symbol: string;
    offerTo?: string;
    quantity: number;
    quantityForApprove: number;
    price: IPrice;
    expireTime?: number;
  }) => {
    if (isLogin) {
      try {
        const approveTokenResult = await checkELFApprove({
          chainId: chainId,
          price: parameter.price,
          quantity: parameter.quantityForApprove,
          spender:
            chainId === SupportedELFChainId.MAIN_NET
              ? getForestContractAddress().main
              : getForestContractAddress().side,
          address: walletInfo.address || '',
        });

        if (!approveTokenResult) {
          setTimeout(() => {
            message.destroy();
          }, 3000);
          return Promise.reject('error');
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
            const { TransactionId } = result.result || result;
            messageHTML(TransactionId!, 'success', chainId);
            return {
              ...result,
              TransactionId,
            };
          } else {
            message.error(DEFAULT_ERROR);
            return Promise.reject(DEFAULT_ERROR);
          }
        } catch (error) {
          const resError = error as unknown as IContractError;
          message.error(resError.errorMessage?.message || DEFAULT_ERROR);
          return Promise.reject(error);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      message.destroy();
      login();
    }
  };
  return makeOffer;
}
