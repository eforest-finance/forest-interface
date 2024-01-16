import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { useMount } from 'react-use';
import { fetchSpecialSeeds } from 'api/fetch';
import { ISeedItemData } from 'api/types';
import { useResponsive } from 'hooks/useResponsive';
import { useJumpTSM } from 'hooks/useJumpTSM';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';

const TOKEN_TYPES = ['FT', 'NFT'];

export enum SEED_STATUS {
  AVAILABLE = 0,
  UNREGISTERED = 1,
  REGISTERED = 2,
  NOT_SUPPORT = 3,
}

const useRecommendSeedLogic = () => {
  // const router = useRouter();
  const [originData, setOriginData] = useState<ISeedItemData[]>([]);
  const [seedList, setSeedList] = useState<ISeedItemData[]>([]);
  const jumpTSM = useJumpTSM();
  const { isMD, isXL, isPcMin } = useResponsive();

  const { data, run } = useRequest(fetchSpecialSeeds, {
    pollingInterval: 4000,
    pollingErrorRetryCount: 3,
    loadingDelay: 300,
    pollingWhenHidden: false,
    manual: true,
  });

  useMount(() => {
    run({
      SeedTypes: [3],
      SkipCount: 0,
      MaxResultCount: 6,
    });
    // fetchSpecialSeeds({}).then((res) => {
    //   if (res.items?.length) {
    //     setOriginData(res.items);
    //   }
    // });

    // router.prefetch('/tsm');
  });
  useEffect(() => {
    setOriginData(data?.items || []);
  }, [data]);

  useEffect(() => {
    if (isMD) {
      setSeedList(originData.slice(0, 2));
      return;
    }
    if (!isMD && isXL) {
      setSeedList(originData.slice(0, 4));
      return;
    }
    if (!isXL) {
      setSeedList(originData);
    }
  }, [originData, isMD, isXL]);

  // useEffect(() => {
  //   seedList.forEach((item) => {
  //     router.prefetch(`/tsm/${TOKEN_TYPES[item.tokenType]}/${String(item.symbol).toUpperCase()}`);
  //   });
  // }, [seedList]);

  const goTsm = () => {
    jumpTSM('/');
  };
  const gotTsmSeedDetail = (tokenType: number, symbol: string) => {
    jumpTSM(`/${TOKEN_TYPES[tokenType]}/${String(symbol).toUpperCase()}`);
  };

  return {
    seedList,
    goTsm,
    gotTsmSeedDetail,
  };
};

function fixedPrice(price: number, decimalsFix = 4) {
  const decimals = String(price).split('.')[1];
  if (decimals && decimals.length > decimalsFix) {
    const result = price.toFixed(decimalsFix);
    const stringResult = new BigNumber(result).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
    return new BigNumber(stringResult).toNumber();
  }
  return price;
}

export { useRecommendSeedLogic, fixedPrice };
