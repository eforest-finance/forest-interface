import { useModal } from '@ebay/nice-modal-react';
import ApproveModal from 'components/ApproveModal';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { useListingService } from '../../SaleListingModal/hooks/useListingService';
import { INftInfo } from 'types/nftTypes';
import moment from 'moment';
import { BatchDeListType, IContractError, IPrice, ITimestamp } from 'contract/type';
import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import batchDeList from '../utils/batchDeList';
import { BatchDeList } from 'contract/market';
import { IDurationData } from './useDuration';

export function useEdit(nftInfo: any, elfRate: number, modal: any) {
  const approveModal = useModal(ApproveModal);

  const delist = async () => {
    const chainId = nftInfo.chainId;
    try {
      const result = await BatchDeList(
        {
          symbol: nftInfo.nftSymbol,
          price: {
            symbol: 'ELF',
            amount: 1,
          },
          batchDelistType: BatchDeListType.GREATER_THAN,
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

  const handleDelist = async (
    {
      duration,
      listingPrice,
    }: {
      duration: IDurationData;
      listingPrice: number;
    },
    onFinish: any,
    onFailed: any,
  ) => {
    try {
      await delist();
      onFinish && onFinish();
      approveModal.hide();
    } catch (error) {
      approveModal.hide();
      modal.show({
        nftInfo,
        defaultData: {
          listingPrice,
          duration,
          itemsForSell: 1,
        },
        type: 'edit',
      });
      onFailed && onFailed();
      return Promise.reject(error);
    }
  };

  const handleEditListing = (
    {
      duration,
      listingPrice,
    }: {
      duration: IDurationData;
      listingPrice: number;
    },
    handleCompleteListing: any,
  ) => {
    handleCancel(
      {
        duration,
        listingPrice,
      },
      () => {
        handleCompleteListing('edit');
      },
    );
  };

  const handleCancel = (
    {
      duration,
      listingPrice,
    }: {
      duration: IDurationData;
      listingPrice: number;
    },
    onFinish?: any,
    onFailed?: any,
  ) => {
    modal.hide();
    // 721
    const totalPrice = nftInfo?.listingPrice * 1;
    const usdPrice = totalPrice * elfRate;
    approveModal.show({
      nftInfo: {
        image: nftInfo?.previewImage || '',
        collectionName: nftInfo?.nftCollection?.tokenName,
        nftName: nftInfo?.tokenName,
        priceTitle: 'Listing Price',
        price: `${formatTokenPrice(totalPrice)} ELF`,
        usdPrice: formatUSDPrice(usdPrice),
        number: 1,
      },
      title: 'Cancel Listing',
      initialization: () =>
        handleDelist(
          {
            duration,
            listingPrice,
          },
          onFinish,
          onFailed,
        ),
      amount: 1,
      showBalance: false,
      onClose: () => {
        approveModal.hide();
      },
    });
  };

  return {
    handleEditListing,
    handleCancel,
  };
}
