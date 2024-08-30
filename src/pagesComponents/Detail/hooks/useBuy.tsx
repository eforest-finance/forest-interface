import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { useCheckLoginAndToken, useWalletSyncCompleted } from 'hooks/useWalletSync';
import getListings from 'pagesComponents/Detail/utils/getListings';
import { FormatListingType } from 'store/types/reducer';
import { IFixPriceList } from 'contract/type';
import BigNumber from 'bignumber.js';
import useBatchBuyNow from 'pagesComponents/Detail/hooks/useBatchBuyNow';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import moment from 'moment';
import { divDecimals, timesDecimals } from 'utils/calculate';
import { useGetMainChainBalance } from 'pagesComponents/Detail/hooks/useGetMainChainToken';
import { useGetSalesInfo } from 'pagesComponents/Detail/hooks/useGetSalesInfo';
import { BuyMessage } from 'constants/promptMessage';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { WalletType, useWebLogin } from 'aelf-web-login';
import CrossChainTransferModal, { CrossChainTransferType } from 'components/CrossChainTransferModal';
import { handlePlurality } from 'utils/handlePlurality';
import { isERC721 } from 'utils/isTokenIdReuse';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import { getExploreLink } from 'utils';
import { getNFTNumber } from 'pagesComponents/Detail/utils/getNftNumber';
import { PriceTypeEnum } from '../component/BuyNowModal/components/PriceInfo';

