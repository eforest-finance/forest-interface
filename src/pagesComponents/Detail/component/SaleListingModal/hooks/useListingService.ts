import { useMount } from 'react-use';
import { INftInfo } from 'types/nftTypes';
import useGetState from 'store/state/getState';
import batchDeList from 'pagesComponents/SetSale/utils/batchDeList';
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

export function useListingService(nftInfo: INftInfo, listingModalInstance?: NiceModalHandler, notFetchData?: boolean) {
  const { walletInfo } = useGetState();
  const [data, setData] = useState<FormatListingType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const approveCancelListingModal = useModal(ApproveCancelListingModal);
  const getListingInfo = async () => {
    try {
      setLoading(true);
      const res = await getListings({
        page: 1,
        pageSize: 100000,
        symbol: nftInfo.nftSymbol,
        address: walletInfo.address,
        chainId: nftInfo.chainId,
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
    listingModalInstance?.hide();
    approveCancelListingModal.show({
      handle: () => handleBatchDeList(),
      isBatch: true,
      itemsNumberForDel: -1,
      listingsNumber: data?.length,
    });
  };

  const delist = async (parameter: { symbol: string; quantity: number; price: IPrice; startTime: ITimestamp }) => {
    const chainId = nftInfo.chainId;
    try {
      const result = await Delist(
        {
          symbol: parameter.symbol,
          quantity: parameter.quantity,
          price: { ...parameter.price, amount: new BigNumber(parameter.price.amount).times(10 ** 8).toNumber() },
          startTime: parameter.startTime,
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
      const resError = error as IContractError;
      message.error(resError.errorMessage?.message || resError.error?.toString() || DEFAULT_ERROR);
      return Promise.reject(error);
    }
  };

  const handleDelist = async (data: FormatListingType) => {
    await delist({
      symbol: nftInfo?.nftSymbol || '',
      quantity: data.quantity,
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
  };

  const cancelListingItem = (item: FormatListingType) => {
    listingModalInstance?.hide();
    approveCancelListingModal.show({
      data: item,
      handle: () => handleDelist(item),
    });
  };

  return {
    cancelAllListings,
    cancelListingItem,
    loading,
    listings: data || [],
  };
}
