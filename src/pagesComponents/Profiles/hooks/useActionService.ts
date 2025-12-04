import { INftInfo } from 'types/nftTypes';
import useGetState from 'store/state/getState';
import { IBatchCancelListParams, IBatchCancelOfferListParams, IContractError } from 'contract/type';

import { NiceModalHandler, useModal } from '@ebay/nice-modal-react';
import BigNumber from 'bignumber.js';
import { message } from 'antd';
import { messageHTML } from 'utils/aelfUtils';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import PromptModal from 'components/PromptModal';
import ApproveModal from 'components/ApproveModal/index';

import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import useCancelOffer from 'pagesComponents/Detail/hooks/useCancelOffer';
import ExchangeModal, { ArtType } from 'pagesComponents/Detail/component/ExchangeModal';
import AcceptModal from 'pagesComponents/Detail/component/AcceptModal';
import CancelListModal from 'components/CancelListModal';

import { getBalance, getTokenInfo } from 'pagesComponents/Detail/utils/getNftNumber';
import { BatchCancelList, BatchCancelOfferList, CancelOffer, Delist } from 'contract/market';
import { IActivitiesItem } from 'api/types';
import { useState } from 'react';
import { timesDecimals } from 'utils/calculate';

interface IUseCancelListingProps {
  nftInfo?: INftInfo;
  rate?: number;
  onFinish?: () => void;
  listingModalInstance?: NiceModalHandler;
}

