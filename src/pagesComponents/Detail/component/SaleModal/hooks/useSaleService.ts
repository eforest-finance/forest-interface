import { useCallback, useEffect, useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import { INftInfo } from 'types/nftTypes';
import { isERC721 } from 'utils/isTokenIdReuse';
import { IPrice } from './useSetPrice';
import { message } from 'antd';

import getMaxNftQuantityOfSell from 'utils/getMaxNftQuantityOfSell';
import { getDurationParamsForListingContractByDuration } from '../utils/getCurListDuration';
import checkListValidity, { EditStatusType } from '../utils/checkListValidity';
import batchDeList from '../utils/batchDeList';

import { ListWithFixedPrice as ListWithFixedPriceByContract } from 'contract/market';

import { BatchDeListType, IContractError, IListedNFTInfo } from 'contract/type';
import { SupportedELFChainId } from 'constants/chain';
import { getForestContractAddress } from 'contract/forest';
import { checkNFTApprove, messageHTML } from 'utils/aelfUtils';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { timesDecimals } from 'utils/calculate';

import { IDurationData } from './useDuration';

import { fetchNftSalesInfo } from 'api/fetch';
import { useRequest } from 'ahooks';
import useTokenData from 'hooks/useTokenData';
import { ApproveListingModal } from '../modal/ApproveListingModal';
import { ApproveCancelListingModal } from '../modal/ApproveCancelListingModal';
import { ListingSuccessModal } from '../modal/ListingSuccessModal';
import { EditListingSuccessModal } from '../modal/EditListingSuccessModal';
import { InValidListMsgModal } from '../modal/InValidListMsgModal';
import { SaleListingModal } from '../../SaleListingModal';
import { NiceModalHandler, useModal } from '@ebay/nice-modal-react';
import { setApproveListingModalRetry, setInvalidListingModalRetry } from 'store/reducer/saleInfo/sellModalsInfo';
import { dispatch } from 'store/store';
import moment from 'moment';
import { getExploreLink } from 'utils';
import BigNumber from 'bignumber.js';

export function getDefaultDataByNftInfoList(infoList?: IListedNFTInfo[], showPrevious?: boolean) {
  if (!infoList?.length) return;
  const infoSortList = infoList
    .slice(0)
    .sort((item1, item2) => new BigNumber(item1.price.amount).comparedTo(new BigNumber(item2.price.amount)));
  const info = infoSortList[0];
  console.log('getDefaultDataByNftInfoList', info);

  return {
    listingPrice: {
      price: BigNumber(info.price.amount)
        .dividedBy(10 ** 8)
        .toNumber(),
      token: {
        symbol: 'ELF',
        tokenId: 'ELF',
        decimals: 8,
      },
    },
    duration: {
      type: 'date',
      value: new Date(
        (Number(info?.duration?.startTime?.seconds || 0) +
          Number(info?.duration?.durationMinutes || 0) * 60 +
          Number(info?.duration.durationHours || 0) * 3600) *
          1000,
      ),
      showPrevious,
    },
    itemsForSell: Number(info.quantity),
  };
}

export function useGetListItemsForSale(nftInfo: INftInfo) {
  const { walletInfo } = useGetState();

  const [listedNFTInfoList, setListedNFTInfoList] = useState<IListedNFTInfo[]>([]);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [listItems, setListItems] = useState<number>(0);

  const [loadingMaxQuantity, setLoadingMaxQuantity] = useState<boolean>(false);

  const getMaxNftQuantity = useCallback(async () => {
    if (nftInfo?.nftSymbol && walletInfo.address) {
      setLoadingMaxQuantity(true);
      const res = await getMaxNftQuantityOfSell(nftInfo?.chainId, nftInfo, walletInfo.address);
      if (!res) {
        return;
      }

      console.log('getMaxNftQuantityOfSell', res);

      setMaxQuantity(!isERC721(nftInfo) ? res.max : 1);
      setListedNFTInfoList(res.listedNFTInfoList);
      setListItems(res.listItems);
      setLoadingMaxQuantity(false);
    }
  }, [nftInfo, walletInfo.address]);

  useEffect(() => {
    getMaxNftQuantity();
  }, [getMaxNftQuantity]);

  return {
    maxQuantity,
    listItems,
    listedNFTInfoList,
  };
}

function useGetNftSaleInfo(id: string) {
  const { data } = useRequest(() => fetchNftSalesInfo({ id }), { refreshDeps: [id] });
  return {
    nftSaleInfo: data,
  };
}

export function useSaleService(nftInfo: INftInfo, sellModalInstance: NiceModalHandler, mode: string, defaultData: any) {
  const { walletInfo } = useGetState();
  const { nftSaleInfo } = useGetNftSaleInfo(nftInfo.id);
  const { listItems, listedNFTInfoList, maxQuantity: availableItemForSell } = useGetListItemsForSale(nftInfo);
  const [listingBtnDisable, setListBtnDisable] = useState<boolean>(false);
  const [floorPrice, setFloorPrice] = useState<Number | undefined>(0);
  const [recentDealPrice, setRecentDealPrice] = useState<Number | undefined>();
  const [listingPrice, setListingPrice] = useState<IPrice>(defaultData?.listingPrice || {});
  const [duration, setDuration] = useState<IDurationData>(defaultData?.duration || {});
  const [isLoading, setLoading] = useState<boolean>();
  const [itemsForSell, setItemsForSell] = useState<number>(isERC721(nftInfo) ? 1 : 0);
  const elfRate = useTokenData();

  const approveListingModal = useModal(ApproveListingModal);
  const listingSuccessModal = useModal(ListingSuccessModal);
  const editListingSuccessModal = useModal(EditListingSuccessModal);
  const invalidListModal = useModal(InValidListMsgModal);
  const saleListingModal = useModal(SaleListingModal);
  const approveCancelListingModal = useModal(ApproveCancelListingModal);

  const listFail = (error?: IContractError) => {
    if (error) message.error(error.errorMessage?.message || DEFAULT_ERROR);
    setLoading(false);
  };

  const hideAllModal = () => {
    approveListingModal.hide();
    listingSuccessModal.hide();
    editListingSuccessModal.hide();
    invalidListModal.hide();
    saleListingModal.hide();
    approveCancelListingModal.hide();
    sellModalInstance.hide();
  };

  const listWithFixedPrice = async (amount: number, status?: EditStatusType) => {
    try {
      const spender =
        nftInfo?.chainId === SupportedELFChainId.MAIN_NET
          ? getForestContractAddress().main
          : getForestContractAddress().side;
      const approveRes = await checkNFTApprove({
        symbol: nftInfo!.nftSymbol,
        address: walletInfo?.address,
        spender,
        amount,
        chainId: nftInfo.chainId,
      });

      if (!approveRes) {
        if (mode === 'edit') {
          dispatch(setInvalidListingModalRetry(true));
          dispatch(setApproveListingModalRetry(true));
        } else {
          dispatch(setApproveListingModalRetry(true));
        }
        listFail();
        return;
      }

      const durationList = getDurationParamsForListingContractByDuration(duration);
      const result = await ListWithFixedPriceByContract(
        {
          symbol: nftInfo.nftSymbol,
          price: {
            symbol: listingPrice?.token?.symbol || '',
            amount: Number(timesDecimals(listingPrice?.price, listingPrice?.token?.decimals)),
          },
          quantity: amount,
          duration: durationList,
          whitelists: null,
          isWhitelistAvailable: false,
        },
        {
          chain: nftInfo.chainId,
        },
      );
      if (result?.error || !result) {
        if (mode === 'edit') {
          dispatch(setInvalidListingModalRetry(true));
          dispatch(setApproveListingModalRetry(true));
        } else {
          dispatch(setApproveListingModalRetry(true));
        }
        listFail(result || DEFAULT_ERROR);
        return;
      }

      setLoading(false);

      const { TransactionId } = result.result || result;
      messageHTML(TransactionId || '', 'success', nftInfo.chainId);
      const explorerUrl = getExploreLink(TransactionId!, 'transaction', nftInfo.chainId);
      approveListingModal.hide();
      if (mode === 'edit') {
        editListingSuccessModal.show({
          nftInfo,
          explorerUrl,
          onViewMyListing: hideAllModal,
          status,
        });
      } else {
        listingSuccessModal.show({ nftInfo, explorerUrl, onViewMyListing: hideAllModal });
      }
    } catch (error) {
      const resError = error as IContractError;
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      setLoading(false);
      if (mode === 'edit') {
        dispatch(setInvalidListingModalRetry(true));
        dispatch(setApproveListingModalRetry(true));
      } else {
        dispatch(setApproveListingModalRetry(true));
      }
    }
  };

  const onCancelAllListings = async () => {
    sellModalInstance.hide();
    approveCancelListingModal.show({
      handle: async () => {
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
        approveCancelListingModal.hide();
      },
      itemsNumberForDel: -1,
      isBatch: true,
      listingsNumber: listedNFTInfoList.length,
    });
  };

  const onReEditListing = () => {
    approveListingModal.hide();
    sellModalInstance.show({
      nftInfo,
      type: 'add',
      defaultData: {
        listingPrice,
        duration,
        itemsForSell,
      },
    });
  };

  const delNotValidListingAndContinueListing = async (status: BatchDeListType, amount: number) => {
    let res;
    try {
      res = await batchDeList(
        {
          symbol: nftInfo.nftSymbol,
          price: {
            symbol: listingPrice?.token?.symbol || '',
            amount: Number(timesDecimals(listingPrice?.price, listingPrice?.token?.decimals)),
          },
          batchDelistType: status,
        },
        nftInfo.chainId,
      );
    } catch (_) {
      dispatch(setInvalidListingModalRetry(true));
    }
    if (!res) {
      dispatch(setInvalidListingModalRetry(true));
      return;
    }

    invalidListModal.hide();
    approveListingModal.show({
      nftSaleInfo,
      itemsForSell,
      listingPrice: listingPrice.price,
      listingUSDPrice: listingUSDPrice,
      onRetry: async () => await listWithFixedPrice(amount),
      onReEdit: onReEditListing,
    });
    listWithFixedPrice(amount);
  };
  const onEditListingForERC721 = async () => {
    if (!checkInputDataBeforeSubmit()) return;
    sellModalInstance.hide();
    const amount = 1;
    const durationList = getDurationParamsForListingContractByDuration(duration);

    dispatch(setInvalidListingModalRetry(false));
    dispatch(setApproveListingModalRetry(false));

    const { status, invalidList, extendStatus } = await checkListValidity(
      `${listingPrice?.price}`,
      listedNFTInfoList,
      durationList,
    );

    console.log('checkListValidity', status);
    if (status === BatchDeListType.GREATER_THAN) {
      approveListingModal.show({
        nftSaleInfo,
        itemsForSell,
        listingPrice: listingPrice.price,
        listingUSDPrice: listingUSDPrice,
        onRetry: async () => await listWithFixedPrice(amount, extendStatus),
        onReEdit: onReEditListing,
      });
      listWithFixedPrice(amount, extendStatus);
    } else {
      invalidListModal.show({
        nftInfo,
        validType: status,
        invalidList,
        onRetry: () => delNotValidListingAndContinueListing(status, 1),
      });
      delNotValidListingAndContinueListing(status, 1);
    }
  };

  const onEditListingForERC1155 = () => {
    sellModalInstance.hide();
    saleListingModal.show(nftInfo);
  };

  const checkInputDataBeforeSubmit = () => {
    if (Number(itemsForSell) > Number(availableItemForSell)) {
      message.error('Your balance of NFT is not enough');
      return false;
    }
    if (duration?.type === 'date') {
      const timeDifference = moment(duration.value).diff(moment());
      console.log('duration test', duration.value);
      const minutesDifference = moment.duration(timeDifference).asMinutes();
      const months = moment.duration(timeDifference).asMonths();
      if (minutesDifference < 15) {
        message.error('The listing duration should be at least 15 minutes.');
        return false;
      }
      if (months > 6) {
        message.error('The listing duration should be no more than 6 months.');
        return false;
      }
    }
    return true;
  };

  const onCompleteListingHandler = async () => {
    if (!walletInfo.address || !nftInfo.nftSymbol || !checkInputDataBeforeSubmit()) return;
    dispatch(setApproveListingModalRetry(false));

    sellModalInstance.hide();

    if (isERC721(nftInfo)) {
      const amount = 1;
      if (mode === 'add') {
        approveListingModal.show({
          nftSaleInfo,
          itemsForSell,
          listingPrice: listingPrice.price,
          listingUSDPrice: listingUSDPrice,
          onRetry: async () => await listWithFixedPrice(amount),
          onReEdit: onReEditListing,
        });
        listWithFixedPrice(amount);
        return;
      }
    }

    if (!isERC721(nftInfo)) {
      const amount = itemsForSell;
      approveListingModal.show({
        nftSaleInfo,
        itemsForSell,
        listingPrice: listingPrice.price,
        listingUSDPrice: listingUSDPrice,
        onRetry: async () => await listWithFixedPrice(amount),
        onReEdit: onReEditListing,
      });
      listWithFixedPrice(amount);
    }
  };

  useEffect(() => {
    if (!Number(listingPrice.price) || !duration?.value || !Number(itemsForSell)) {
      setListBtnDisable(true);
      return;
    }
    setListBtnDisable(false);
  }, [duration, listingPrice, itemsForSell]);

  const listingUSDPrice = useMemo(() => {
    if (!listingPrice?.price || !elfRate) return;
    return elfRate * Number(listingPrice.price);
  }, [elfRate, listingPrice]);

  return {
    nftSaleInfo,
    listingBtnDisable,
    floorPrice,
    recentDealPrice,
    listingPrice,
    setListingPrice,
    listItems,
    setDuration,
    onCompleteListingHandler,
    listingUSDPrice,
    itemsForSell,
    setItemsForSell,
    onCancelAllListings,
    onEditListingForERC721,
    onEditListingForERC1155,
    availableItemForSell,
  };
}
