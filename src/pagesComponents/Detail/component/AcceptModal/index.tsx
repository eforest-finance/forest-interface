import useDeal from 'pagesComponents/Detail/hooks/useDeal';
import { ChangeEvent, memo, useEffect, useMemo, useState } from 'react';

import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import BigNumber from 'bignumber.js';
import { GetBalance } from 'contract/multiToken';
import { divDecimals } from 'utils/calculate';
import { ZERO } from 'constants/misc';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import PriceInfo, { PriceTypeEnum } from '../BuyNowModal/components/PriceInfo';
import ApproveModal from 'components/ApproveModal';
import ResultModal from 'components/ResultModal/ResultModal';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { DealMessage } from 'constants/promptMessage';
import { isERC721 } from 'utils/isTokenIdReuse';
import { handlePlurality } from 'utils/handlePlurality';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import { getExploreLink } from 'utils';
import styles from './styles.module.css';
import { INftInfo } from 'types/nftTypes';
import useGetTransitionFee from 'components/Summary/useGetTransitionFee';
import ItemInfoCard, { INftInfoListCard } from 'components/ItemInfoCard';
import Close from 'assets/images/v2/close.svg';
import { Text, TotalPrice, BalanceText } from '../BuyNowModal/components/Text';
import { Divider } from 'antd';

import InputQuantity from '../BuyNowModal/components/InputNumber';

import ItemInfo from './ItemInfo';
import { SuccessFooter } from '../BuyNowModal/components/Result';
import { UserDeniedMessage } from 'contract/formatErrorMsg';
import { ArtType } from '../ExchangeModal';

interface IProps {
  nftInfo: INftInfo;
  initialization?: <T, R>(params?: T) => Promise<void | R>;
  onClose?: <T>(params?: T) => void;
  elfRate: number;
  amount?: number;
}

