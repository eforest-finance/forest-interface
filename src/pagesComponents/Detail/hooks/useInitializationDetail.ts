import { useParams } from 'next/navigation';
import { useDetail } from './useDetail';
import useTokenData from 'hooks/useTokenData';
import { useMemo } from 'react';
import useDetailGetState from 'store/state/detailGetState';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import useIntervalRequestForBid from './useIntervalRequestForBid';
import useGetNftNumber from './useGetNftNumber';
import useIntervalRequestForListings from './useIntervalRequestForListings';

export const useInitializationDetail = () => {
  const elfRate = useTokenData();
  const { id, chainId } = useParams() as {
    id: string;
    chainId: Chain;
  };
  const { isCanBeBid, getDetail, isFetching } = useDetail({ id });
  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;
  const getNFTNumber = useGetNftNumber({
    nftSymbol: nftInfo?.nftSymbol,
    chainId,
  });

  const isERC721: boolean = useMemo(() => !(nftInfo && isTokenIdReuse(nftInfo)), [nftInfo]);

  const intervalDataForBid = useIntervalRequestForBid(isCanBeBid, nftInfo?.nftSymbol, () => {
    getDetail();
    getNFTNumber({ nftSymbol: nftInfo?.nftSymbol });
  });

  useIntervalRequestForListings(id, chainId);

  return {
    isFetching,
    elfRate,
    isERC721,
    nftBalance: Number(nftNumber.nftBalance || 0),
    nftQuantity: Number(nftNumber.nftQuantity || 0),
    tokenBalance: nftNumber.tokenBalance,
    intervalDataForBid,
    isCanBeBid,
  };
};
