import { useMemo } from 'react';
import useDetailGetState from 'store/state/detailGetState';

export const useGetOwnerInfo = () => {
  const { detailInfo } = useDetailGetState();
  const { nftNumber } = detailInfo;

  const isOnlyOwner: boolean = useMemo(
    () => !!(nftNumber.nftBalance && nftNumber.nftBalance === nftNumber.nftQuantity),
    [nftNumber.nftBalance, nftNumber.nftQuantity],
  );
  const isOwner: boolean = useMemo(() => !!nftNumber.nftBalance, [nftNumber.nftBalance]);

  return {
    isOnlyOwner,
    isOwner,
  };
};
