import useDetailGetState from 'store/state/detailGetState';

export default function Title({ className }: { className?: string }) {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  return (
    <div
      className={`text-textPrimary font-semibold title overflow-hidden text-ellipsis text-xl mdTW:text-[40px] mdTW:leading-[48px] ${className}`}>
      {nftInfo?.tokenName || ''}
    </div>
  );
}
