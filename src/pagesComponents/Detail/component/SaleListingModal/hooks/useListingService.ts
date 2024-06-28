import { useMount } from 'react-use';
import { INftInfo } from 'types/nftTypes';
import useGetState from 'store/state/getState';
import batchDeList from 'pagesComponents/Detail/component/SaleModal/utils/batchDeList';
import { BatchDeListType, IContractError, IPrice, ITimestamp } from 'contract/type';
import { FormatListingType } from 'store/types/reducer';
import { useState } from 'react';
import getListings from 'pagesComponents/Detail/utils/getListings';
import { NiceModalHandler, useModal } from '@ebay/nice-modal-react';
import { ApproveCancelListingModal } from '../../SaleModal/modal/ApproveCancelListingModal';
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

export function useListingService(
  nftInfo?: INftInfo,
  rate?: number,
  listingModalInstance?: NiceModalHandler,
  notFetchData?: boolean,
) {
  const { walletInfo } = useGetState();
  const [data, setData] = useState<FormatListingType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const approveCancelListingModal = useModal(ApproveCancelListingModal);
  const promptModal = useModal(PromptModal);

  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);
  const getListingInfo = async () => {
    try {
      setLoading(true);
      const res = await getListings({
        page: 1,
        pageSize: 100000,
        symbol: nftInfo!.nftSymbol,
        address: walletInfo.address,
        chainId: nftInfo!.chainId,
      });

      if (!res) {
        setData([]);
        return;
      }

      setData(res.list);
    } catch (error) {
      /* empty */
    }
    setLoading(false);
  };

  useMount(() => {
    if (notFetchData) {
      return;
    }
    getListingInfo();
  });

  const handleBatchDeList = async () => {
    await batchDeList(
      {
        symbol: nftInfo.nftSymbol,
        price: {
          symbol: 'ELF',
          amount: 1,
        },
        batchDelistType: BatchDeListType.GREATER_THAN,
      },
      nftInfo.chainId,
    );
    listingModalInstance && listingModalInstance.hide();
  };

  const cancelAllListings = async () => {
    // let itemsNumberForDel = 1;
    // if (!isERC721 && data?.length) {
    //   itemsNumberForDel = data.reduce((pre, curItem) => pre + curItem.quantity, 0);
    // }
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }
    listingModalInstance?.hide();
    approveCancelListingModal.show({
      handle: () => handleBatchDeList(),
      isBatch: true,
      itemsNumberForDel: -1,
      listingsNumber: data?.length,
    });
  };

  const delist = async (parameter: {
    symbol: string;
    quantity: number;
    price: IPrice;
    startTime: ITimestamp;
    nftDecimals: number;
  }) => {
    const chainId = nftInfo.chainId;
    try {
      const result = await Delist(
        {
          symbol: parameter.symbol,
          quantity: timesDecimals(parameter.quantity, parameter.nftDecimals || '0').toNumber(),
          price: { ...parameter.price, amount: new BigNumber(parameter.price.amount).times(10 ** 8).toNumber() },
          startTime: parameter.startTime,
        },
        {
          chain: chainId,
        },
      );

      message.destroy();
      const { TransactionId } = result.result || result;
      messageHTML(TransactionId as string, 'success', chainId);
      return result;
    } catch (error) {
      const resError = error as IContractError;
      if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
        message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
        return Promise.reject(error);
      }
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      return 'failed';
    }
  };

  const handleDelist = async (data: FormatListingType) => {
    try {
      await delist({
        symbol: nftInfo?.nftSymbol || '',
        quantity: data.quantity,
        nftDecimals: Number(nftInfo?.decimals || 0),
        price: {
          symbol: (data as FormatListingType)?.purchaseToken?.symbol,
          amount: data?.price as number,
        },
        startTime: {
          seconds: moment.unix(Math.floor((data as FormatListingType).startTime / 1000)).unix(),
          nanos: 0,
        },
      });
      getListingInfo();
      promptModal.hide();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const cancelListingItem = async (item: FormatListingType) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }

    listingModalInstance?.hide();
    const usdPrice = item?.price * (item?.purchaseToken?.symbol === 'ELF' ? rate : 1);

    promptModal.show({
      nftInfo: {
        image: nftInfo?.previewImage || '',
        collectionName: nftInfo?.nftCollection?.tokenName,
        nftName: nftInfo?.tokenName,
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
      initialization: () => handleDelist(item),
      onClose: () => {
        promptModal.hide();
      },
    });
  };

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
    cancelAllListings,
    cancelListingItem,
    cancelListingByRecord,
    loading,
    listings: data || [],
  };
}