function AcceptModal(options: {
  onClose?: () => void;
  art: ArtType;
  rate: number;
  nftBalance: number;
  nftInfo?: INftInfo;
  amount?: number;
}) {
  const modal = useModal();
  const approveModal = useModal(ApproveModal);
  const resultModal = useModal(ResultModal);
  const pathname = usePathname();

  const { walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo: stateInfo, nftNumber } = detailInfo;
  const { onClose, art, nftBalance, nftInfo, amount } = options;

  const info = nftInfo || stateInfo;
  console.log('nftInfo:', info, isERC721(info), art);

  const [loading, setLoading] = useState<boolean>(false);
  const [offerFromBalance, setOfferFromBalance] = useState<BigNumber>(ZERO);
  const [quantityTip, setQuantityTip] = useState('');

  const maxQuantity = useMemo(() => {
    const offerFromMaxQuantity = offerFromBalance.div(new BigNumber(art.price)).integerValue();
    const res = BigNumber.minimum(offerFromMaxQuantity, art.quantity, nftBalance);
    return Number(res);
  }, [art?.quantity, nftBalance, offerFromBalance]);

  const deal = useDeal(info?.chainId);

  const [quantity, setQuantity] = useState<number>(amount || 1);
  const { getAccountInfoSync } = useWalletSyncCompleted(info?.chainId);
  const { transactionFee } = useGetTransitionFee(art?.collectionSymbol);

  const onVisibleChange = () => {
    setQuantity(amount || 1);
  };

  const totalPrice = useMemo(() => {
    const priceBig = new BigNumber(art?.price || 0);
    const quantityBig = new BigNumber(quantity || 0);
    return priceBig.multipliedBy(quantityBig);
  }, [art?.price, quantity]);

  const totalUSDPrice = useMemo(() => {
    const totalPriceBig = new BigNumber(totalPrice);
    return totalPriceBig.multipliedBy(options.rate);
  }, [options.rate, totalPrice]);

  const availableCount = useMemo(() => {
    return Math.min(art.quantity, nftBalance);
  }, [art?.quantity]);

  const getOfferFromBalance = async () => {
    const offerFromBalance = await GetBalance({
      symbol: 'ELF',
      owner: art.address,
    });

    setOfferFromBalance(divDecimals(offerFromBalance.balance, 8));
  };

  const onCancel = () => {
    modal.hide();

    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  useEffect(() => {
    getOfferFromBalance();
  }, [art]);

  useEffect(onVisibleChange, [modal.visible]);

  const onDeal = async () => {
    try {
      setLoading(true);
      const mainAddress = await getAccountInfoSync();
      if (!mainAddress) {
        setLoading(false);
        return Promise.reject();
      }
      const res = await deal({
        symbol: art.symbol as string,
        offerFrom: art.address,
        price: { symbol: art.token.symbol as string, amount: new BigNumber(art.price).times(10 ** 8).toNumber() },
        quantity: BigNumber(quantity)
          .times(10 ** Number(art.nftDecimals || 0))
          .toNumber(),
      });
      console.log(res);
      setLoading(false);
      onCancel();
      approveModal.hide();
    } catch (error) {
      if (error?.errorMessage?.message?.includes(UserDeniedMessage)) {
        approveModal.hide();
        modal.show({
          ...options,
          amount: quantity,
        });
        return;
      }

      resultModal.show({
        nftInfo: {
          image: info?.previewImage || '',
          collectionName: info?.nftCollection?.tokenName || '',
          nftName: info?.tokenName || '',
        },
        title: 'Offer Successfully Fail!',
        amount: quantity,
        type: 'error',
        content: (
          <>
            <div className="mt-[32px] flex flex-col">
              <span className="text-center text-[16px]  text-textSecondary ">
                You have accepted the offer for the SGRTEST NFT in the TestSchrödinger Collection.
              </span>
            </div>
          </>
        ),
        onClose: () => {
          resultModal.hide();
        },
      });
      setLoading(false);
      return Promise.reject(error);
    }
  };

  const onConfirm = async () => {
    modal.hide();
    approveModal.show({
      nftInfo: {
        image: info?.previewImage || '',
        collectionName: info?.nftCollection?.tokenName,
        nftName: info?.tokenName,
        priceTitle: 'Total Earn',
        number: quantity,
        price: `${formatTokenPrice(resultPrice)} ${art.token.symbol || 'ELF'}`,
        usdPrice: formatUSDPrice(priceUsd),
      },
      title: 'Accept offer',
      amount: quantity,
      showBalance: false,
      initialization: onDeal,
      onClose: () => {
        approveModal.hide();
      },
    });
  };

  const onQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value || BigNumber(e.target.value).isZero()) {
      setQuantity(0);
      setQuantityTip('');
      return;
    }
    const inputNumber = Number(formatInputNumber(e.target.value));
    setQuantity(inputNumber);
    if (BigNumber(inputNumber).gt(BigNumber(art.quantity))) {
      setQuantityTip('The current maximum quotable quantity has been exceeded.');
      return;
    }
    if (BigNumber(inputNumber).gt(BigNumber(maxQuantity))) {
      setQuantityTip('Insufficient NFT balance.');
      return;
    }
    setQuantityTip('');
  };

  const dealDisabled = useMemo(() => {
    return !quantity || quantityTip;
  }, [quantityTip, quantity]);

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  const totalPriceBig = new BigNumber(totalPrice);
  const resultPrice = totalPriceBig.isNaN()
    ? '--'
    : totalPriceBig.times(1 - (transactionFee?.forestServiceRate + transactionFee?.creatorLoyaltyRate)).toNumber();
  const priceUsd = totalPriceBig.multipliedBy(options.rate);

  const isMultiple = info && !isERC721(info) && art.quantity !== 1;

  console.log('isMultiple:', isMultiple);

  return (
    <Modal
      title={<div>Accept Offer</div>}
      open={modal.visible}
      className={styles.modal}
      width={550}
      size="m"
      closeIcon={<Close />}
      onOk={() => onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={
        <div className="flex justify-center w-full mt-0">
          <Button
            disabled={!!dealDisabled}
            size="ultra"
            className="w-full mdTW:w-[256px]"
            type="primary"
            onClick={() => {
              onConfirm();
            }}>
            Accept Offer
          </Button>
        </div>
      }>
      <div className="w-full h-full flex flex-col relative">
        <ItemInfo
          image={info?.previewImage || ''}
          collectionName={info?.nftCollection?.tokenName}
          nftName={info?.tokenName}
          title={!isMultiple ? undefined : ['Your own', nftBalance || 0]}
          number={nftBalance}
        />
        <Text
          className="mdTW:!text-[16px] mt-[24px] mdl:mt-[32px] !text-textPrimary font-medium"
          title={!isMultiple ? 'Offer Price' : 'Offer Price Per Item'}
          value={`${formatTokenPrice(art.price || '')} ELF`}
        />
        {isMultiple && (
          <div className="flex flex-col mdl:flex-row justify-between mt-[24px] mdl:mt-[32px]">
            <span className="text-[16px] font-medium">Quantity</span>
            <div className="flex flex-col items-end w-full mdl:w-fit mt-[16px] mdl:mt-0">
              <InputQuantity
                width={'100%'}
                max={availableCount}
                quantity={quantity}
                onChange={(quantity: number) => {
                  setQuantity(quantity);
                }}
              />
              <span className="mt-[8px] text-textSecondary text-[14px]">{availableCount} available</span>
            </div>
          </div>
        )}

        <Divider className="my-[24px] mdl:my-[20px]" />
        <Text title="Forest fee" value={`${(transactionFee?.forestServiceRate || 0) * 100}%`} />
        <Text
          className="mt-[16px]"
          title="Creator earnings"
          value={`${(transactionFee?.creatorLoyaltyRate || 0) * 100}%`}
        />

        <TotalPrice className="mt-[16px]" title="Total Earn" elf={`${resultPrice} ELF`} usd={`$ ${priceUsd}`} />
      </div>
    </Modal>
  );
}

export default NiceModal.create(AcceptModal);
