import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { useCheckLoginAndToken, useWalletSyncCompleted } from 'hooks/useWalletSync';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import getListings from 'pagesComponents/Detail/utils/getListings';
import { FormatListingType } from 'store/types/reducer';
import { IFixPriceList } from 'contract/type';
import BigNumber from 'bignumber.js';
import useBatchBuyNow from 'pagesComponents/Detail/hooks/useBatchBuyNow';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import moment from 'moment';
import { divDecimals, timesDecimals } from 'utils/calculate';
import PriceInfo, { PriceTypeEnum } from './components/PriceInfo';
import InputQuantity from './components/InputQuantity';
import Summary from './components/Summary';
import TotalPrice from './components/TotalPrice';
import Balance from './components/Balance';
import { useGetMainChainBalance } from 'pagesComponents/Detail/hooks/useGetMainChainToken';
import { useGetSalesInfo } from 'pagesComponents/Detail/hooks/useGetSalesInfo';
import PromptModal from 'components/PromptModal';
import ResultModal from 'components/ResultModal';
import { BuyMessage } from 'constants/promptMessage';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { WalletType, useWebLogin } from 'aelf-web-login';
import CrossChainTransferModal, { CrossChainTransferType } from 'components/CrossChainTransferModal';
import { handlePlurality } from 'utils/handlePlurality';
import { isERC721 } from 'utils/isTokenIdReuse';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import { getExploreLink } from 'utils';

