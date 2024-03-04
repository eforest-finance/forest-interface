import { message } from 'antd';
import styles from './style.module.css';
import moment from 'moment';
import { ChangeEvent, ReactNode, memo, useEffect, useMemo, useState } from 'react';

import useMakeOffer from 'pagesComponents/Detail/hooks/useMakeOffer';
import BigNumber from 'bignumber.js';
import { divDecimals, timesDecimals } from 'utils/calculate';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import Button from 'baseComponents/Button';
import Modal from 'baseComponents/Modal';
import { useCheckLoginAndToken, useWalletSyncCompleted } from 'hooks/useWalletSync';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import PriceInfo, { PriceTypeEnum } from '../BuyNowModal/components/PriceInfo';
import InputQuantity from '../BuyNowModal/components/InputQuantity';
import Balance from '../BuyNowModal/components/Balance';
import { SetPrice } from '../SaleModal/comps/SetPrice';
import { Duration } from '../SaleModal/comps/Duration';
import { IPrice } from '../SaleModal/hooks/useSetPrice';
import { IDurationData } from '../SaleModal/hooks/useDuration';
import { useGetMainChainBalance } from 'pagesComponents/Detail/hooks/useGetMainChainToken';
import PromptModal from 'components/PromptModal';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import ResultModal from 'components/ResultModal';
import { OfferMessage } from 'constants/promptMessage';
import { useGetSalesInfo } from 'pagesComponents/Detail/hooks/useGetSalesInfo';
import CrossChainTransferModal, { CrossChainTransferType } from 'components/CrossChainTransferModal';
import { WalletType, useWebLogin } from 'aelf-web-login';
import { isERC721 } from 'utils/isTokenIdReuse';
import { handlePlurality } from 'utils/handlePlurality';
import { elementScrollToView } from 'utils/domUtils';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import { getExploreLink } from 'utils';
import { Moment } from 'moment';
import { store } from 'store/store';
import { setCurrentTab } from 'store/reducer/detail/detailInfo';
import { getNFTNumber } from 'pagesComponents/Detail/utils/getNftNumber';
import { CrossChainTransferMsg } from 'contract/formatErrorMsg';

