import { useEffect } from 'react';
import { clearDropDetailInfo, setDropDetailInfo, setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import useGetState from 'store/state/getState';
import { dispatch, store } from 'store/store';
import { getDropDetail } from '../utils/getDropDetail';
import { checkELFApprove } from 'utils/aelfUtils';
import { SupportedELFChainId } from 'constants/chain';
import { getForestContractAddress } from 'contract/forest';
import { sleep } from 'utils';
import { message } from 'antd';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import {
  IBatchBuyNowResult,
  IClaimDropParams,
  IClaimDropResult,
  IContractError,
  ISendResult,
  ITransactionResult,
} from 'contract/type';
import { SentryMessageType, captureMessage } from 'utils/captureMessage';
import { deserializeLog } from 'utils/deserializeLog';
import { Proto } from 'utils/proto';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { useModal } from '@ebay/nice-modal-react';
import ResultModal from 'components/ResultModal';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { MintNftMessage } from 'constants/promptMessage';
import MintModal from '../component/MintModal';
import { ClaimDrop } from 'contract/drop';

export const useClaimDrop = (chainId?: Chain) => {
  const { walletInfo, aelfInfo } = useGetState();
  const { dropDetailInfo } = useDropDetailGetState();
  const resultModal = useModal(ResultModal);
  const mintModal = useModal(MintModal);

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

  // const getResult = async (contractAddress: string, TransactionResult: ITransactionResult, TransactionId: string) => {
  const getResult = async () => {
    // TODO
    const logResult: IClaimDropResult = {
      currentAmount: 2,
      totalAmount: 1000,
      dropId: '11111',
      claimDetailRecord: {
        value: [
          {
            symbol: 'symbol',
            amount: 1,
            tokenName: 'nftName',
          },
        ],
      },
    };
    return logResult;
    // const proto = Proto.getInstance().getProto();
    // const currentProto = proto[contractAddress];
    // if (currentProto) {
    //   const log = TransactionResult?.Logs?.filter((item) => {
    //     return item.Name === 'BatchBuyNowResult';
    //   })?.[0];
    //   if (log) {
    //     try {
    //       const logResult: IClaimDropResult = await deserializeLog(log, currentProto);
    //       return logResult;
    //     } catch (error) {
    //       sendMessage({
    //         name: 'BatchBuyNowResultDeserializeLog',
    //         contractAddress,
    //         TransactionResult,
    //         TransactionId,
    //         errorMsg: error,
    //       });
    //       return false;
    //     }
    //   } else {
    //     sendMessage({
    //       name: 'BatchBuyNowResultDeserializeLog',
    //       contractAddress,
    //       TransactionResult,
    //       TransactionId,
    //       errorMsg: 'no log events',
    //     });
    //     return false;
    //   }
    // } else {
    //   sendMessage({
    //     name: 'BatchBuyNowResultDeserializeProto',
    //     contractAddress,
    //     TransactionResult,
    //     TransactionId,
    //     errorMsg: 'no proto',
    //     proto,
    //   });
    //   return false;
    // }
  };

  const showErrorModal = () => {
    resultModal.show({
      previewImage: dropDetailInfo?.logoUrl,
      title: MintNftMessage.errorMessage.title,
      info: {
        title: dropDetailInfo?.collectionName,
      },
      buttonInfo: {
        btnText: 'Try Again',
        onConfirm: () => {
          mintModal.show();
        },
      },
      error: {
        title: MintNftMessage.errorMessage.tips,
        description: MintNftMessage.errorMessage.description,
      },
    });
  };

  const claimDrop = async (params: IClaimDropParams) => {
    // TODO
    try {
      // const approveTokenResult = await checkELFApprove({
      //   chainId: chainId,
      //   price: {
      //     symbol: 'ELF',
      //     amount: 10000000,
      //   },
      //   quantity: 10000000,
      //   spender:
      //     chainId === SupportedELFChainId.MAIN_NET ? getForestContractAddress().main : getForestContractAddress().side,
      //   address: walletInfo.address || '',
      // });

      // if (!approveTokenResult) {
      //   return 'failed';
      // }
      // const result = await ClaimDrop({
      //   dropId: params.dropId,
      //   claimAmount: params.claimAmount,
      // });
      // if (result) {
      //   const { TransactionId, TransactionResult } = (result.result || result) as ISendResult;
      //   if (TransactionResult) {
      //     const res = await getResult(aelfInfo.marketSideAddress, TransactionResult, TransactionId);
      //     if (res) {
      //       return {
      //         ...res,
      //         TransactionId,
      //       };
      //     } else {
      //       message.error(DEFAULT_ERROR);
      //       return 'failed';
      //     }
      //   }
      // } else {
      //   message.error(DEFAULT_ERROR);
      //   return 'failed';
      // }

      await sleep(1000);
      const res = await getResult();
      return {
        ...res,
        TransactionId: '3452735472354723',
      };
    } catch (error) {
      message.destroy();
      const resError = error as unknown as IContractError;
      if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
        return Promise.reject(error);
      }
      showErrorModal();
      return 'failed';
    }
  };

  return { claimDrop };
};
