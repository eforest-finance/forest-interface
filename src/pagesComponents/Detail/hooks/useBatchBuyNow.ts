import { message } from 'antd';
import { checkELFApprove } from 'utils/aelfUtils';
import { BatchBuyNow } from 'contract/market';
import useGetState from 'store/state/getState';
import {
  IBatchBuyNowParams,
  IBatchBuyNowResult,
  IContractError,
  IPrice,
  ISendResult,
  ITransactionResult,
} from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { Proto } from 'utils/proto';
import { deserializeLog } from 'utils/deserializeLog';
import { SentryMessageType, captureMessage } from 'utils/captureMessage';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import ResultModal from 'components/ResultModal';
import { useModal } from '@ebay/nice-modal-react';
import useDetailGetState from 'store/state/detailGetState';
import { BuyMessage } from 'constants/promptMessage';
import { isERC721 } from 'utils/isTokenIdReuse';
import { handlePlurality } from 'utils/handlePlurality';
import { timesDecimals } from 'utils/calculate';

export default function useBatchBuyNow(chainId?: Chain) {
  const { walletInfo, aelfInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { login, isLogin } = useCheckLoginAndToken();
  const resultModal = useModal(ResultModal);

  const showErrorModal = ({ quantity }: { quantity: number }) => {
    resultModal.show({
      previewImage: nftInfo?.previewImage || '',
      title: BuyMessage.errorMessage.title,
      hideButton: true,
      info: {
        logoImage: nftInfo?.nftCollection?.logoImage || '',
        subTitle: nftInfo?.nftCollection?.tokenName,
        title: nftInfo?.tokenName,
        extra: nftInfo && isERC721(nftInfo) ? undefined : handlePlurality(quantity, 'item'),
      },
      error: {
        title: BuyMessage.errorMessage.tips,
        description: BuyMessage.errorMessage.description,
      },
    });
  };

  const sendMessage = <T, R>({
    contractAddress,
    TransactionResult,
    TransactionId,
    errorMsg,
    proto,
    name,
  }: {
    contractAddress: string;
    TransactionResult: ITransactionResult;
    TransactionId: string;
    errorMsg?: R;
    proto?: T;
    name: string;
  }) => {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name,
        method: 'get',
        query: {
          contractAddress,
          TransactionId,
        },
        description: {
          TransactionResult,
          proto,
          errorMsg,
        },
      },
    });
  };

  const getResult = async (contractAddress: string, TransactionResult: ITransactionResult, TransactionId: string) => {
    const proto = Proto.getInstance().getProto();
    const currentProto = proto[contractAddress];
    const tokenProto = proto[aelfInfo.sideChainAddress];
    if (currentProto) {
      const log = TransactionResult?.Logs?.filter((item) => {
        return item.Name === 'BatchBuyNowResult';
      })?.[0];
      const TransactionFeeChargedLog = TransactionResult?.Logs?.filter((item) => {
        return item.Name === 'TransactionFeeCharged';
      })?.[0];

      if (log) {
        try {
          const logResult: IBatchBuyNowResult = await deserializeLog(log, currentProto);
          let gasFee = 0;
          try {
            const gasFeeResult = await deserializeLog(TransactionFeeChargedLog, tokenProto);
            gasFee = gasFeeResult['amount'] / 10 ** 8;
          } catch (error) {
            console.log(error);
          }

          return {
            logResult,
            gasFee,
          };
        } catch (error) {
          sendMessage({
            name: 'BatchBuyNowResultDeserializeLog',
            contractAddress,
            TransactionResult,
            TransactionId,
            errorMsg: error,
          });
          return false;
        }
      } else {
        sendMessage({
          name: 'BatchBuyNowResultDeserializeLog',
          contractAddress,
          TransactionResult,
          TransactionId,
          errorMsg: 'no log events',
        });
        return false;
      }
    } else {
      sendMessage({
        name: 'BatchBuyNowResultDeserializeProto',
        contractAddress,
        TransactionResult,
        TransactionId,
        errorMsg: 'no proto',
        proto,
      });
      return false;
    }
  };

  const batchBuyNow = async (
    parameter: IBatchBuyNowParams & {
      price: IPrice;
      quantity: number;
      nftDecimals: number;
    },
  ) => {
    if (isLogin) {
      const approveTokenResult = await checkELFApprove({
        chainId: chainId,
        price: parameter.price,
        quantity: timesDecimals(parameter.quantity, '0').toNumber(),
        spender:
          chainId === SupportedELFChainId.MAIN_NET ? getForestContractAddress().main : getForestContractAddress().side,
        address: walletInfo.address || '',
      });

      if (!approveTokenResult) {
        return 'not approved';
      }

      try {
        const result = await BatchBuyNow({
          symbol: parameter.symbol,
          fixPriceList: parameter.fixPriceList,
        });
        if (result) {
          const { TransactionId, TransactionResult } = (result.result || result) as ISendResult;
          if (TransactionResult) {
            const res = await getResult(aelfInfo.marketSideAddress, TransactionResult, TransactionId);
            if (res) {
              const { logResult, gasFee } = res;
              return {
                ...logResult,
                gasFee,
                TransactionId,
              };
            } else {
              message.error(DEFAULT_ERROR);
              return 'failed';
            }
          }
        } else {
          message.error(DEFAULT_ERROR);
          return 'failed';
        }
      } catch (error) {
        const resError = error as unknown as IContractError;
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
        return Promise.reject(error);

        // // showErrorModal({ quantity: 0 });
        // return 'failed';
      }
    } else {
      login();
    }
  };
  return batchBuyNow;
}