function BuyNowModal(options: { elfRate: number; onClose?: () => void; buyItem?: FormatListingType }) {
  const modal = useModal();
  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const title = 'Buy Now';
  const submitBtnText = 'Buy Now';
  const { walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { onClose, elfRate, buyItem } = options;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<FormatListingType[]>([]);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [buyListings, setBuyListings] = useState<IFixPriceList[]>([]);
  const batchBuyNow = useBatchBuyNow(nftInfo?.chainId);
  const { login, isLogin } = useCheckLoginAndToken();
  const { walletType } = useWebLogin();
  const isPortkeyConnected = walletType === WalletType.portkey;

  const [quantityErrorTip, setQuantityErrorTip] = useState('');

  const saleInfo = useGetSalesInfo(nftInfo?.id || '');

  const { tokenBalance, nftTotalSupply } = detailInfo.nftNumber;

  const mainChainNftBalance = useGetMainChainBalance({ tokenName: 'ELF' });
  const transferModal = useModal(CrossChainTransferModal);

  const convertTotalPrice = useMemo(() => {
    const totalPriceBig = new BigNumber(totalPrice);
    const convert = totalPriceBig.multipliedBy(elfRate).toNumber();
    return convert;
  }, [elfRate, totalPrice]);
  const [quantity, setQuantity] = useState<number>(0);

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

  const { getAccountInfoSync } = useWalletSyncCompleted();

  const onCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const buyNow = async () => {
    try {
      let buyListingData: IFixPriceList[] = [];

      if (buyItem) {
        const buyListing: IFixPriceList = {
          offerTo: buyItem.ownerAddress,
          quantity: quantity,
          price: {
            symbol: buyItem.purchaseToken.symbol,
            amount: buyItem.price,
          },
          startTime: {
            seconds: moment.unix(Math.floor(buyItem.startTime / 1000)).unix(),
            nanos: 0,
          },
        };
        buyListingData = [buyListing];
      } else {
        buyListingData = buyListings;
      }

      const batchBuyNowRes = await batchBuyNow({
        symbol: nftInfo!.nftSymbol,
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
          amount: new BigNumber(timesDecimals(averagePrice, 8)).toNumber(),
        },
        quantity,
      });

      if (batchBuyNowRes && batchBuyNowRes !== 'failed') {
        const explorerUrl = getExploreLink(batchBuyNowRes.TransactionId, 'transaction', nftInfo?.chainId);
        if (batchBuyNowRes.allSuccessFlag) {
          resultModal.show({
            previewImage: nftInfo?.previewImage || '',
            title: 'NFT Successfully Purchased!',
            description: `You are now the owner of ${nftInfo?.tokenName} NFT in the ${nftInfo?.nftCollection?.tokenName} Collection.`,
            buttonInfo: {
              btnText: 'View NFT',
              onConfirm: () => {
                resultModal.hide();
              },
            },
            info: {
              logoImage: nftInfo?.nftCollection?.logoImage || '',
              subTitle: nftInfo?.nftCollection?.tokenName,
              title: nftInfo?.tokenName,
              extra: isERC721(nftInfo!) ? undefined : handlePlurality(quantity, 'item'),
            },
            jumpInfo: {
              url: explorerUrl,
            },
          });
        } else {
          const length = batchBuyNowRes.failPriceList?.value.length || 1;
          const list = batchBuyNowRes.failPriceList?.value.map((item) => {
            const price = divDecimals(item.price.amount, 8);
            const convertPrice = new BigNumber(price).multipliedBy(elfRate);

            return {
              image: nftInfo?.previewImage || '',
              collectionName: nftInfo?.nftCollection?.tokenName,
              nftName: nftInfo?.tokenName,
              item: handlePlurality(Number(item.quantity), 'item'),
              priceTitle: 'Each item price',
              price: `${formatTokenPrice(price)} ${item.price.symbol || 'ELF'}`,
              usdPrice: formatUSDPrice(convertPrice),
            };
          });
          let errorCount = 0;
          batchBuyNowRes.failPriceList?.value.forEach((item) => {
            errorCount += Number(item.quantity);
          });
          resultModal.show({
            previewImage: nftInfo?.previewImage || '',
            title: 'Purchase Partially Completed',
            buttonInfo: {
              btnText: 'View NFT',
              onConfirm: () => {
                resultModal.hide();
              },
            },
            info: {
              logoImage: nftInfo?.nftCollection?.logoImage || '',
              subTitle: nftInfo?.nftCollection?.tokenName,
              title: nftInfo?.tokenName,
              extra: isERC721(nftInfo!) ? undefined : handlePlurality(Number(quantity) - errorCount, 'item'),
            },
            jumpInfo: {
              url: explorerUrl,
            },
            error: {
              title: `Purchase of ${handlePlurality(errorCount, 'item')}  failed`,
              description: `Purchase failure could be due to network issues, transaction fee increases, or someone else acquiring the item before you.`,
              list,
            },
          });
        }
      }

      promptModal.hide();
      setLoading(false);
      onCloseModal();
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }
  };

  const onConfirm = async () => {
    if (isLogin) {
      setLoading(true);
      const mainAddress = await getAccountInfoSync();
      if (!mainAddress) {
        setLoading(false);
        return;
      }

      promptModal.show({
        nftInfo: {
          image: nftInfo?.previewImage || '',
          collectionName: nftInfo?.nftCollection?.tokenName,
          nftName: nftInfo?.tokenName,
          priceTitle: isERC721(nftInfo!) ? 'Listing Price' : 'Total Price',
          price: `${formatTokenPrice(totalPrice)} ELF`,
          usdPrice: formatUSDPrice(convertTotalPrice),
          item: isERC721(nftInfo!) ? undefined : handlePlurality(quantity, 'item'),
        },
        title: BuyMessage.title,
        content: {
          title: walletInfo.portkeyInfo ? BuyMessage.portkey.title : BuyMessage.default.title,
          content: walletInfo.portkeyInfo ? BuyMessage.portkey.message : BuyMessage.default.message,
        },
        initialization: buyNow,
        onClose: () => {
          promptModal.hide();
        },
      });
    } else {
      login();
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
          quantity: list.quantity,
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
          quantity: quantity - curQuantity,
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
    if (modal.visible) {
      setQuantity(1);
    }
  }, [modal.visible]);

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
  }, [buyItem, listings, maxQuantity, quantity, saleInfo]);

  const getListingsData = async (page: number) => {
    if (quantity > (saleInfo?.availableQuantity || 0)) {
      return;
    }
    try {
      if (!nftInfo) return;
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
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    if (modal.visible) {
      getListingsData(page);
    }
  }, [page, modal.visible]);

  const isSideChainBalanceInsufficient = useMemo(() => {
    return BigNumber(divDecimals(Number(tokenBalance), 8)).lt(BigNumber(totalPrice));
  }, [tokenBalance, totalPrice]);

  const isAllChainsBalanceInsufficient = useMemo(() => {
    return BigNumber(divDecimals(Number(mainChainNftBalance), 8))
      .plus(BigNumber(divDecimals(Number(tokenBalance), 8)))
      .lt(BigNumber(totalPrice));
  }, [mainChainNftBalance, tokenBalance, totalPrice]);

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value || BigNumber(e.target.value).isZero()) {
      setQuantity(0);
      return;
    }
    const inputNumber = Number(formatInputNumber(e.target.value));
    if (BigNumber(inputNumber).gt(buyItem?.quantity || saleInfo?.availableQuantity || 0)) {
      setQuantityErrorTip(
        'Maximum quantity exceeded. Please ensure your purchase does not exceed the available quantity.',
      );
      setTotalPrice(0);
    } else {
      setQuantityErrorTip('');
    }
    setQuantity(inputNumber);
  };

  const handleTransferShow = () => {
    modal.hide();
    transferModal.show({
      type: CrossChainTransferType.token,
      onClose: () => {
        transferModal.hide();
        modal.show();
      },
    });
  };

  const insufficientTip = useMemo(() => {
    if (isSideChainBalanceInsufficient) {
      if (isAllChainsBalanceInsufficient) {
        return (
          <div className="text-[12px] leading-[20px] font-normal text-functionalDanger">Insufficient balance.</div>
        );
      } else {
        return (
          <div className="text-[12px] leading-[20px] font-normal text-[var(--text-primary)]">
            <span>Insufficient balance.</span>
            <>
              <span>You can</span>{' '}
              {isPortkeyConnected ? (
                <span className="cursor-pointer text-[var(--functional-link)]" onClick={handleTransferShow}>
                  {`manually transfer tokens from MainChain to your SideChain address.`}
                </span>
              ) : (
                'manually transfer tokens from MainChain to your SideChain address.'
              )}
            </>
          </div>
        );
      }
    }
    return null;
  }, [isAllChainsBalanceInsufficient, isPortkeyConnected, isSideChainBalanceInsufficient]);

  const showQuantity = useMemo(() => {
    if (buyItem) {
      return BigNumber(buyItem.quantity).gt(1);
    }
    return BigNumber(nftTotalSupply).gt(1);
  }, [buyItem, nftTotalSupply]);

  const priceInfoType = useMemo(() => {
    return (buyItem ? buyItem.quantity > 1 : Number(nftTotalSupply) > 1) ? PriceTypeEnum.BUY : PriceTypeEnum.BUY721;
  }, [buyItem, nftTotalSupply]);

  return (
    <Modal
      destroyOnClose
      afterClose={modal.remove}
      footer={
        <Button
          disabled={isSideChainBalanceInsufficient || !!quantityErrorTip || !quantity}
          loading={loading}
          type="primary"
          size="ultra"
          className="!w-[256px]"
          onClick={onConfirm}>
          {submitBtnText}
        </Button>
      }
      onCancel={onCloseModal}
      title={title}
      open={modal.visible}>
      <PriceInfo quantity={quantity} price={averagePrice} convertPrice={convertAveragePrice} type={priceInfoType} />
      {showQuantity && (
        <div className="mt-[24px] mdTW:mt-[32px]">
          <InputQuantity
            availableMount={buyItem ? buyItem?.quantity : saleInfo?.availableQuantity || 0}
            value={quantity === 0 ? '' : formatTokenPrice(quantity)}
            onChange={handleQuantityChange}
            errorTip={quantityErrorTip}
          />
        </div>
      )}
      <div className="mt-[52px] mdTW:mt-[60px]">
        <Summary />
      </div>
      <div className="mt-[24px] mdTW:mt-[32px]">
        <TotalPrice totalPrice={totalPrice} convertTotalPrice={convertTotalPrice} />
      </div>
      <div className="mt-[24px] mdTW:mt-[32px]">
        <Balance amount={divDecimals(Number(tokenBalance), 8).toNumber()} suffix="ELF" />
      </div>
      <div className="mt-[8px]">{insufficientTip}</div>
    </Modal>
  );
}

export default memo(NiceModal.create(BuyNowModal));
