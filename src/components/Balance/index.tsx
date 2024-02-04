import Loading from 'components/Loading';
import { formatTokenPrice } from 'utils/format';

export default function Balance(props: {
  amount: number | string;
  itemDesc?: string;
  suffix?: string;
  loading?: boolean;
}) {
  const { itemDesc, amount, suffix, loading = false } = props;
  return (
    <div className="flex justify-between  p-[24px] rounded-lg bg-[var(--fill-hover-bg)] text-[18px] leading-[26px] font-semibold text-[var(--text-primary)]">
      <span>{itemDesc || 'Balance'}</span>
      {loading ? (
        <span>
          <Loading className="!h-[24px] !pb-0" imgStyle="h-[24px] w-[24px]" />
        </span>
      ) : (
        <span>{`${formatTokenPrice(amount)}${suffix ? ` ${suffix}` : ''}`}</span>
      )}
    </div>
  );
}
