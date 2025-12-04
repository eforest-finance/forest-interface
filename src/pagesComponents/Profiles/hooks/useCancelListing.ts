import { useMount } from 'react-use';
import { INftInfo } from 'types/nftTypes';
import useGetState from 'store/state/getState';
import { IContractError } from 'contract/type';

import { NiceModalHandler, useModal } from '@ebay/nice-modal-react';
import moment from 'moment';
import { Delist } from 'contract/market';
import BigNumber from 'bignumber.js';
import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import PromptModal from 'components/PromptModal';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { handlePlurality } from 'utils/handlePlurality';
import { CancelListingMessage } from 'constants/promptMessage';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import { timesDecimals } from 'utils/calculate';

export function useCancelListing(nftInfo?: INftInfo, rate?: number, listingModalInstance?: NiceModalHandler) {
  const { walletInfo } = useGetState();
  const promptModal = useModal(PromptModal);

  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);

  const cancelListingByRecord = async (item: any, rate: number) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }

    listingModalInstance?.hide();
    const usdPrice = item?.price * (item?.purchaseToken?.symbol === 'ELF' ? rate : 1);

    promptModal.show({
      nftInfo: {
        image: item?.previewImage || '',
        collectionName: item.nftCollectionName,
        nftName: item?.nftName,
        priceTitle: 'Listing Price',
        price: `${formatTokenPrice(item.price)} ${item.purchaseToken.symbol || 'ELF'}`,
        usdPrice: formatUSDPrice(usdPrice),
        item: handlePlurality(Number(item.quantity), 'item'),
      },
      title: CancelListingMessage.title,
      content: {
        title: walletInfo.portkeyInfo ? CancelListingMessage.portkey.title : CancelListingMessage.default.title,
        content: walletInfo.portkeyInfo ? CancelListingMessage.portkey.message : CancelListingMessage.default.message,
      },
      initialization: async () => {
        try {
          try {
            const result = await Delist(
              {
                symbol: item?.nftSymbol || '',
                quantity: timesDecimals(item.quantity, Number(item?.decimals || 0) || '0').toNumber(),
                price: {
                  symbol: item.purchaseToken?.symbol,
                  amount: new BigNumber(item?.price as number).times(10 ** 8).toNumber(),
                },
                startTime: {
                  seconds: moment.unix(Math.floor(item.startTime / 1000)).unix(),
                  nanos: 0,
                },
              },
              {
                chain: item.chainId,
              },
            );

            message.destroy();
            const { TransactionId } = result.result || result;
            messageHTML(TransactionId as string, 'success', item.chainId);
          } catch (error) {
            const resError = error as IContractError;
            if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
              message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
              return Promise.reject(error);
            }
            message.error(resError.errorMessage?.message || DEFAULT_ERROR);
          }
          promptModal.hide();
        } catch (error) {
          return Promise.reject(error);
        }
      },
      onClose: () => {
        promptModal.hide();
      },
    });
  };

  return {
    cancelListingByRecord,
  };
}
