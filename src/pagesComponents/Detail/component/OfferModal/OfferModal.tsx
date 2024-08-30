import { Divider, Input, InputNumber, message } from 'antd';
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
import ResultModal from 'components/ResultModal/ResultModal';
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
import ItemInfoCard from 'components/ItemInfoCard';

import Close from 'assets/images/v2/close.svg';
import { BalanceText, TotalPrice, Text } from '../BuyNowModal/components/Text';
import InputNumberWithAddon from '../BuyNowModal/components/InputNumber';
import ApproveModal from 'components/ApproveModal';
import { SuccessFooter, Success } from '../BuyNowModal/components/Result';
import aelfInfo from 'store/reducer/aelfInfo';

function OfferModal(options: { onClose?: () => void; rate: number; defaultValue?: any }) {
  const modal = useModal();
  const resultModal = useModal(ResultModal);
  const { login, isLogin } = useCheckLoginAndToken();
  const { onClose, rate, defaultValue } = options;

  const { infoState, walletInfo, aelfInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const [token] = useState<string>('ELF');
  const [quantity, setQuantity] = useState<number>(defaultValue?.quantity || 1);
  const [price, setPrice] = useState<number>(defaultValue?.price || 0);
  const [loading, setLoading] = useState(false);
  const { detailInfo } = useDetailGetState();
  const {
    nftInfo,
    nftNumber: { nftTotalSupply, nftQuantity, nftBalance, tokenBalance },
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
  const approveModal = useModal(ApproveModal);

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
    return new BigNumber(nftQuantity).minus(nftBalance || 0).toNumber();
  }, [nftQuantity, nftBalance]);

  const maxElfAvailable = useMemo(() => {
    if (price) {
      return new BigNumber(divDecimals(tokenBalance, 8)).div(new BigNumber(price)).toNumber();
    }
    return 0;
  }, [price, tokenBalance]);

  const availableMount = useMemo(() => {
    const amount = new BigNumber(nftQuantity).minus(nftBalance || 0).valueOf();
    return amount;
  }, [nftQuantity, nftBalance]);

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

  const makeOfferNft = async () => {
    try {
      setLoading(true);

      const mainAddress = await getAccountInfoSync();

      if (!mainAddress) {
        setLoading(false);
        approveModal.hide();
        modal.show({
          ...options,
          defaultValue: {
            quantity,
            price,
          },
        });
        return Promise.reject();
      }

      if (nftInfo && quantity && price) {
        try {
          const res = await makeOffer({
            symbol: nftInfo?.nftSymbol,
            quantity: timesDecimals(quantity, nftInfo.decimals || '0').toNumber(),
            quantityForApprove: Number(quantity),
            price: {
              symbol: token,
              amount: Number(timesDecimals(price, 8)),
            },
            priceForApprove: {
              symbol: 'ELF',
              amount: Number(timesDecimals(price, '0')),
            },
            expireTime: Number(durationTime),
          });

          setLoading(false);
          approveModal.hide();
          const TransactionId = res?.TransactionId;
          const explorerUrl = TransactionId ? getExploreLink(TransactionId, 'transaction', nftInfo?.chainId) : '';

          resultModal.show({
            nftInfo: {
              image: nftInfo?.previewImage || '',
              collectionName: nftInfo?.nftCollection?.tokenName || '',
              nftName: nftInfo?.tokenName,
            },
            title: 'Offer Successfully Made',
            amount: quantity,
            type: 'success',
            content: (
              <>
                <div className="w-full mt-[24px] mdTW:mt-[32px] ">
                  <Text title="Offer Price" value={`${formatTokenPrice(price)} ELF`} />
                  <Divider className="my-[16px]" />
                  <TotalPrice
                    title="Total Offers"
                    elf={`${formatTokenPrice(totalPrice)} ELF`}
                    usd={`$${formatTokenPrice(convertPrice)}`}
                  />
                </div>
              </>
            ),
            footer: (
              <SuccessFooter
                href={explorerUrl}
                profile={`/account/${walletInfo.address}#Collected`}
                text="View My Offer"
                modal={resultModal}
              />
            ),
            onClose: () => {
              resultModal.hide();
            },
          });
        } catch (error) {
          console.log(error);

          approveModal.hide();
          modal.show({
            ...options,
            defaultValue: {
              quantity,
              price,
            },
          });

          // if (error?.errorMessage?.message?.includes(UserDeniedMessage) || error === 'not approved') {
          //   approveModal.hide();
          //   modal.show({
          //     ...options,
          //     defaultValue: {
          //       quantity,
          //       price,
          //     },
          //   });
          // } else {
          //   setLoading(false);
          //   approveModal.hide();
          // }
        }
      }
    } catch (error) {
      approveModal.hide();
      modal.show({
        ...options,
        defaultValue: {
          quantity,
          price,
        },
      });
      setLoading(false);
      return Promise.reject(error);
    }
  };

  const onMakeOffer = async () => {
    if (isLogin && nftInfo) {
      try {
        if (!durationTime || !checkDate(durationTime)) {
          setLoading(false);
          return;
        }
        modal.hide();

        approveModal.show({
          nftInfo: {
            ...nftInfo,
            image: nftInfo?.previewImage || '',
            collectionName: nftInfo?.nftCollection?.tokenName,
            nftName: nftInfo?.tokenName,
            priceTitle: 'Total Offer',
            price: `${formatTokenPrice(totalPrice)} ELF`,
            usdPrice: formatUSDPrice(convertPrice),
            number: quantity,
          },
          title: 'Make Offer',
          showBalance: true,
          initialization: makeOfferNft,
          onClose: () => {
            approveModal.hide();
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
    // setPrice(0);
    // setQuantity(1);
    setQuantityTip('');
    if (modal.visible) {
      getNFTNumber({
        owner: walletInfo.address,
        nftSymbol: nftInfo?.nftSymbol,
        chainId: infoState.sideChain,
      });
    }
  }, [modal.visible]);

  const setOfferPrice = (price: number | null) => {
    if (price) {
      setPrice(price);
    }
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
    const months = Math.floor(moment.duration(timeDifference).asMonths());
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

    const months = Math.floor(moment.duration(timeDifference).asMonths());
    if (minutesDifference < 15) {
      return 'The duration should be at least 15 minutes.';
    } else if (months > 6) {
      return 'The duration should be no more than 6 months.';
    } else {
      return '';
    }
  };

  const onCancel = () => {
    modal.hide();
  };

  const balanceValue = divDecimals(Number(tokenBalance), 8).toNumber();
  const isNotEnoughBalance = Number(totalPrice) > balanceValue;
  const etransferUrl = aelfInfo.etransferUrl;

  if (!nftInfo) {
    return null;
  }

  return (
    <Modal
      title={<div>Make an Offer</div>}
      open={modal.visible}
      className={styles.modal}
      width={630}
      closeIcon={<Close />}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <div className="flex justify-center w-full mdTW:w-fit">
          <Button
            size="ultra"
            className="mdTW:mt-[32px] w-full mdTW:w-[256px]"
            type="primary"
            disabled={!isNotEnoughBalance && makeOfferDisabled()}
            onClick={() => {
              if (isNotEnoughBalance) {
                window.open(etransferUrl);
              } else {
                onMakeOffer();
              }
            }}>
            {!isNotEnoughBalance ? 'Make Offer' : 'Get ELF'}
          </Button>
        </div>
      }>
      <div className="w-full h-full flex flex-col relative">
        <ItemInfoCard
          {...nftInfo}
          image={nftInfo?.previewImage || ''}
          collectionName={nftInfo?.nftCollection?.tokenName}
          nftName={nftInfo?.tokenName}
          priceTitle=""
          price=""
          usdPrice=""
        />

        <div>
          <div className="text-[16px] mdTW:text-[18px] font-medium text-textPrimary mt-[24px] mdTW:mt-[32px]">
            Offer Price
          </div>
          <div className="flex justify-between mt-[16px]">
            <Button
              className="mdTW:mr-[24px] !border-0 rounded-lg flex items-center flex-col !bg-fillCardBg hover:!bg-fillHoverBg w-[164px] mdTW:w-[279px] !h-[70px] py-[8px]"
              onClick={() => {
                setPrice(nftInfo.listingPrice);
              }}>
              <span className="text-[12px] mdTW:text-[16px] text-textSecondary">Collection Floor Price</span>
              <span className="font-semibold text-[16px] mdTW:text-[18px] text-textPrimary">
                {formatTokenPrice(nftInfo.listingPrice)} ELF
              </span>
            </Button>
            <Button
              disabled={nftInfo.maxOfferPrice < 0}
              className="!border-0 rounded-lg flex items-center flex-col !bg-fillCardBg hover:!bg-fillHoverBg w-[164px] mdTW:w-[279px] !h-[70px] py-[8px]"
              onClick={() => {
                setPrice(nftInfo.maxOfferPrice);
              }}>
              <span className="text-[12px] mdTW:text-[16px] text-textSecondary">Best Offer</span>
              <span className="font-semibold  text-[16px] text-textPrimary">
                {nftInfo.maxOfferPrice < 0 ? '--' : `${formatTokenPrice(nftInfo.maxOfferPrice)} ELF`}
              </span>
            </Button>
          </div>
        </div>
        <div className="mt-[12px] border border-solid border-lineBorder flex items-center rounded-lg">
          <InputNumber
            bordered={false}
            controls={false}
            value={price}
            min={0}
            className={styles.price}
            onChange={setOfferPrice}
          />
          <Divider type="vertical" />
          <span className="px-[12px] text-textSecondary text-[18px] mdTW:text-[20px] font-medium">ELF</span>
        </div>

        {!isERC721(nftInfo) && (
          <>
            <div className="mt-[24px] mdTW:mt-[32px] text-[18px] font-medium text-textPrimary mb-[16px]">
              Offer Amount
            </div>
            <InputNumberWithAddon
              max={Number(availableMount)}
              quantity={quantity}
              width={'100%'}
              onChange={(value: number) => {
                setQuantity(value);
              }}
            />
            <span className="text-right mt-[8px] text-textSecondary">{availableMount} available</span>
          </>
        )}

        <Duration onChange={handleDurationTime} checkDateValidate={checkDateValidate} />

        <Divider className="mdTW:my-[32px] my-[24px]" />
        <TotalPrice title="Total Offers" elf={`${formatTokenPrice(totalPrice)} ELF`} usd={`$${convertPrice}`} />
        <BalanceText
          title="Your balance"
          className="pb-[40px] mdTW:pb-0"
          value={formatTokenPrice(divDecimals(Number(tokenBalance), 8).toNumber())}
          totalPrice={totalPrice}
        />
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(OfferModal));