function OfferModal(options: { onClose?: () => void; rate: number }) {
  const modal = useModal();
  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const { login, isLogin } = useCheckLoginAndToken();

  const { infoState, walletInfo, aelfInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const [token, setToken] = useState<string>('ELF');
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const { onClose, rate } = options;
  const { detailInfo } = useDetailGetState();
  const {
    nftInfo,
    nftNumber: { nftTotalSupply, nftBalance, tokenBalance },
  } = detailInfo;
  const makeOffer = useMakeOffer(nftInfo?.chainId);
  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);
  const mainChainTokenBalance = useGetMainChainBalance({ tokenName: 'ELF' });
  const [priceErrorTip, setPriceErrorTip] = useState<string | ReactNode>('');
  const [priceValid, setPriceValid] = useState<boolean>(false);
  const [durationTime, setDurationTime] = useState<string | number>('');

  const [durationHours, setDurationHours] = useState<string>('');
  const [durationMonths, setDurationMonths] = useState<string>('');

  const [quantityTip, setQuantityTip] = useState('');

  const salesInfo = useGetSalesInfo(nftInfo?.id || '');

  const transferModal = useModal(CrossChainTransferModal);

  const { walletType } = useWebLogin();
  const isPortkeyConnected = walletType === WalletType.portkey;

  const totalPrice = useMemo(() => {
    if (nftTotalSupply === '1') {
      return price ? BigNumber(price).toNumber() : '--';
    } else {
      if (quantity && price) {
        return BigNumber(price).multipliedBy(quantity).toNumber();
      } else {
        return '--';
      }
    }
  }, [nftTotalSupply, price, quantity]);

  const convertPrice = useMemo(() => {
    if (price && quantity && rate) {
      const averagePriceBig = BigNumber(totalPrice);
      const convertAverage = averagePriceBig.multipliedBy(rate).toNumber();
      return convertAverage;
    } else {
      return '--';
    }
  }, [price, quantity, rate, totalPrice]);

  const maxAvailable = useMemo(() => {
    return new BigNumber(nftTotalSupply).minus(nftBalance || 0).toNumber();
  }, [nftTotalSupply, nftBalance]);

  const maxElfAvailable = useMemo(() => {
    if (price) {
      return new BigNumber(divDecimals(tokenBalance, 8)).div(new BigNumber(price)).toNumber();
    }
    return 0;
  }, [price, tokenBalance]);

  const availableMount = useMemo(() => {
    if (!price) {
      return maxAvailable;
    }

    const availableBuyAmount = new BigNumber(Math.min(maxAvailable, maxElfAvailable))
      .minus(quantity || 0)
      .toFixed(0, BigNumber.ROUND_DOWN);

    return Math.max(Number(availableBuyAmount), 0);
  }, [price, maxAvailable, maxElfAvailable, quantity]);

  const onQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value || BigNumber(e.target.value).isZero()) {
      setQuantity(0);
      setQuantityTip('');
      return;
    }
    const inputNumber = Number(formatInputNumber(e.target.value));
    setQuantity(inputNumber);
    if (BigNumber(inputNumber).gt(BigNumber(maxAvailable))) {
      setQuantityTip('Maximum quantity exceeded. Please ensure your offer does not exceed the available quantity.');
      return;
    }
    setQuantityTip('');
  };

  const onCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const makeOfferNft = async () => {
    try {
      setLoading(true);

      const mainAddress = await getAccountInfoSync();

      if (!mainAddress) {
        setLoading(false);
        return Promise.reject();
      }

      if (nftInfo && quantity && price) {
        const res = await makeOffer({
          symbol: nftInfo?.nftSymbol,
          quantity: Number(quantity),
          price: {
            symbol: token,
            amount: Number(timesDecimals(price, 8)),
          },
          expireTime: Number(durationTime),
        });
        setLoading(false);
        onCloseModal();
        promptModal.hide();
        const TransactionId = res?.TransactionId;
        const explorerUrl = TransactionId ? getExploreLink(TransactionId, 'transaction', nftInfo?.chainId) : '';
        resultModal.show({
          previewImage: nftInfo?.previewImage || '',
          title: 'Offer Successfully Made!',
          description: `You have made an offer for the ${nftInfo.tokenName} NFT in the ${nftInfo.nftCollection?.tokenName} Collection.`,
          buttonInfo: {
            btnText: 'View My Offer',
            onConfirm: () => {
              resultModal.hide();
              store.dispatch(setCurrentTab('listingOffers'));
              elementScrollToView(document.getElementById('page-detail-offers'), isSmallScreen ? 'start' : 'center');
            },
          },
          info: {
            logoImage: nftInfo.nftCollection?.logoImage || '',
            subTitle: nftInfo.nftCollection?.tokenName,
            title: nftInfo.tokenName,
            extra: isERC721(nftInfo) ? undefined : handlePlurality(Number(quantity), 'item'),
          },
          jumpInfo: {
            url: explorerUrl,
          },
        });
      }
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }
  };

  const onMakeOffer = async () => {
    if (isLogin) {
      try {
        if (!durationTime || !checkDate(durationTime)) {
          setLoading(false);
          return;
        }
        modal.hide();
        promptModal.show({
          nftInfo: {
            image: nftInfo?.previewImage || '',
            collectionName: nftInfo?.nftCollection?.tokenName,
            nftName: nftInfo?.tokenName,
            priceTitle: isERC721(nftInfo!) ? 'Offer Amount' : 'Total Amount',
            price: `${formatTokenPrice(totalPrice)} ${token || 'ELF'}`,
            usdPrice: formatUSDPrice(convertPrice),
            item: isERC721(nftInfo!) ? undefined : handlePlurality(Number(quantity), 'item'),
          },
          title: OfferMessage.title,
          content: {
            title: walletInfo.portkeyInfo ? OfferMessage.portkey.title : OfferMessage.default.title,
            content: walletInfo.portkeyInfo ? OfferMessage.portkey.message : OfferMessage.default.message,
          },
          initialization: makeOfferNft,
          onClose: () => {
            promptModal.hide();
          },
        });
      } catch (error) {
        /* empty */
      }
    } else {
      login();
    }
  };

  const makeOfferDisabled = () => {
    return !(
      BigNumber(quantity).gt(0) &&
      BigNumber(price).gt(0) &&
      BigNumber(totalPrice).lte(BigNumber(divDecimals(Number(tokenBalance), 8))) &&
      !priceErrorTip &&
      !quantityTip
    );
  };

  useEffect(() => {
    setPrice('');
    setQuantity('1');
    setQuantityTip('');
    if (modal.visible) {
      getNFTNumber({
        owner: walletInfo.address,
        nftSymbol: nftInfo?.nftSymbol,
        chainId: infoState.sideChain,
      });
    }
  }, [modal.visible]);

  const setOfferPrice = (price: IPrice) => {
    setPrice(price.price || '');
  };

  useEffect(() => {
    checkValid(price, quantity);
  }, [price, quantity]);

  const handleDurationTime = (data: IDurationData) => {
    if (data.type === 'date') {
      setDurationTime(moment(data.value).valueOf());
    } else if (data.type === 'months') {
      if (data.value === durationMonths) {
        return;
      }
      setDurationMonths(data.value as string);
      const futureTime = moment().add(Number(data.value), 'months');
      setDurationTime(futureTime.valueOf());
    } else {
      if (data.value === durationHours) {
        return;
      }
      setDurationHours(data.value as string);
      const futureTime = moment().add(Number(data.value), 'hours');
      setDurationTime(futureTime.valueOf());
    }
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

  const checkValid = (price: number | string, quantity: number | string) => {
    const bigValue = BigNumber(price).multipliedBy(BigNumber(quantity));
    if (bigValue.gt(BigNumber(divDecimals(Number(tokenBalance), 8)))) {
      if (bigValue.gt(BigNumber(divDecimals(Number(tokenBalance) + Number(mainChainTokenBalance), 8)))) {
        setPriceErrorTip(<span>Insufficient balance.</span>);
        setPriceValid(false);
      } else {
        setPriceErrorTip(
          <span className="text-textPrimary">
            <>
              Insufficient balance.
              <span>You can</span>{' '}
              {isPortkeyConnected ? (
                <span className="cursor-pointer text-functionalLink" onClick={handleTransferShow}>
                  {CrossChainTransferMsg}
                </span>
              ) : (
                CrossChainTransferMsg
              )}
            </>
          </span>,
        );
        setPriceValid(false);
      }
    } else {
      setPriceErrorTip('');
      setPriceValid(true);
    }
  };

  const checkDate = (duration: number | string) => {
    const timeDifference = moment(duration).diff(moment());
    const minutesDifference = moment.duration(timeDifference).asMinutes();
    const months = moment.duration(timeDifference).asMonths();
    if (minutesDifference < 15) {
      message.error('The duration should be at least 15 minutes.');
      return false;
    }
    if (months > 6) {
      message.error('The duration should be no more than 6 months.');
      return false;
    }
    return true;
  };

  const checkDateValidate = (date: Moment) => {
    const timeDifference = date.diff(moment());
    const minutesDifference = moment.duration(timeDifference).asMinutes();

    const months = moment.duration(timeDifference).asMonths();
    if (minutesDifference < 15) {
      return 'The duration should be at least 15 minutes.';
    } else if (months > 6) {
      return 'The duration should be no more than 6 months.';
    } else {
      return '';
    }
  };

  return (
    <Modal
      afterClose={modal.remove}
      destroyOnClose
      className={`${styles['offer-modal']} ${isSmallScreen && styles['mobile-offer-modal']}`}
      footer={
        <>
          <Button
            type="primary"
            className="w-[256px]"
            size="ultra"
            loading={loading}
            disabled={makeOfferDisabled()}
            onClick={onMakeOffer}>
            Make Offer
          </Button>
        </>
      }
      onCancel={onCloseModal}
      title="Make an offer"
      open={modal.visible}>
      <div className="content">
        <PriceInfo
          quantity={nftTotalSupply === '1' ? 1 : quantity || 0}
          price={totalPrice}
          convertPrice={convertPrice}
          type={nftTotalSupply === '1' ? PriceTypeEnum.MAKEOFFER721 : PriceTypeEnum.MAKEOFFER}
        />
        <SetPrice
          title="Offer Amount Per Item"
          className="mt-[32px]"
          floorPrice={salesInfo?.floorPrice}
          bestOfferPrice={salesInfo?.maxOfferPrice}
          onChange={setOfferPrice}
          errorTip={priceErrorTip}
          placeholder="Please enter your offer amount"
          defaultErrorTip="Please enter a valid value."
          valid={!priceValid ? 'error' : ''}
        />
        {nftTotalSupply !== '1' && (
          <div className="mt-[60px]">
            <InputQuantity
              availableMount={availableMount}
              onChange={onQuantityChange}
              value={quantity === 0 ? '' : formatTokenPrice(quantity)}
              errorTip={quantityTip}
            />
          </div>
        )}
        <div className="mt-[60px]">
          <Duration onChange={handleDurationTime} checkDateValidate={checkDateValidate} />
        </div>
        <div className="mt-[32px]">
          <Balance amount={divDecimals(Number(tokenBalance), 8).toNumber()} suffix="ELF" />
        </div>
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(OfferModal));
