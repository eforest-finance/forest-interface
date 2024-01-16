import { Col, Row, Tooltip } from 'antd';
import ELF from 'assets/images/ELF.png';
import ADD from 'assets/images/+.svg';
import WarningMark from 'assets/images/waring.svg';
import SUBTRACT from 'assets/images/subtract.svg';

import Logo from 'components/Logo';
import { useEffect, useMemo, useState } from 'react';

import styles from './style.module.css';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { SERVICE_FEE } from 'constants/common';
import ImgLoading from 'baseComponents/ImgLoading/ImgLoading';
import { refreshDetailPage } from 'pagesComponents/Detail/util';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import getListings from 'pagesComponents/Detail/utils/getListings';
import { FormatListingType } from 'store/types/reducer';
import { IFixPriceList } from 'contract/type';
import { cloneDeep } from 'lodash-es';
import BigNumber from 'bignumber.js';
import useBatchBuyNow from 'pagesComponents/Detail/hooks/useBatchBuyNow';
import { DEFAULT_PAGE_SIZE } from 'constants/index';

interface IValidListInfo {
  curMax: number;
  validList: FormatListingType[];
}
import moment from 'moment';
import { timesDecimals } from 'utils/calculate';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { ZERO } from 'constants/misc';

export default function BuyNowModal(options: {
  visible: boolean;
  elfRate: number;
  onClose: () => void;
  nftBalance: number;
}) {
  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;
  const { visible, onClose, nftBalance, elfRate } = options;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<FormatListingType[]>([]);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<BigNumber>(ZERO);
  const [buyListings, setBuyListings] = useState<IFixPriceList[]>([]);

  const batchBuyNow = useBatchBuyNow(nftInfo?.chainId);

  const convertTotalPrice = useMemo(() => {
    const convert = totalPrice.multipliedBy(elfRate).toFixed(2, BigNumber.ROUND_DOWN);
    return convert;
  }, [elfRate, totalPrice]);
  const [quantity, setQuantity] = useState<number>(0);

  const averagePrice = useMemo(() => {
    const average = quantity ? totalPrice.div(quantity).toFixed(4, BigNumber.ROUND_DOWN) : 0;
    return average;
  }, [totalPrice, quantity]);

  const convertAveragePrice = useMemo(() => {
    const averagePriceBig = new BigNumber(averagePrice);
    const convertAverage = averagePriceBig.multipliedBy(elfRate).toFixed(2, BigNumber.ROUND_DOWN);
    return convertAverage;
  }, [averagePrice, elfRate]);

  const { getAccountInfoSync } = useWalletSyncCompleted();

  const onChangeQuantity = (type: '+' | '-') => {
    if (nftInfo && isTokenIdReuse(nftInfo)) {
      if (type === '+') {
        setQuantity((v) => (++v > maxQuantity ? maxQuantity : v));
        addBuyListings();
      } else {
        setQuantity((v) => (--v < 1 ? 1 : v));
        minusBuyListings();
      }
    }
  };

  const onConfirm = async () => {
    setLoading(true);
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      setLoading(false);
      return;
    }

    const batchBuyNowRes = await batchBuyNow({
      symbol: nftInfo!.nftSymbol,
      fixPriceList: buyListings.map((list) => {
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

    if (batchBuyNowRes === 'error') {
      setLoading(false);
      return;
    }
    setLoading(false);
    onClose();
    refreshDetailPage();
  };

  const addBuyListings = () => {
    if (listings.length && visible) {
      const curIndex = buyListings.length - 1;
      if (curIndex === -1 || buyListings[curIndex]?.quantity === listings[curIndex]?.quantity) {
        const price = listings[curIndex + 1].price;
        const buyListing: IFixPriceList = {
          offerTo: listings[curIndex + 1].ownerAddress,
          quantity: 1,
          price: {
            symbol: listings[curIndex + 1].purchaseToken.symbol,
            amount: price,
          },
          startTime: {
            seconds: moment.unix(Math.floor(listings[curIndex + 1].startTime / 1000)).unix(),
            nanos: 0,
          },
        };
        setBuyListings([...buyListings, buyListing]);
        setTotalPrice((p) => p.plus(price));
      } else if (buyListings[curIndex].quantity < listings[curIndex].quantity) {
        const price = buyListings[curIndex].price.amount;
        const buyListing: IFixPriceList = { ...buyListings[curIndex], quantity: buyListings[curIndex].quantity + 1 };
        const listings = cloneDeep(buyListings);
        listings.splice(-1, 1, buyListing);
        setBuyListings(listings);
        setTotalPrice((p) => p.plus(price));
      }
    }
  };

  const minusBuyListings = () => {
    if (listings.length && visible) {
      const curIndex = buyListings.length ? buyListings.length - 1 : 0;
      if (!buyListings[curIndex]) return;
      if (buyListings[curIndex].quantity === 1) {
        const listings = cloneDeep(buyListings);
        const price = listings[curIndex].price.amount;
        listings.splice(-1, 1);
        setBuyListings(listings);
        setTotalPrice((p) => p.minus(price));
      } else {
        const buyListing: IFixPriceList = { ...buyListings[curIndex], quantity: buyListings[curIndex].quantity - 1 };
        const listings = cloneDeep(buyListings);
        const price = listings[curIndex].price.amount;
        listings.splice(-1, 1, buyListing);
        setBuyListings(listings);
        setTotalPrice((p) => p.minus(price));
      }
    }
  };

  const getListingsData = async (page: number) => {
    try {
      if (!nftInfo) return;
      const res = await getListings({
        page,
        chainId: nftInfo.chainId,
        symbol: nftInfo.nftSymbol,
        address: walletInfo.address,
      });
      if (!res) return;
      setTotalCount(res.totalCount);
      const { curMax, validList }: IValidListInfo = res.list.reduce(
        (pre: IValidListInfo, val) => {
          if (val.ownerAddress === walletInfo.address) {
            return pre;
          }
          return {
            curMax: pre.curMax + val.quantity,
            validList: [...pre.validList, val],
          };
        },
        {
          curMax: 0,
          validList: [],
        },
      );

      if (validList.length === 0 && totalCount > page * DEFAULT_PAGE_SIZE) {
        setPage((page) => ++page);
        return;
      }

      setListings([...listings, ...validList]);
      setMaxQuantity((maxQuantity) => {
        return maxQuantity + curMax;
      });
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    if (listings.length && !buyListings.length) {
      addBuyListings();
      setQuantity(1);
    }
  }, [buyListings.length, listings]);

  useEffect(() => {
    if (quantity === maxQuantity && page * DEFAULT_PAGE_SIZE < totalCount) {
      setPage((page) => ++page);
    }
  }, [quantity, maxQuantity]);

  useEffect(() => {
    if (visible) {
      getListingsData(page);
    } else {
      setQuantity(0);
      setPage(1);
      setListings([]);
      setBuyListings([]);
      setTotalPrice(ZERO);
      setMaxQuantity(0);
    }
  }, [page, visible]);

  return (
    <Modal
      className={`${styles['buy-modal']} ${isSmallScreen && styles['mobile-buy-modal']}`}
      footer={
        <Button disabled={!quantity} loading={loading} type="primary" size="ultra" onClick={onConfirm}>
          Confirm Checkout
        </Button>
      }
      onCancel={onClose}
      title="Complete checkout"
      open={visible}>
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
              nextImageProps={{ width: 96, height: 96 }}
            />
            <div className={`info ${isSmallScreen && styles['content-relative']} font-medium`}>
              <p
                className={`${
                  isSmallScreen ? 'text-[14px] leading-[21px]' : 'text-[16px] leading-[24px]'
                } text-[var(--brand-base)]`}>
                {nftInfo?.nftCollection?.tokenName}
              </p>
              <p
                className={` text-[var(--color-primary)] ${
                  isSmallScreen ? 'text-[16px] leading-[24px]' : 'text-[20px] leading-[30px]'
                }`}>
                {nftInfo?.tokenName}
              </p>
              <p
                className={`text-[12px] text-[var(--color-secondary)] leading-[18px] flex mt-[16px] ${styles.royalties}`}>
                Service Fee: {SERVICE_FEE}
                <Tooltip title="The creator of this collection will receive 2.5% of the sale total from future sales of this item">
                  <div className={`${isSmallScreen ? 'w-[10.5px]' : 'w-[14px]'}`}>
                    <WarningMark />
                  </div>
                </Tooltip>
              </p>
              <div className={`${styles.counter} flex items-center`}>
                <button disabled={quantity <= 1} onClick={() => onChangeQuantity('-')}>
                  <SUBTRACT />
                </button>
                {quantity}
                <button
                  disabled={quantity >= maxQuantity || !(nftInfo && isTokenIdReuse(nftInfo))}
                  onClick={() => onChangeQuantity('+')}>
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
                <span className="font-semibold text-[16px] leading-[24px]">{averagePrice}</span>
              </div>
              <span
                className={`text-[var(--color-secondary)] leading-[18px] text-[12px] ${
                  isSmallScreen ? 'ml-2' : 'mt-[2px]'
                }`}>
                ${convertAveragePrice}
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
              {totalPrice.toFixed(4, BigNumber.ROUND_DOWN)}
            </span>
          </div>
          <p className="leading-[24px] text-[var(--color-secondary)] text-[16px]">${convertTotalPrice}</p>
        </Col>
      </Row>
    </Modal>
  );
}
