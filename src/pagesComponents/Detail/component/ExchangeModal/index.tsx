import { Col, Row } from 'antd';
import ELF from 'assets/images/ELF.png';
import ADD from 'assets/images/+.svg';
import SUBTRACT from 'assets/images/subtract.svg';

import Logo from 'components/Logo';
import useDeal from 'pagesComponents/Detail/hooks/useDeal';
import { memo, useEffect, useMemo, useState } from 'react';
import useMakeOffer from '../../hooks/useMakeOffer';

import styles from './style.module.css';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { SERVICE_FEE } from 'constants/common';
import ImgLoading from 'components/ImgLoading/ImgLoading';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import BigNumber from 'bignumber.js';
import { GetBalance } from 'contract/multiToken';
import { divDecimals } from 'utils/calculate';
import { ZERO } from 'constants/misc';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';

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

function ExchangeModal(options: { onClose?: () => void; art: ArtType; nftBalance: number; exchangeType?: string }) {
  const modal = useModal();
  const pathname = usePathname();

  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;
  const { onClose, art, nftBalance, exchangeType } = options;
  const [loading, setLoading] = useState<boolean>(false);
  const [offerFromBalance, setOfferFromBalance] = useState<BigNumber>(ZERO);

  const maxQuantity = useMemo(() => {
    if (exchangeType) {
      const offerFromMaxQuantity = offerFromBalance.div(new BigNumber(art.price)).integerValue();
      const res = BigNumber.minimum(offerFromMaxQuantity, art.quantity, nftBalance);
      return Number(res);
    } else {
      return art?.quantity;
    }
  }, [art?.quantity, nftBalance, offerFromBalance]);

  const deal = useDeal(nftInfo?.chainId);
  const makeOffer = useMakeOffer(nftInfo?.chainId);
  const exchangeMethod = exchangeType ? deal : makeOffer;

  const [quantity, setQuantity] = useState<number>(1);

  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);
  const price = new BigNumber(art?.price || 0);
  const convertPrice = new BigNumber(art?.convertPrice || 0);

  const onChangeQuantity = (type: '+' | '-') => {
    type === '+' ? setQuantity((v) => (++v > maxQuantity ? maxQuantity : v)) : setQuantity((v) => (--v < 1 ? 1 : v));
  };

  const onVisibleChange = () => {
    setQuantity(1);
  };

  const getTotal = () => {
    return price.times(quantity);
  };

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
    if (exchangeType) {
      getOfferFromBalance();
    }
  }, [art, exchangeType]);

  useEffect(onVisibleChange, [modal.visible]);

  const onConfirm = async () => {
    setLoading(true);
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      setLoading(false);
      return;
    }
    await exchangeMethod({
      symbol: art.symbol as string,
      offerFrom: art.address,
      offerTo: art.address,
      price: { symbol: art.token.symbol as string, amount: new BigNumber(art.price).times(10 ** 8).toNumber() },
      quantity: quantity,
    });

    onCancel();
    setLoading(false);
  };

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  return (
    <Modal
      className={`${styles['buy-modal']} ${isSmallScreen && styles['mobile-buy-modal']}`}
      footer={
        <Button loading={loading} type="primary" size="ultra" onClick={onConfirm}>
          Confirm {exchangeType ? 'transaction' : 'Checkout'}
        </Button>
      }
      onCancel={onCancel}
      title={`Complete ${exchangeType ? 'transaction' : 'checkout'}`}
      open={modal.visible}>
      <Row className={`${styles['content-header']} text-[18px] font-medium`}>
        <Col span={14}>Item</Col>
        {isSmallScreen ? null : <Col span={10}>Subtotal</Col>}
      </Row>
      <div>
        <Row className={styles['content-body']} gutter={[0, 24]}>
          <Col
            className={`!flex ${isSmallScreen ? styles['content-relative'] : styles['content-static']}`}
            span={isSmallScreen ? 24 : 20}>
            <ImgLoading
              className={`${styles.art} rounded-[8px] ${isSmallScreen ? 'mr-[12px]' : 'mr-[24px]'}`}
              src={nftInfo?.previewImage || ''}
            />
            <div className={`info ${isSmallScreen && styles['content-relative']} font-medium`}>
              <p
                className={`${
                  isSmallScreen ? 'text-[14px] leading-[21px]' : 'text-[16px] leading-[24px]'
                } text-[var(--brand-base)]`}>
                {art?.collection}
              </p>
              <p
                className={` text-[var(--color-primary)] ${
                  isSmallScreen ? 'text-[16px] leading-[24px]' : 'text-[20px] leading-[30px]'
                }`}>
                {art?.name}
              </p>
              <p
                className={`text-[12px] text-[var(--color-secondary)] leading-[18px] flex mt-[16px] ${styles.royalties}`}>
                Service Fee: {SERVICE_FEE}
                {/* <Tooltip title="The creator of this collection will receive 2.5% of the sale total from future sales of this item">
                  <div className={`${isSmallScreen ? 'w-[10.5px]' : 'w-[14px]'}`}>
                    <WarningMark />
                  </div>
                </Tooltip> */}
              </p>
              <div className={`${styles.counter} flex items-center`}>
                <button disabled={quantity <= 1} onClick={() => onChangeQuantity('-')}>
                  <SUBTRACT />
                </button>
                {quantity}
                <button disabled={quantity >= maxQuantity} onClick={() => onChangeQuantity('+')}>
                  <ADD />
                </button>
              </div>
            </div>
          </Col>
          <Col className={styles['part-price']} span={isSmallScreen ? 24 : 4}>
            {isSmallScreen && <p>Subtotal</p>}
            <div
              className={`w-[max-content] flex  ${
                isSmallScreen ? 'items-center !justify-center' : 'flex-col items-end '
              }`}>
              <div className="leading-[24px] flex items-center !justify-center">
                <Logo className={'w-[24px] h-[24px]'} src={ELF} />
                &nbsp;
                <span className="font-semibold text-[16px] leading-[24px]">{formatTokenPrice(price)}</span>
              </div>
              <span
                className={`text-[var(--color-secondary)] leading-[18px] text-[12px] ${
                  isSmallScreen ? 'ml-2' : 'mt-[2px]'
                }`}>
                {formatUSDPrice(convertPrice)}
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <Row className={styles['content-bottom']}>
        <Col span={14} className="text-[18px] font-medium">
          <span
            className={`leading-[27px] text-[var(--color-primary)] ${isSmallScreen ? 'text-[18px]' : 'text-[24px]'}`}>
            Total
          </span>
        </Col>
        <Col span={10}>
          <div className={`${styles['total-price']} flex`}>
            <Logo className={'w-[20px] h-[24px]'} src={ELF} />
            <span className={`ml-[6px] text-[24px] font-semibold leading-[36px] text-[var(--brand-base)]`}>
              {formatTokenPrice(getTotal())}
            </span>
          </div>
          <p className="leading-[24px] text-[var(--color-secondary)] text-[16px]">
            {formatUSDPrice(convertPrice.times(quantity))}
          </p>
        </Col>
      </Row>
    </Modal>
  );
}

export default memo(NiceModal.create(ExchangeModal));
