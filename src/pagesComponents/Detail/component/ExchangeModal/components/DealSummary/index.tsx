import useGetTransitionFee from 'pagesComponents/Detail/hooks/useGetTransitionFee';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';

export default function DealSummary() {
  const transactionFee = useGetTransitionFee();
  return (
    <>
      <h3 className="text-[18px] leading-[26px] font-medium text-[var(--text-primary)]">Preview</h3>
      <div className="flex justify-between mt-[16px]">
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">Forest Fees</span>
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
          {(transactionFee?.forestServiceRate || 0) * 100}%
        </span>
      </div>
      {/* <div className="flex justify-between mt-[8px]">
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">Creator Royalty Fee</span>
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">2.5%</span>
      </div> */}
      <div className="flex justify-between mt-[8px]">
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
          Est. Transaction Fee
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
            {transactionFee?.transactionFee ? formatTokenPrice(transactionFee?.transactionFee) : '-'} ELF
          </span>
          <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)] mt-[8px]">
            {formatUSDPrice(transactionFee?.transactionFeeOfUsd || 0)}
          </span>
        </div>
      </div>
    </>
  );
}