function useBuy(options: {
  elfRate: number;
  quantity: number;
  saleInfo: any;
  onClose?: () => void;
  buyItem?: FormatListingType;
}) {
  const { onClose, elfRate, buyItem, quantity, saleInfo } = options;

  const { infoState, walletInfo, aelfInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<FormatListingType[]>([]);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [buyListings, setBuyListings] = useState<IFixPriceList[]>([]);
  const batchBuyNow = useBatchBuyNow(nftInfo?.chainId);
  const { walletType } = useWebLogin();
  const isPortkeyConnected = walletType === WalletType.portkey;
  // const saleInfo = useGetSalesInfo(nftInfo?.id || '');
  console.log('saleInfo:', saleInfo);

  const { tokenBalance, nftTotalSupply } = detailInfo.nftNumber;

  const mainChainNftBalance = useGetMainChainBalance({ tokenName: 'ELF' });
  const transferModal = useModal(CrossChainTransferModal);

  const convertTotalPrice = useMemo(() => {
    const totalPriceBig = new BigNumber(totalPrice);
    const convert = totalPriceBig.multipliedBy(elfRate).toNumber();
    return convert;
  }, [elfRate, totalPrice]);

  const averagePrice = useMemo(() => {
    const totalPriceBig = new BigNumber(totalPrice);
    const average = quantity ? totalPriceBig.div(quantity).toNumber() : 0;
    return average;
  }, [totalPrice, quantity]);

  const convertAveragePrice = useMemo(() => {
    const averagePriceBig = new BigNumber(averagePrice);
    const convertAverage = averagePriceBig.multipliedBy(elfRate).toNumber();
    return convertAverage;
  }, [averagePrice, elfRate]);

  useEffect(() => {
    if (buyItem) {
      if (quantity > buyItem.quantity) {
        setTotalPrice(0);
        return;
      }
      setTotalPrice(quantity * buyItem.price);
    }
  }, [buyItem, quantity]);

  const { getAccountInfoSync } = useWalletSyncCompleted(aelfInfo?.curChain);

  const buyNow = async (onFinish: any, onPartialDeal: any, listItem?: FormatListingType) => {
    try {
      let buyListingData: IFixPriceList[] = [];
      const item = listItem || buyItem;

      if (item) {
        const buyListing: IFixPriceList = {
          offerTo: item.ownerAddress,
          quantity: timesDecimals(quantity, nftInfo?.decimals || '0').toNumber(),
          price: {
            symbol: item.purchaseToken.symbol,
            amount: item.price,
          },
          startTime: {
            seconds: moment.unix(Math.floor(item.startTime / 1000)).unix(),
            nanos: 0,
          },
        };
        buyListingData = [buyListing];
      } else {
        buyListingData = buyListings;
      }

      const batchBuyNowRes = await batchBuyNow({
        symbol: nftInfo?.nftSymbol || '',
        fixPriceList: buyListingData.map((list) => {
          return {
            ...list,
            price: {
              ...list.price,
              amount: Number(timesDecimals(list.price.amount, 8)),
            },
          };
        }),
        price: {
          symbol: 'ELF',
          amount: new BigNumber(timesDecimals(averagePrice, '0')).toNumber(), // elf price no need decimals
        },
        quantity,
        nftDecimals: Number(nftInfo?.decimals || 0),
      });

      console.log('batchBuyNowRes', batchBuyNowRes);

      if (batchBuyNowRes === 'not approved') {
        return Promise.reject('not approved');
      }
      if (batchBuyNowRes && batchBuyNowRes !== 'failed') {
        const explorerUrl = getExploreLink(batchBuyNowRes.TransactionId, 'transaction', nftInfo?.chainId);
        if (batchBuyNowRes.allSuccessFlag) {
          onFinish(explorerUrl, batchBuyNowRes);
        } else {
          return Promise.reject('fail');

          // const list = batchBuyNowRes.failPriceList?.value.map((item) => {
          //   const price = divDecimals(item.price.amount, 8);
          //   const convertPrice = new BigNumber(price).multipliedBy(elfRate);

          //   return {
          //     image: nftInfo?.previewImage || '',
          //     collectionName: nftInfo?.nftCollection?.tokenName,
          //     nftName: nftInfo?.tokenName,
          //     item: handlePlurality(Number(item.quantity), 'item'),
          //     priceTitle: 'Each item price',
          //     price: `${formatTokenPrice(price)} ${item.price.symbol || 'ELF'}`,
          //     usdPrice: formatUSDPrice(convertPrice),
          //   };
          // });
          // let errorCount = 0;
          // batchBuyNowRes.failPriceList?.value.forEach((item) => {
          //   errorCount += Number(item.quantity);
          // });

          // onPartialDeal(explorerUrl, batchBuyNowRes, list, errorCount);
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (buyItem && buyItem.quantity == 1) {
      setTotalPrice(buyItem.price);
    }
  }, [buyItem]);

  const calculatePrice = () => {
    if (!listings.length) {
      return;
    }
    setBuyListings([]);
    setTotalPrice(0);
    let totalPrice = 0;
    let curQuantity = 0;
    const buyListings: IFixPriceList[] = [];
    for (let i = 0; i < listings.length; i++) {
      const list = listings[i];
      if (list.quantity <= quantity - curQuantity) {
        const buyListing: IFixPriceList = {
          offerTo: list.ownerAddress,
          quantity: timesDecimals(list.quantity, nftInfo?.decimals || '0').toNumber(),
          price: {
            symbol: list.purchaseToken.symbol,
            amount: list.price,
          },
          startTime: {
            seconds: moment.unix(Math.floor(list.startTime / 1000)).unix(),
            nanos: 0,
          },
        };
        buyListings.push(buyListing);
        totalPrice += list.price * list.quantity;
        if (list.quantity === quantity - curQuantity) {
          break;
        }
        curQuantity += list.quantity;
      } else {
        const buyListing: IFixPriceList = {
          offerTo: list.ownerAddress,
          quantity: timesDecimals(quantity - curQuantity, nftInfo?.decimals || '0').toNumber(),
          price: {
            symbol: list.purchaseToken.symbol,
            amount: list.price,
          },
          startTime: {
            seconds: moment.unix(Math.floor(list.startTime / 1000)).unix(),
            nanos: 0,
          },
        };
        buyListings.push(buyListing);
        totalPrice += list.price * (quantity - curQuantity);
        break;
      }
    }
    setBuyListings(buyListings);
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    if (buyItem) return;
    if (maxQuantity < quantity && listings.length && quantity <= (saleInfo?.availableQuantity || 0)) {
      setPage((page) => {
        return ++page;
      });
    } else {
      if (quantity <= (saleInfo?.availableQuantity || 0)) {
        calculatePrice();
      }
    }
  }, [buyItem, listings, maxQuantity, quantity, saleInfo?.availableQuantity]);

  const getListingsData = async (page: number) => {
    console.log('saleInfo:', saleInfo);

    if (quantity > (saleInfo?.availableQuantity || 0)) {
      return;
    }
    try {
      if (!nftInfo) return;
      setLoading(true);
      const res = await getListings({
        page,
        chainId: nftInfo.chainId,
        symbol: nftInfo.nftSymbol,
        excludedAddress: walletInfo.address,
      });
      if (!res) return;
      setTotalCount(res.totalCount);
      const curMax = res.list.reduce((pre, val) => {
        return pre + val.quantity;
      }, 0);

      setListings([...listings, ...res.list]);
      setMaxQuantity((maxQuantity) => {
        return maxQuantity + curMax;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListingsData(page);
    getNFTNumber({
      owner: walletInfo.address,
      nftSymbol: nftInfo?.nftSymbol,
      chainId: infoState.sideChain,
    });
  }, [page, saleInfo?.availableQuantity]);

  const isSideChainBalanceInsufficient = useMemo(() => {
    return BigNumber(divDecimals(Number(tokenBalance), 8)).lt(BigNumber(totalPrice));
  }, [tokenBalance, totalPrice]);

  const isAllChainsBalanceInsufficient = useMemo(() => {
    return BigNumber(divDecimals(Number(mainChainNftBalance), 8))
      .plus(BigNumber(divDecimals(Number(tokenBalance), 8)))
      .lt(BigNumber(totalPrice));
  }, [mainChainNftBalance, tokenBalance, totalPrice]);

  //   const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     if (!e.target.value || BigNumber(e.target.value).isZero()) {
  //       setQuantity(0);
  //       return;
  //     }
  //     const inputNumber = Number(formatInputNumber(e.target.value));
  //     if (BigNumber(inputNumber).gt(buyItem?.quantity || saleInfo?.availableQuantity || 0)) {
  //       setQuantityErrorTip(
  //         'Maximum quantity exceeded. Please ensure your purchase does not exceed the available quantity.',
  //       );
  //       setTotalPrice(0);
  //     } else {
  //       setQuantityErrorTip('');
  //     }
  //     setQuantity(inputNumber);
  //   };

  //   const handleTransferShow = () => {
  //     modal.hide();
  //     transferModal.show({
  //       type: CrossChainTransferType.token,
  //       onClose: () => {
  //         transferModal.hide();
  //         modal.show();
  //       },
  //     });
  //   };

  const showQuantity = useMemo(() => {
    if (buyItem) {
      return BigNumber(buyItem.quantity).gt(1);
    }
    return BigNumber(nftTotalSupply).gt(1);
  }, [buyItem, nftTotalSupply]);

  const priceInfoType = useMemo(() => {
    return (buyItem ? buyItem.quantity > 1 : Number(nftTotalSupply) > 1) ? PriceTypeEnum.BUY : PriceTypeEnum.BUY721;
  }, [buyItem, nftTotalSupply]);

  return {
    loading,
    totalPrice,
    convertTotalPrice,
    convertAveragePrice,
    buyNow,
    priceInfoType,
    showQuantity,
    isAllChainsBalanceInsufficient,
    isSideChainBalanceInsufficient,
  };
}

export default useBuy;
