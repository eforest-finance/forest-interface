import { useRouter } from 'next/navigation';
import useDetailGetState from '../../../store/state/detailGetState';
import useGetState from 'store/state/getState';

export default function Creator() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const nav = useRouter();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  console.log('detailInfo', detailInfo);
  return (
    <div
      className={`text-brandNormal inline-block font-semibold truncate ${
        isSmallScreen ? 'text-base' : 'text-xl'
      } cursor-pointer`}
      onClick={() => nftInfo?.nftCollection?.id && nav.push(`/explore-items/${nftInfo?.nftCollection?.id}`)}>
      {nftInfo?.nftCollection?.tokenName}
    </div>
  );
}
