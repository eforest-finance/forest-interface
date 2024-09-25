import { forwardRef, useMemo } from 'react';

import useDetailGetState from 'store/state/detailGetState';
import React from 'react';
import useGetState from 'store/state/getState';
import { NftInfoPriceType } from 'types/nftTypes';
import { divDecimals } from 'utils/calculate';
import { SegmentedValue } from 'antd/lib/segmented';
import ListingCardButton from './ListingCardButton';
import PriceCard from '../PriceCard';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import Pencil from 'assets/images/v2/pencil.svg';
import Sale from 'assets/images/v2/lastSale.svg';
import Best from 'assets/images/v2/best.svg';

import { Divider } from 'antd';
import ListingCardTitle, { ListingCardType } from './ListingCardTitle';
import Alarm from 'assets/images/v2/alarm.svg';
import { timeFormat } from 'pagesComponents/Detail/utils/timeFormat';
import Countdown from 'baseComponents/Countdown';
import styles from './style.module.css';

interface IProps {
  isERC721: boolean;
  rate: number;
  isHiddenTitle: boolean;
  isListing: boolean;
  onChangeCurrentRole: any;
  hasChange: boolean;
  currentRole: SegmentedValue;
}

function ListingCardBody(props: IProps) {
  const { isERC721, currentRole, rate, onChangeCurrentRole, isListing, isHiddenTitle, hasChange } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;

  const getPrice = (price: number) => {
    return price ? divDecimals(price, 0).times(rate).toNumber() : '--';
  };

  const getPriceComponent = ({
    title,
    price,
    time,
    timePrefix,
  }: {
    title: any;
    price?: number;
    time?: string | null;
    timePrefix?: string;
  }) => {
    console.log('getPriceComponent', price, time);
    return (
      <PriceCard
        title={title}
        price={price ? formatTokenPrice(price) : 'Not Listed'}
        priceSymbol={price ? 'ELF' : ''}
        usdPrice={price && formatUSDPrice(getPrice(price))}
        time={time}
        timePrefix={timePrefix}
      />
    );
  };

  const SellNumber = () => {
    if (!nftNumber.nftBalance) return null;
    return <PriceCard title={'Quantity Owned'} price={formatNumber(nftNumber.nftBalance)} />;
  };

  const PriceCardCom: Record<NftInfoPriceType, JSX.Element> = useMemo(
    () => ({
      [NftInfoPriceType.other]: getPriceComponent({
        title: '',
      }),
      [NftInfoPriceType.otherMinListing]: getPriceComponent({
        title: (
          <div className="flex items-center  text-[16px] text-textSecondary">
            <Pencil className="mr-[8px]" /> Current Price
          </div>
        ),
        price: nftInfo?.listingPrice,
      }),
      [NftInfoPriceType.myMinListing]: getPriceComponent({
        title: (
          <div className="flex items-center  text-[16px] text-textSecondary">
            <Pencil className="mr-[8px]" /> Current Price
          </div>
        ),
        price: nftInfo?.listingPrice,
      }),
      [NftInfoPriceType.maxOffer]: getPriceComponent({
        title: (
          <div className="flex items-center  text-[16px] text-textSecondary">
            <Best className="mr-[8px]" /> Best Offer
          </div>
        ),
        price: nftInfo?.maxOfferPrice,
        time: nftInfo?.maxOfferEndTime,
        timePrefix: 'Offer expires on',
      }),
      [NftInfoPriceType.latestDeal]: getPriceComponent({
        title: (
          <div className="flex items-center  text-[16px] text-textSecondary">
            <Sale className="mr-[8px]" /> Last Sale
          </div>
        ),
        price: nftInfo?.latestDealPrice,
      }),
    }),
    [
      nftInfo?.listingPrice,
      nftInfo?.listingToken,
      nftInfo?.listingEndTime,
      nftInfo?.maxOfferPrice,
      nftInfo?.maxOfferEndTime,
      nftInfo?.latestDealPrice,
      nftInfo?.latestDealTime,
    ],
  );

  if (!nftInfo) return null;

  const isShowTimeCard =
    !!(isListing && nftInfo?.listingEndTime) &&
    nftInfo?.listingEndTime &&
    (currentRole === 'buy' || (isERC721 && currentRole === 'sell'));

  const timePrefix = 'Sale ends on';

  return (
    <div className="mdTW:block">
      <div
        className={`w-full mdTW:w-auto mdTW:pt-0 mdTW:pb-[24px] px-0 pb-0 lgTW:p-0 ${
          isSmallScreen ? 'flex flex-col w-[100%]' : ''
        }`}>
        {!isERC721 && nftNumber.nftBalance && currentRole === 'sell' ? (
          // <SellNumber />
          // <>{getPriceComponent({ title: <div>Current Price</div> })}</>
          PriceCardCom[nftInfo.showPriceType]
        ) : nftInfo.showPriceType ? (
          <div className="flex items-center">
            {PriceCardCom[nftInfo.showPriceType]}
            {nftInfo.showPriceType === NftInfoPriceType.myMinListing && nftInfo.maxOfferPrice > 0 && (
              <>
                <Divider className="!h-[76px] !mx-[42px]" type="vertical" /> {PriceCardCom[NftInfoPriceType.maxOffer]}
              </>
            )}
          </div>
        ) : (
          <>
            {getPriceComponent({
              title: (
                <div className="flex items-center  text-[16px] text-textSecondary">
                  <Pencil className="mr-[8px]" /> Current Price
                </div>
              ),
            })}
          </>
        )}
      </div>
      {!isHiddenTitle && (
        <ListingCardTitle
          // showTime={!!(isListing && nftInfo?.listingEndTime)}
          showTime={false}
          endTime={nftInfo?.listingEndTime}
          hasChange={hasChange}
          currentRole={currentRole}
          onChangeCurrentRole={onChangeCurrentRole}
          isERC721={isERC721}
        />
      )}
      <div className={`${isHiddenTitle ? 'mt-[48px]' : 'mt-[24px] lg:mt-[28px]'}`}>
        <ListingCardButton isERC721={isERC721} rate={rate} currentRole={currentRole} />
      </div>
      {isShowTimeCard ? (
        <div className="flex items-center mt-[24px] lg:mt-[28px]">
          <Alarm className="mr-[8px]" />
          <span className={styles['time-panel-value']}>{`${timePrefix} ${timeFormat(
            nftInfo?.listingEndTime as string,
          )}`}</span>
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(forwardRef(ListingCardBody));