export default function useActionService(props?: IUseCancelListingProps) {
  const { listingModalInstance, onFinish } = props || {};
  const { walletInfo, infoState } = useGetState();
  const elfRate = infoState.elfRate;

  const promptModal = useModal(PromptModal);
  const [loading, setLoading] = useState<boolean>(false);

  const exchangeModal = useModal(ExchangeModal);
  const acceptModal = useModal(AcceptModal);
  const approveModal = useModal(ApproveModal);
  const cancelListModal = useModal(CancelListModal);

  const { getAccountInfoSync } = useWalletSyncCompleted();
  const cancelOffer = useCancelOffer();

  const batchCancelList = async (params: IBatchCancelListParams, chainId: Chain) => {
    try {
      return await BatchCancelList(params, {
        chain: chainId,
      });
    } catch (error) {
      message.error(error?.errorMessage?.message);
      return Promise.reject(error);
    }
  };

  const batchCancelOfferList = async (params: IBatchCancelOfferListParams, chainId: Chain) => {
    try {
      return await BatchCancelOfferList(params, {
        chain: chainId,
      });
    } catch (error) {
      message.error(error?.errorMessage?.message);
      return Promise.reject(error);
    }
  };

  const cancelAllListings = async (type: 'offer' | 'active', rows: IActivitiesItem[], chainId: Chain) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }

    // setLoading(true);

    console.log('rows:', rows);

    cancelListModal.show({
      list: rows.map((item) => {
        const total = item.price * (item?.quantity || 0);
        const usdPrice = total * (item?.purchaseToken?.symbol === 'ELF' ? elfRate : 1);
        return {
          image: item.previewImage,
          collectionName: item.collectionName,
          nftName: item.nftName,
          priceTitle: type === 'offer' ? 'Total Offer' : 'Listing Price',
          price: `${formatTokenPrice(total)} ${'ELF'}`,
          usdPrice: formatUSDPrice(usdPrice),
          number: item?.quantity,
        };
      }),
      title: type === 'offer' ? 'Cancel Offer' : 'Cancel Listing',
      initialization: async () => {
        try {
          let result = {} as any;
          if (type === 'offer') {
            const cancelOfferList = rows.map((item) => {
              return {
                symbol: item.nftSymbol || '',
                expireTime: {
                  nanos: 0,
                  seconds: `${(item?.expireTime || 0) / 1000}`,
                },
                offerTo: item.toAddress || '',
                price: {
                  symbol: 'ELF',
                  amount: new BigNumber(item?.price || 0).times(10 ** 8).toNumber(),
                },
              };
            });

            const params = {
              batchCancelOfferInfo: {
                cancelOfferList,
              },
            };
            result = (await batchCancelOfferList(params, chainId)) as IContractError;
          } else {
            const cancelList = rows.map((item) => {
              return {
                symbol: item.nftSymbol || '',
                quantity: item.originQuantity || 0,
                startTime: {
                  nanos: 0,
                  seconds: `${(item?.startTime || 0) / 1000}`,
                },
                price: {
                  symbol: 'ELF',
                  amount: new BigNumber(item?.price || 0).times(10 ** 8).toNumber(),
                },
              };
            });
            const params = {
              batchCancelListInfo: {
                cancelList,
              },
            };
            result = (await batchCancelList(params, chainId)) as IContractError;
          }
          message.destroy();
          const { TransactionId } = result.result || result;
          messageHTML(TransactionId as string, 'success', chainId);
          cancelListModal.hide();
        } catch (error) {
          cancelListModal.hide();
          const resError = error as IContractError;
          if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
            message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
            return Promise.reject(error);
          }
          message.error(resError.errorMessage?.message || DEFAULT_ERROR);
        }
        onFinish && onFinish();
      },
      onClose: () => {
        cancelListModal.hide();
      },
    });
  };

  const dealTheOffer = async (record: any, elfRate: number) => {
    const convertPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? elfRate : 1);
    const art: ArtType = {
      id: record?.nftTokenId,
      name: record?.nftName || '',
      token: { symbol: record?.purchaseToken.symbol },
      symbol: record?.nftSymbol || '',
      collection: record.collectionName,
      nftDecimals: Number(record?.decimals || 0),
      decimals: record?.decimals,
      price: record?.price,
      quantity: record?.quantity,
      convertPrice,
      address: record?.from?.address || '',
      collectionSymbol: `${record.nftName}-0`,
    };

    const owner = walletInfo.address;
    const chainId = infoState.sideChain;
    const res = await Promise.all([
      getBalance({ owner, symbol: 'ELF' }, chainId),
      getBalance({ owner, symbol: art.symbol! }, chainId),
      getTokenInfo({ symbol: art.symbol! }, chainId),
    ]);

    const nftDecimals = Number(res[2]?.decimals || 0);
    const nftBalance = Math.floor(
      BigNumber(res[1] || 0)
        .dividedBy(10 ** nftDecimals)
        .toNumber(),
    );

    const nftInfo = {
      chainId: record.chainId,
      previewImage: record.previewImage,
      tokenName: record.nftName,
      nftSymbol: record.nftSymbol,
      totalQuantity: record.quantity,
      nftCollection: {
        tokenName: record.collectionName,
        logoImage: '',
        symbol: record?.nftCollection?.symbol,
      },
      nftBalance,
    };

    acceptModal.show({
      art,
      rate: elfRate,
      nftInfo,
      nftBalance: nftBalance,
      onClose: () => {
        acceptModal.hide();
        onFinish && onFinish();
      },
    });
  };

  const cancelList = async (
    parameter: {
      symbol: string;
      quantity: number;
      nftDecimals: number;
      price: {
        amount: number;
        symbol: string;
      };
      startTime: {
        nanos: number;
        seconds: number;
      };
    },
    chainId: Chain,
  ) => {
    const result = await Delist(parameter, {
      chain: chainId,
    });
    return result;
  };

  const cancelListing = async (item: any, chainId: Chain) => {
    console.log(new BigNumber(item?.price || 0).times(10 ** 8).toNumber());
    const result = await cancelList(
      {
        symbol: item.nftSymbol,
        quantity: item.originQuantity,
        nftDecimals: item.decimals,
        price: {
          symbol: 'ELF',
          amount: new BigNumber(item?.price || 0).times(10 ** 8).toNumber(),
        },
        startTime: {
          nanos: 0,
          seconds: Math.floor((item?.startTime || 0) / 1000),
        },
      },
      chainId,
    );

    return result;
  };

  const cancelOfferList = async (item: any) => {
    const result = await CancelOffer({
      symbol: item?.nftSymbol || '',
      offerFrom: item?.from?.address || '',
      cancelOfferList: [
        {
          expireTime: {
            nanos: 0,
            seconds: `${(item?.expireTime || 0) / 1000}`,
          },
          offerTo: item?.to?.address,
          price: {
            symbol: 'ELF',
            amount: new BigNumber(item?.price || 0).times(10 ** 8).toNumber(),
          },
        },
      ],
    });

    return result;
  };

  const cancelListingByRecord = async (
    item: any,
    rate: number,
    actionType: 'cancel offer' | 'cancel list',
    chainId: Chain,
  ) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }

    listingModalInstance?.hide();
    const totalPrice = item.quantity * item.price;
    const usdPrice = totalPrice * (item?.purchaseToken?.symbol === 'ELF' ? rate : 1);
    approveModal.show({
      nftInfo: {
        image: item?.previewImage || '',
        collectionName: item.collectionName,
        nftName: item?.nftName,
        priceTitle: actionType === 'cancel offer' ? 'Total Offer' : 'Listing Price',
        price: `${formatTokenPrice(totalPrice)} ${item.purchaseToken.symbol || 'ELF'}`,
        usdPrice: formatUSDPrice(usdPrice),
        number: item.quantity,
      },
      title: actionType === 'cancel offer' ? 'Cancel Offer' : 'Cancel Listing',
      amount: item.quantity,
      showBalance: false,
      initialization: async () => {
        try {
          try {
            let result;
            if (actionType === 'cancel offer') {
              result = (await cancelOfferList(item)) as IContractError;
            } else {
              result = (await cancelListing(item, chainId)) as IContractError;
            }

            message.destroy();
            const { TransactionId } = result.result || result;
            messageHTML(TransactionId as string, 'success', item.chainId);
            approveModal.hide();
          } catch (error) {
            approveModal.hide();

            const resError = error as IContractError;
            if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
              message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
              return Promise.reject(error);
            }
            message.error(resError.errorMessage?.message || DEFAULT_ERROR);
          }
          onFinish && onFinish();
        } catch (error) {
          approveModal.hide();
          return Promise.reject(error);
        }
      },
      onClose: () => {
        approveModal.hide();
      },
    });

    // promptModal.show({
    //   nftInfo: {
    //     image: item?.previewImage || '',
    //     collectionName: item.nftCollectionName,
    //     nftName: item?.nftName,
    //     priceTitle: 'Listing Price',
    //     price: `${formatTokenPrice(item.price)} ${item.purchaseToken.symbol || 'ELF'}`,
    //     usdPrice: formatUSDPrice(usdPrice),
    //     item: handlePlurality(Number(item.quantity), 'item'),
    //   },
    //   title: CancelListingMessage.title,
    //   content: {
    //     title: walletInfo.portkeyInfo ? CancelListingMessage.portkey.title : CancelListingMessage.default.title,
    //     content: walletInfo.portkeyInfo ? CancelListingMessage.portkey.message : CancelListingMessage.default.message,
    //   },
    //   initialization: async () => {
    //     try {
    //       try {
    //         let result;
    //         if (actionType === 'cancel offer') {
    //           result = (await cancelOfferList(item)) as IContractError;
    //         } else {
    //           result = (await cancelListing(item, chainId)) as IContractError;
    //         }

    //         message.destroy();
    //         const { TransactionId } = result.result || result;
    //         messageHTML(TransactionId as string, 'success', item.chainId);
    //       } catch (error) {
    //         const resError = error as IContractError;
    //         if (resError.errorMessage?.message.includes(UserDeniedMessage)) {
    //           message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    //           return Promise.reject(error);
    //         }
    //         message.error(resError.errorMessage?.message || DEFAULT_ERROR);
    //       }
    //       promptModal.hide();
    //       onFinish && onFinish();
    //     } catch (error) {
    //       return Promise.reject(error);
    //     }
    //   },
    //   onClose: () => {
    //     promptModal.hide();
    //   },
    // });
  };

  return {
    cancelAllListings,
    dealTheOffer,
    cancelListing,
    cancelListingByRecord,
    loading,
    setLoading,
  };
}
