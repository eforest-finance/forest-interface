import { useEffect, useState } from 'react';
import { message, Skeleton } from 'antd5/';

import Banner from './components/Banner';
import HotNFTs from './components/HotNFTs';
import Trending from './components/Trending';
import { RecommendSeeds } from './components/RecommendSeeds';
import ActionWrapper from './components/ActionWrapper';
import { fetchBanner, fetchHotNFTs } from 'api/fetch';
import { IBanner, IHotNFT } from 'api/types';

export default function Home() {
  const [bannerList, setBannerList] = useState<IBanner[]>();
  const [hotNFTs, setHotNfts] = useState<IHotNFT[]>();
  const [isFetchingHotNFTs, setIsFetchingHotNFTs] = useState(false);

  const getBannerList = async () => {
    try {
      const { itemList } = await fetchBanner();
      setBannerList(itemList);
    } catch (error) {
      console.error(error);
    }
  };

  const getHotNfts = async () => {
    setIsFetchingHotNFTs(true);
    try {
      const { items } = await fetchHotNFTs();
      setHotNfts(items);
    } catch (error) {
      console.error(error);
    }
    setIsFetchingHotNFTs(false);
  };

  useEffect(() => {
    getBannerList();
    getHotNfts();
  }, []);

  return (
    <div className="!min-h-[100vh] px-[16px] mdb:px-[32px] mdb:py-[48px] py-[32px] flex items-center flex-col	">
      <div className="max-w-[343px] mdl:max-w-[1360px] 2xl:max-w-[1840px]">
        {bannerList?.length ? (
          <Banner list={bannerList}></Banner>
        ) : (
          <Skeleton.Image className="!w-full !h-[473px] mdl:!h-[332px] 2xl:!h-[473px] !rounded-[12px]" active />
        )}
        {isFetchingHotNFTs ? (
          <>
            <div className="mt-[48px]">
              <h1 className="text-[24px] font-semibold leading-[32px] pb-[16px]">Hot NFTs </h1>
              <div className=" w-full box-border px-0 relative">
                <Skeleton.Image className="!w-full !h-[473px] mdl:!h-[332px] 2xl:!h-[473px] !rounded-[12px]" active />
              </div>
            </div>
          </>
        ) : (
          <> {hotNFTs && <HotNFTs hotNFTs={hotNFTs}></HotNFTs>}</>
        )}
        <Trending />
        <RecommendSeeds />
        <ActionWrapper />
      </div>
    </div>
  );
}
