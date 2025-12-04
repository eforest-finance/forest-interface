import useGetTransitionFee from 'pagesComponents/Detail/hooks/useGetTransitionFee';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';

export default function Summary() {
  const transitionFee = useGetTransitionFee();
  return (
    <>
      <h3 className="text-[18px] leading-[26px] font-medium text-[var(--text-primary)]">Summary</h3>
      <div className="flex justify-between mt-[16px]">
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
          Estimated Transaction Fee
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
            {formatTokenPrice(transitionFee?.transactionFee || 0)} ELF
          </span>
          <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)] mt-[8px]">
            {formatUSDPrice(transitionFee?.transactionFeeOfUsd || 0)}
          </span>
        </div>
      </div>
    </>
  );
}
