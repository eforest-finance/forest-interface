import { formatTokenPrice, formatUSDPrice } from 'utils/format';

export default function TotalPrice(info: {
  totalPrice: string | number;
  convertTotalPrice: string | number;
  title?: string;
}) {
  const { totalPrice, convertTotalPrice, title } = info;
  return (
    <>
      <div className="flex justify-between ">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[var(--text-primary)]">{title || 'Total'} </h3>
        <div className="flex flex-col items-end">
          <span className="text-[20px] leading-[28px] font-semibold text-[var(--text-primary)]">
            {formatTokenPrice(totalPrice)} ELF
          </span>
          <span className="mt-[8px] text-[16px] leading-[24px] font-medium text-[var(--text-secondary)]">
            {formatUSDPrice(convertTotalPrice)}
          </span>
        </div>
      </div>
    </>
  );
}
