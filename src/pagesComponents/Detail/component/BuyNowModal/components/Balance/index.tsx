import { formatTokenPrice } from 'utils/format';

export default function Balance(props: { amount: number | string; itemDesc?: string; suffix?: string }) {
  const { itemDesc, amount, suffix } = props;
  return (
    <div className="flex justify-between  p-[24px] rounded-lg bg-[var(--fill-hover-bg)] text-[18px] leading-[26px] font-semibold text-[var(--text-primary)]">
      <span>{itemDesc || 'Balance'}</span>
      <span>{`${formatTokenPrice(amount)}${suffix ? ` ${suffix}` : ''}`}</span>
    </div>
  );
}
