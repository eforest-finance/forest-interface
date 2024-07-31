import ElfLogo from 'assets/images/explore/aelf.svg';
import BigNumber from 'bignumber.js';
import { ITransitionFee } from 'components/Summary/useGetTransitionFee';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';

export default function TotalPrice(info: {
  totalPrice: string | number;
  convertTotalPrice?: string | number;
  title?: string;
  fee?: ITransitionFee;
  rate: number;
}) {
  const { totalPrice, title, fee = {}, rate = 1 } = info;
  const { forestServiceRate = 0, creatorLoyaltyRate = 0 } = fee;
  const totalPriceBig = new BigNumber(totalPrice);

  const resultPrice = totalPriceBig.isNaN()
    ? '--'
    : totalPriceBig.times(1 - (forestServiceRate + creatorLoyaltyRate)).toNumber();
  const priceUsd = totalPriceBig.multipliedBy(rate);

  return (
    <>
      <div className="flex justify-between ">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[var(--text-primary)]">{title || 'Total'}</h3>
        <div className="flex flex-col items-end">
          <span className="flex text-[20px] leading-[28px] font-semibold text-[var(--text-primary)]">
            <ElfLogo className="mr-[8px]" />
            {formatTokenPrice(resultPrice)} ELF
          </span>
          <span className="mt-[8px] text-[16px] leading-[24px] font-medium text-[var(--text-secondary)]">
            {formatUSDPrice(priceUsd)}
          </span>
        </div>
      </div>
    </>
  );
}
