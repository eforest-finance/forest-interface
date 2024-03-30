import { dispatch, store } from 'store/store';
import {
  setNftInfo,
  setNftTraitInfos,
  setUpdateDetailLoading,
  setNftRankingInfos,
} from 'store/reducer/detail/detailInfo';
import { fetchAuctionInfo, fetchNftRankingInfoApi, fetchNftTraitsInfo } from 'api/fetch';
import { openModal } from 'store/reducer/errorModalInfo';
import useGetState from 'store/state/getState';
import { useEffect, useState } from 'react';
import getNftInfo from '../utils/getNftInfo';
import { useMount } from 'react-use';
import { useRequest } from 'ahooks';
import useDetailGetState from 'store/state/detailGetState';
import { useWebLogin } from 'aelf-web-login';
import { addPrefixSuffix } from 'utils';
import { getParamsByTraitPairsDictionary } from 'utils/getTraitsForUI';

interface IProps {
  id: string;
}

export const useDetail = (params: IProps) => {
  const [isCanBeBid, setIsCanBeBid] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { id } = params;

  const { walletInfo } = useGetState();
  const getDetail = async () => {
    if (isFetching) return;
    setIsFetching(true);
    store.dispatch(setUpdateDetailLoading(true));
    try {
      const result = await getNftInfo({
        nftId: id,
        address: walletInfo.address,
      });
      store.dispatch(setUpdateDetailLoading(false));
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
      store.dispatch(setUpdateDetailLoading(false));
      return store.dispatch(openModal());
    }
  };

  useEffect(() => {
    store.dispatch(setNftInfo(null));
  }, [id]);

  useEffect(() => {
    getDetail();
  }, [id, walletInfo.address]);

  return { isCanBeBid, getDetail, isFetching };
};

export const useGetNftTraitInfo = ({ id }: IProps) => {
  const getNftTraitInfo = async () => {
    const result = await fetchNftTraitsInfo({
      id,
    });

    if (result) {
      store.dispatch(setNftTraitInfos(result));
    }
  };

  useMount(() => {
    getNftTraitInfo();
  });
};

export const useGetTraitRankingInfo = () => {
  const { detailInfo } = useDetailGetState();
  const { nftTraitInfos } = detailInfo;
  const { wallet } = useWebLogin();
  const { run, data } = useRequest(fetchNftRankingInfoApi, {
    manual: true,
  });

  useEffect(() => {
    if (!data?.length) return;
    dispatch(setNftRankingInfos(data[0]));
  }, [data]);

  useEffect(() => {
    const traitInfos = nftTraitInfos?.traitInfos;
    if (!traitInfos?.length) {
      return;
    }

    const params = getParamsByTraitPairsDictionary(traitInfos);

    run({ address: addPrefixSuffix(wallet.address), catsTraits: [params] });
  }, [nftTraitInfos?.traitInfos, wallet?.address]);
};
