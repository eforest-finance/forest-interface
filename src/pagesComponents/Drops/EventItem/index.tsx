import moment from 'moment';
import useResponsive from 'hooks/useResponsive';
import { IActionDetail } from 'api/types';
import { formatTokenPrice } from 'utils/format';
import SkeletonImage from 'baseComponents/SkeletonImage';
import BigNumber from 'bignumber.js';

interface IEventItemProps extends IActionDetail {
  imageUrl?: string;
}

export function EventItem({ expireTime, startTime, mintPrice, logoUrl, dropName }: IEventItemProps) {
  const { isXS } = useResponsive();

  const renderTime = () => {
    let str = '';

    if (moment().isBefore(moment(startTime))) {
      // activity is not start
      str = moment(startTime).format('MMM Do,YYYY [Starts]');
    } else if (moment().isSameOrAfter(moment(expireTime))) {
      str = 'Ended';
    } else {
      const diff = moment(expireTime).diff(moment());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      str = `${days}D ${hours}h ${minutes}m Ends`;
    }

    if (isXS) {
      return (
        <span className="absolute left-0 bottom-0 w-full p-[10px] bg-fillMask1 text-xs text-textWhite text-center font-medium">
          {str}
        </span>
      );
    } else {
      return <span className="text-base text-textPrimary font-semibold">{str}</span>;
    }
  };

  const isFree = new BigNumber(mintPrice).isEqualTo(0);

  return (
    <div className="rounded-lg flex flex-col border border-solid border-lineBorder overflow-hidden hover:bg-cardHover cursor-pointer">
      <div className="w-full aspect-square overflow-hidden relative">
        <SkeletonImage img={logoUrl} className="w-full h-full object-cover hover:scale-110 transition-all" />
        {isXS && renderTime()}
      </div>

      <div className="px-4 py-3 sml:px-6 sml:py-4">
        <div className="line-clamp-1 min-h-[24px] text-base text-ellipsis text-textPrimary font-semibold sml:line-clamp-1 sml:text-xl sml:min-h-[28px]">
          {dropName || '--'}
        </div>
        <div className="flex flex-col mt-2">
          {isFree ? (
            <span className="text-sm font-medium text-brandNormal break-words">Free</span>
          ) : (
            <span className="text-sm font-medium text-brandNormal break-words">
              {formatTokenPrice(mintPrice || '--')} ELF
            </span>
          )}
        </div>
        {!isXS ? <div className="flex flex-col mt-2">{renderTime()}</div> : null}
      </div>
    </div>
  );
}
