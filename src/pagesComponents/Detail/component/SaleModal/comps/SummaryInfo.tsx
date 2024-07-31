import BigNumber from 'bignumber.js';
import { formatTokenPrice } from 'utils/format';
import useGetState from 'store/state/getState';
interface IInfoItemProps {
  left: string;
  right: string;
  className?: string;
}

interface IPreviewInfo {
  listingPrice?: number | string;
  forestFees?: number;
  creatorEarns?: number;
  itemsForSell?: number | string;
}

const InfoItem = ({ left, right, className = '' }: IInfoItemProps) => {
  return (
    <div className={`flex mb-2 justify-between text-textSecondary `}>
      <span className={`text-base font-normal ${className}`}>{left}</span>
      <span className={`text-base font-normal ${className}`}>{right}</span>
    </div>
  );
};

const getShowInfoData = ({
  listingPrice = '',
  itemsForSell = 1,
  forestFees = 0.025,
  creatorEarns = 0,
}: IPreviewInfo) => {
  const num = new BigNumber(itemsForSell);
  const price = new BigNumber(listingPrice);
  const showPrice = price.isNaN() ? '--' : formatTokenPrice(price.times(num));
  const totalPrice =
    num.isNaN() || price.isNaN()
      ? '--'
      : price
          .times(num)
          .times(1 - (forestFees + creatorEarns))
          .toNumber();
  const showForestFees = new BigNumber(forestFees).times(100).toNumber();
  const showCreatorEarns = new BigNumber(creatorEarns).times(100).toNumber();

  return {
    showPrice: `${formatTokenPrice(showPrice)} ELF`,
    showForestFees: `${showForestFees}%`,
    showCreatorEarns: `${showCreatorEarns}%`,
    totalPrice: `${formatTokenPrice(totalPrice)} ELF`,
  };
};

export function SummaryInfo(props: IPreviewInfo) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { showPrice, showForestFees, totalPrice, showCreatorEarns } = getShowInfoData(props);

  return (
    <div className={`-mb-2 flex flex-col ${isSmallScreen ? 'mt-6' : 'mt-8'}`}>
      <span className="font-medium text-textPrimary text-lg rounded-lg mb-4">Preview</span>
      <InfoItem left="Listing Price" right={showPrice} />
      <InfoItem left="Forest Fees" right={showForestFees} />
      <InfoItem left="Creator Earnings" right={showCreatorEarns} />
      <InfoItem className="text-textPrimary" left="Total Potential Earnings" right={totalPrice} />
    </div>
  );
}
