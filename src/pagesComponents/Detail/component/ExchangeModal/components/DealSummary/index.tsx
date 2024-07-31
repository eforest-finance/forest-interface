import useGetTransitionFee from 'components/Summary/useGetTransitionFee';
import { INftInfo } from 'types/nftTypes';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';

export interface IDealSummary {
  nftInfo?: INftInfo;
}

export default function DealSummary(props: IDealSummary) {
  const { nftInfo } = props;
  const { transactionFee } = useGetTransitionFee(nftInfo?.nftCollection?.symbol);
  return (
    <>
      <h3 className="text-[18px] leading-[26px] font-medium text-[var(--text-primary)]">Preview</h3>
      <div className="flex justify-between mt-[16px]">
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">Forest Fees</span>
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
          {(transactionFee?.forestServiceRate || 0) * 100}%
        </span>
      </div>
      <div className="flex justify-between mt-[8px]">
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">Creator Earnings</span>
        <span className="text-[16px] leading-[24px] font-normal text-[var(--text-secondary)]">
          {(transactionFee?.creatorLoyaltyRate || 0) * 100}%
        </span>
      </div>
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
