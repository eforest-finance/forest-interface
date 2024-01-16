import { useParams } from 'next/navigation';
import { store } from 'store/store';
import { setNftInfo } from 'store/reducer/detail/detailInfo';
import { fetchNftInfo, fetchAuctionInfo } from 'api/fetch';
import { openModal } from 'store/reducer/errorModalInfo';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';

export const useDetail = () => {
  const [isCanBeBid, setIsCanBeBid] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { walletInfo } = useGetState();
  const account = walletInfo.address;
  const { id } = useParams();
  const { detailInfo } = useDetailGetState();
  const { pageRefreshCount } = detailInfo;
  const getDetail = async () => {
    setIsFetching(true);
    try {
      const result = await fetchNftInfo({
        id,
        address: account,
      });
      setIsFetching(false);
      if (!result) return store.dispatch(openModal());
      // document.body.scrollTop = 0;
      store.dispatch(setNftInfo({ ...result, file: result.file }));
      console.log('result', result);

      if (!result?.nftSymbol) return;
      fetchAuctionInfo({
        SeedSymbol: result.nftSymbol,
      })
        .then((res) => {
          const flag = !!res && Object.keys(res).length > 0;
          setIsCanBeBid(flag);
        })
        .catch(() => {
          setIsCanBeBid(false);
        });
      return true;
    } catch (error) {
      setIsFetching(false);
      store.dispatch(setNftInfo(null));
      return store.dispatch(openModal());
    }
  };

  useEffect(() => {
    store.dispatch(setNftInfo(null));
    getDetail(true);
  }, [id, account]);

  useUpdateEffect(() => {
    getDetail(false);
  }, [pageRefreshCount]);

  const run = () => {
    getDetail();
  };

  return { isCanBeBid, run, isFetching };
};
