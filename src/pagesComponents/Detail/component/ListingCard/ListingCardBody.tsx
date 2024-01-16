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

interface IProps {
  isERC721: boolean;
  rate: number;
  currentRole: SegmentedValue;
}

function ListingCardBody(props: IProps) {
  const { isERC721, currentRole, rate } = props;

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
    title: string;
    price?: number;
    time?: string | null;
    timePrefix?: string;
  }) => {
    console.log('getPriceComponent', price);
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
        title: 'Current Price',
        price: nftInfo?.listingPrice,
      }),
      [NftInfoPriceType.myMinListing]: getPriceComponent({
        title: 'Current Price',
        price: nftInfo?.listingPrice,
      }),
      [NftInfoPriceType.maxOffer]: getPriceComponent({
        title: 'Best Offer',
        price: nftInfo?.maxOfferPrice,
        time: nftInfo?.maxOfferEndTime,
        timePrefix: 'Offer expires on',
      }),
      [NftInfoPriceType.latestDeal]: getPriceComponent({
        title: 'Last Sale',
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

  return (
    <div className="flex-col !items-start p-[24px] lgTW:flex flex mdTW:block !justify-between mdTW:flex-row mdTW:!items-end">
      <div
        className={`w-full mdTW:w-auto mdTW:pt-0 mdTW:pb-[24px] px-0 pb-0 lgTW:p-0 ${
          isSmallScreen ? 'flex flex-col w-[100%]' : 'flex'
        }`}>
        {!isERC721 && nftNumber.nftBalance && currentRole === 'sell' ? (
          <SellNumber />
        ) : nftInfo.showPriceType ? (
          PriceCardCom[nftInfo.showPriceType]
        ) : (
          getPriceComponent({ title: 'Current Price' })
        )}
      </div>
      <ListingCardButton isERC721={isERC721} rate={rate} currentRole={currentRole} />
    </div>
  );
}

export default React.memo(forwardRef(ListingCardBody));
