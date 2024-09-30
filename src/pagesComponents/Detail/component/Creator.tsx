import { useRouter } from 'next/navigation';
import useDetailGetState from '../../../store/state/detailGetState';
import useGetState from 'store/state/getState';
import { ImageEnhance } from 'components/ImgLoading';

export default function Creator() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const nav = useRouter();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  return (
    <div
      className={` flex items-center   text-brandNormal font-medium truncate ${
        isSmallScreen ? 'text-base' : 'text-[16px]'
      } cursor-pointer`}
      onClick={() => nftInfo?.nftCollection?.id && nav.push(`/explore-items/${nftInfo?.nftCollection?.id}`)}>
      <ImageEnhance
        className=" !w-[24px] !h-[24px] aspect-square rounded-full object-contain mr-[8px]"
        src={nftInfo?.nftCollection?.logoImage || ''}
      />
      {nftInfo?.nftCollection?.tokenName}
    </div>
  );
}
