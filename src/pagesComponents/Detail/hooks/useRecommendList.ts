import { useCallback, useEffect, useState } from 'react';
import { openModal } from 'store/reducer/errorModalInfo';
import { store } from 'store/store';
import { fetchCompositeNftInfos } from 'api/fetch';
import useGetState from 'store/state/getState';
import { INftInfo } from 'types/nftTypes';
import useDetailGetState from 'store/state/detailGetState';
import { MAX_RESULT_COUNT_5 } from 'constants/common';

export function useRecommendList() {
  const { walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  const [list, setList] = useState<INftInfo[]>();
  const getList = useCallback(async () => {
    const CollectionId = nftInfo?.nftCollection?.id;
    const result = await fetchCompositeNftInfos({
      CollectionType: CollectionId?.endsWith('-SEED-0') ? 'seed' : 'nft',
      CollectionId: nftInfo?.nftCollection?.id,
      SkipCount: 0,
      MaxResultCount: MAX_RESULT_COUNT_5,
      Sorting: 'ListingTime Desc',
      address: walletInfo?.address || '',
    });
    if (!result) {
      setList([]);
      store.dispatch(openModal());
    }
    setList(result?.items?.slice(0, 5));
  }, [nftInfo?.nftCollection?.id]);

  useEffect(() => {
    if (nftInfo?.nftCollection?.id) {
      setList([]);
      getList();
    }
  }, [getList, nftInfo?.nftCollection?.id, walletInfo.address]);
  return list;
}
