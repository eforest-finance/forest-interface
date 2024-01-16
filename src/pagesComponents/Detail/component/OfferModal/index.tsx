import { message } from 'antd';
import Arrow from 'assets/images/arrow.svg';
import Clock from 'assets/images/clock.svg';
import ELF from 'assets/images/ELF.png';
import styles from './style.module.css';
import { memo, useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';

import DatePickerPC from 'components/DatePickerPC';
import TimePickerPC from 'components/TimePickerPC';
import TimePickerMobile from 'components/TimePickerMobile';
import DatePickerMobile from 'components/DatePickerMobile';
import useMakeOffer from 'pagesComponents/Detail/hooks/useMakeOffer';
import BigNumber from 'bignumber.js';
import { timesDecimals } from 'utils/calculate';
import InputHint from 'components/InputHint';
import { unitConverter } from 'utils/unitConverter';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import Image from 'next/image';
import { AMOUNT_LENGTH, DEVICE_TYPE } from 'constants/common';
import { MILLISECONDS_PER_DAY, MILLISECONDS_PER_HALF_HOUR, TIME_FORMAT_12_HOUR } from 'constants/time';
import { Select, Option } from 'baseComponents/Select';
import Input from 'baseComponents/Input';
import Button from 'baseComponents/Button';
import Modal from 'baseComponents/Modal';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import clsx from 'clsx';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';

function OfferModal(options: { onClose?: () => void; rate: number }) {
  const modal = useModal();
  const pathname = usePathname();

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [token, setToken] = useState<string>('ELF');
  const [quantity, setQuantity] = useState<number>();
  const [price, setPrice] = useState<string | undefined>();
  const [expirationType, setExpirationType] = useState('7');
  const [selectedDate, setSelectedDate] = useState<Moment>();
  const [selectedTime, setSelectedTime] = useState<Moment>();
  const [mobileDateVisible, setMobileDateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>();
  const [currentTime, setCurrentTime] = useState<string[]>();
  const [mobileDate, setMobileDate] = useState<Date>();
  const [mobileTime, setMobileTime] = useState<string[]>();
  const { onClose, rate } = options;
  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;
  const makeOffer = useMakeOffer(nftInfo?.chainId);
  const { getAccountInfoSync } = useWalletSyncCompleted();

  const [balanceNotEnough, setBalanceNotEnough] = useState<boolean>(false);

  const numberFormat = (value: number) => {
    return unitConverter(value.toFixed(2)).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  };

  const priceToELF = useMemo(() => {
    return (quantity || 0) * (Number(new BigNumber(price || 0).valueOf()) || 0);
  }, [quantity, price]);

  const onQuantityChange = (val: string) => {
    const numQuantity = Number(val.replace(/\.\d+|\./, ''));
    setQuantity(numQuantity);
  };

  const onTokenChange = (e: string) => {
    setToken(e);
    setPrice(undefined);
  };

  const onPriceChange = (e: { target: { value: string } }) => {
    const v = new BigNumber(e.target.value);
    if ((v.e || 0) > AMOUNT_LENGTH) return;
    const val = e.target.value
      .split('')
      .filter((i: string) => i !== '-')
      .join('');
    const index = val.split('').findIndex((item: string) => item === '.') + 1;

    setPrice(index ? val.slice(0, index + 2) : val);
  };

  useEffect(() => {
    const priceBig = BigNumber(priceToELF);
    const balanceBig = BigNumber(getBalance(DEVICE_TYPE.PC));
    if (priceBig.comparedTo(balanceBig) > -1) {
      setBalanceNotEnough(true);
    } else {
      setBalanceNotEnough(false);
    }
  }, [priceToELF, nftNumber.tokenBalance]);

  const onExpirationTypeChange = (e: string) => {
    setMobileDate(undefined);
    setMobileTime(undefined);
    setExpirationType(e);
  };

  const onDateChange = (e: Moment) => {
    setSelectedDate(e);
  };
  const onTimeChange = (e: Moment) => {
    setSelectedTime(e);
  };

  const onVisibleChange = () => {
    setExpirationType('7');
    setSelectedTime(undefined);
    setSelectedTime(undefined);
    setToken('ELF');
    const date = moment();
    setCurrentTime([
      (date.hour() % TIME_FORMAT_12_HOUR).toString().padStart(2, '0'),
      date.minute().toString().padStart(2, '0'),
      date.hour() >= TIME_FORMAT_12_HOUR ? 'pm' : 'am',
    ]);
    setCurrentDate(new Date(date.valueOf()));
  };

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  useEffect(onVisibleChange, [modal.visible]);

  const MobilePicker = () => {
    const clockTime =
      expirationType === 'custom'
        ? moment(mobileDate || moment(currentDate).valueOf() + MILLISECONDS_PER_HALF_HOUR)?.format('YYYY/MM/DD HH:mm a')
        : mobileTime
        ? moment(`${mobileTime.slice(0, 2).join(':')} ${mobileTime[2]}`, 'hh:mm a').format('HH:mm a')
        : moment(`${currentTime?.slice(0, 2).join(':')} ${currentTime?.slice(2)}`, 'hh:mm a').format('HH:mm a');
    return (
      <>
        <div
          className={styles['time-btn']}
          onClick={() => {
            setMobileDateVisible(true);
          }}>
          <div className="flex items-center justify-center">
            <Clock />
            {clockTime}
          </div>
          <Arrow />
        </div>
        {expirationType === 'custom' ? (
          <DatePickerMobile
            visible={mobileDateVisible}
            className={styles['time-picker-mobile']}
            onCancel={() => {
              setMobileDateVisible(false);
            }}
            onConfirm={(e) => {
              setMobileDate(e);
              setMobileDateVisible(false);
            }}
            value={mobileDate}
            defaultValue={currentDate || new Date()}
          />
        ) : (
          <TimePickerMobile
            visible={mobileDateVisible}
            className={styles['time-picker-mobile']}
            onConfirm={(e) => {
              setMobileTime((e as string[]).map((item) => item.padStart(2, '0')));
              setMobileDateVisible(false);
            }}
            onCancel={() => {
              setMobileDateVisible(false);
            }}
          />
        )}
      </>
    );
  };

  const PCPicker = () => {
    return (
      <div className={styles['part-right']}>
        {expirationType === 'custom' ? (
          <DatePickerPC
            value={selectedDate}
            defaultValue={moment(currentDate)}
            onSelect={onDateChange}
            className="w-full"
          />
        ) : (
          <TimePickerPC value={selectedTime} defaultTime={moment(currentDate)} onSelect={onTimeChange} />
        )}
      </div>
    );
  };

  const onCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const onMakeOffer = async () => {
    setLoading(true);

    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      setLoading(false);
      return;
    }

    if (nftInfo && quantity && price) {
      message.loading('Making offer', 0);
      let expireTime: number = moment(currentDate).valueOf() + MILLISECONDS_PER_HALF_HOUR;
      let tempTime;

      if (expirationType === 'custom') {
        isSmallScreen
          ? mobileDate && (expireTime = moment(mobileDate).valueOf())
          : selectedDate && (expireTime = moment(selectedDate).valueOf());
      } else {
        tempTime = isSmallScreen
          ? mobileTime
            ? moment()
                .set({ hour: Number(mobileTime[0]), minute: Number(mobileTime[1]) })
                .valueOf()
            : currentDate
          : selectedTime || currentDate;
        expireTime = Number(expirationType)
          ? moment(tempTime).valueOf() + Number(expirationType) * MILLISECONDS_PER_DAY
          : moment(tempTime)
              .month(moment(tempTime).month() + 1)
              .valueOf();
      }

      const result = await makeOffer({
        symbol: nftInfo?.nftSymbol,
        quantity,
        price: {
          symbol: token,
          amount: Number(timesDecimals(price, 8)),
        },
        expireTime,
      });

      result === 'error' || onCloseModal();
      setLoading(false);
      setTimeout(message.destroy, 2000);
    }
  };

  const makeOfferDisabled = () => {
    const quantityStatus = quantity ? quantity <= 0 : true;
    const priceStatus = price ? new BigNumber(price).comparedTo(0) < 0 : true;
    return quantityStatus || priceStatus || balanceNotEnough;
  };

  const getBalance = (type: DEVICE_TYPE) => {
    if (type === DEVICE_TYPE.PC) {
      return (Number(nftNumber.tokenBalance?.valueOf()) / 10 ** 8).toFixed(2);
    }
    return (Number(nftNumber.tokenBalance?.valueOf()) / 10 ** 8).toFixed(2);
  };

  useEffect(() => {
    setQuantity(undefined);
    setPrice(undefined);
  }, [modal.visible]);

  return (
    <Modal
      destroyOnClose
      className={`${styles['offer-modal']} ${isSmallScreen && styles['mobile-offer-modal']}`}
      footer={
        <>
          <Button type="primary" size="large" loading={loading} disabled={makeOfferDisabled()} onClick={onMakeOffer}>
            Make Offer
          </Button>
          <Button size="large" onClick={() => onCloseModal()}>
            Cancel
          </Button>
        </>
      }
      onCancel={onCloseModal}
      title="Make an offer"
      open={modal.visible}>
      <div className={'content'}>
        <div className={styles['field-item']}>
          <p className={styles['item-title']}>Quantity</p>
          <div>
            <InputHint
              defaultValue="0"
              onChange={onQuantityChange}
              value={quantity?.toString()}
              type="number"
              maxCount={nftNumber.nftQuantity - nftNumber.nftBalance}
              loading={nftNumber.loading}
            />
          </div>
        </div>
        <div className={styles['field-item']}>
          <p className={styles['item-title']}>Price per item</p>
          <div className="flex">
            <div className={clsx(styles['part-left'], 'flex flex-1 flex-col')}>
              <Select className="!w-full" defaultValue={token} getPopupContainer={(v) => v} onChange={onTokenChange}>
                <Option key="ELF">
                  <Image src={ELF} alt="elf" />
                  ELF
                </Option>
              </Select>
              {isSmallScreen && (
                <span className={clsx(styles['convert-price'], 'px-[16px] text-[16px] leading-[24px] font-medium')}>
                  {formatUSDPrice(new BigNumber(price || 0).times(rate))}
                </span>
              )}
              <span
                className={`${styles['total-offered']} text-[var(--color-disable)] font-medium ${
                  isSmallScreen ? 'leading-[18px] text-[12px] mt-[8px] whitespace-nowrap' : 'leading-[21px] mt-[10px]'
                }`}>
                Total amount offered: {formatTokenPrice(priceToELF)} ELF
              </span>
              {isSmallScreen && (
                <span className="text-[var(--color-disable)] font-medium leading-[18px] text-[12px] mt-[8px] whitespace-nowrap">
                  Balance: {formatTokenPrice(getBalance(DEVICE_TYPE.MOBILE))}
                  {token}
                </span>
              )}
            </div>
            <div className={clsx(styles['part-right'], 'flex flex-1 flex-col')}>
              <div className="flex">
                <Input
                  value={price}
                  onKeyDown={(e) => {
                    /\d|\.|Backspace/.test(e.key) || e.preventDefault();
                  }}
                  className={isSmallScreen ? '' : '!rounded-tr-none !rounded-br-none'}
                  onChange={onPriceChange}
                  step={0.01}
                  placeholder="Amount"
                  type="number"
                />
                {!isSmallScreen ? (
                  <p
                    className={clsx(
                      styles['convert-price'],
                      'border border-solid border-[var(--line-box)] py-[8px] px-[12px] text-[16px] leading-[30px] font-medium',
                    )}>
                    ${numberFormat(new BigNumber(price || 0).times(rate).toNumber())}
                  </p>
                ) : null}
              </div>
              {balanceNotEnough && (
                <div className="mt-[8px] text-[var(--red1)] text-right ">{'Insufficient funds'}</div>
              )}

              {!isSmallScreen && !balanceNotEnough ? (
                <span className="text-[var(--color-disable)] font-medium leading-[21px] mt-[10px] text-right">
                  Balance:
                  {formatTokenPrice(getBalance(DEVICE_TYPE.PC))}
                  {token}
                </span>
              ) : null}
            </div>
          </div>
          <span className={`flex mt-[8px] text-[var(--color-disable)] ${isSmallScreen && 'text-[12px]'}`}>
            Please enter a maximum of 10 digits.
          </span>
        </div>
        <div className={styles['field-item']}>
          <p className={styles['item-title']}>Offer Expiration</p>
          <div className={`${isSmallScreen ? 'flex flex-col' : 'flex'}`}>
            <div className={`${isSmallScreen ? 'w-full' : styles['part-left']}`}>
              <Select
                className="!w-full"
                defaultValue={expirationType}
                getPopupContainer={(v) => v}
                onChange={onExpirationTypeChange}>
                <Option key="3">3 days</Option>
                <Option key="7">7 days</Option>
                <Option key="month">A month</Option>
                <Option key="custom">Custom Date</Option>
              </Select>
            </div>
            {!isSmallScreen ? PCPicker() : MobilePicker()}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(OfferModal));
