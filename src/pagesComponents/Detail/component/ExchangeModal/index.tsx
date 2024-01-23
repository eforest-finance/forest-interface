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
import TotalPrice from '../BuyNowModal/components/TotalPrice';
import DealSummary from './components/DealSummary';
import InputQuantity from '../BuyNowModal/components/InputQuantity';
import Balance from '../BuyNowModal/components/Balance';
import PromptModal from 'components/PromptModal';
import ResultModal from 'components/ResultModal';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { DealMessage } from 'constants/promptMessage';
import { isERC721 } from 'utils/isTokenIdReuse';
import { handlePlurality } from 'utils/handlePlurality';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import { getExploreLink } from 'utils';
import styles from './index.module.css';

export type ArtType = {
  id: number;
  name: string;
  token: { symbol: string };
  decimals: number;
  quantity: number;
  price: number;
  convertPrice: number;
  address: string;
  symbol?: string;
  collection?: string;
};

function ExchangeModalNew(options: { onClose?: () => void; art: ArtType; rate: number; nftBalance: number }) {
  const modal = useModal();
  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const pathname = usePathname();

  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo, nftNumber } = detailInfo;
  const { onClose, art, nftBalance } = options;
  const [loading, setLoading] = useState<boolean>(false);
  const [offerFromBalance, setOfferFromBalance] = useState<BigNumber>(ZERO);
  const [quantityTip, setQuantityTip] = useState('');

  const maxQuantity = useMemo(() => {
    const offerFromMaxQuantity = offerFromBalance.div(new BigNumber(art.price)).integerValue();
    const res = BigNumber.minimum(offerFromMaxQuantity, art.quantity, nftBalance);
    return Number(res);
  }, [art?.quantity, nftBalance, offerFromBalance]);

  const deal = useDeal(nftInfo?.chainId);

  const [quantity, setQuantity] = useState<number>(1);

  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);
  const price = new BigNumber(art?.price || 0);
  const convertPrice = new BigNumber(art?.convertPrice || 0);

  const onVisibleChange = () => {
    setQuantity(1);
  };

  const totalPrice = useMemo(() => {
    const priceBig = new BigNumber(price);
    const quantityBig = new BigNumber(quantity || 0);
    return priceBig.multipliedBy(quantityBig);
  }, [price, quantity]);

  const totalUSDPrice = useMemo(() => {
    const totalPriceBig = new BigNumber(totalPrice);
    return totalPriceBig.multipliedBy(options.rate);
  }, [options.rate, totalPrice]);

  const getOfferFromBalance = async () => {
    const offerFromBalance = await GetBalance({
      symbol: 'ELF',
      owner: art.address,
    });

    setOfferFromBalance(divDecimals(offerFromBalance.balance, 8));
  };

  const onCancel = () => {
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
        quantity: quantity,
      });
      if (res === 'failed') {
        onCancel();
        promptModal.hide();
        return;
      }
      const { TransactionId } = res;
      setLoading(false);
      onCancel();
      promptModal.hide();
      const explorerUrl = TransactionId ? getExploreLink(TransactionId, 'transaction', nftInfo?.chainId) : '';
      resultModal.show({
        previewImage: nftInfo?.previewImage || '',
        title: 'Offer Successfully Accepted!',
        description: `You have made an offer for the ${nftInfo?.tokenName} NFT in the ${nftInfo?.nftCollection?.tokenName} Collection.`,
        hideButton: true,
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
    } catch (error) {
      setLoading(false);
      return Promise.reject(error);
    }
  };

  const onConfirm = async () => {
    promptModal.show({
      nftInfo: {
        image: nftInfo?.previewImage || '',
        collectionName: nftInfo?.nftCollection?.tokenName,
        nftName: nftInfo?.tokenName,
        priceTitle: isERC721(nftInfo!) ? 'Offer Amount' : 'Total Offer Amount',
        price: `${formatTokenPrice(totalPrice)} ${art.token.symbol || 'ELF'}`,
        usdPrice: formatUSDPrice(totalUSDPrice),
        item: isERC721(nftInfo!) ? undefined : handlePlurality(quantity, 'item'),
      },
      title: DealMessage.title,
      content: {
        title: walletInfo.portkeyInfo ? DealMessage.portkey.title : DealMessage.default.title,
        content: walletInfo.portkeyInfo ? DealMessage.portkey.message : DealMessage.default.message,
      },
      initialization: onDeal,
      onClose: () => {
        promptModal.hide();
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

  return (
    <Modal
      footer={
        <Button
          disabled={!!dealDisabled}
          loading={loading}
          type="primary"
          size="ultra"
          onClick={onConfirm}
          className="w-[256px]">
          Deal the offer
        </Button>
      }
      onCancel={onCancel}
      afterClose={modal.remove}
      title="Accept Offer"
      open={modal.visible}
      className={styles['deal-modal-custom']}>
      <div className="content">
        <PriceInfo quantity={quantity} price={art.price} convertPrice={art.convertPrice} type={PriceTypeEnum.DEAL} />
        {BigNumber(maxQuantity).gt(1) && (
          <div className="mt-[32px]">
            <InputQuantity
              defaultValue={1}
              value={quantity === 0 ? '' : formatTokenPrice(quantity)}
              onChange={onQuantityChange}
              availableMount={art.quantity}
              errorTip={quantityTip}
            />
          </div>
        )}

        <div className="mt-[32px]">
          <DealSummary />
        </div>
        <div className="mt-[32px]">
          <TotalPrice
            totalPrice={totalPrice.toNumber()}
            convertTotalPrice={totalUSDPrice.toNumber()}
            title="Total Earnings"
          />
        </div>
        <div className="mt-[32px]">
          <Balance itemDesc="Quantity of NFTs Owned" amount={nftNumber.nftBalance} />
        </div>
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(ExchangeModalNew));
