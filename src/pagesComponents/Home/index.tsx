import { useEffect, useState } from 'react';
import { message, Skeleton, Button } from 'antd5/';

import Banner from './components/Banner';
import Trending from './components/Trending';
import { RecommendSeeds } from './components/RecommendSeeds';
// import ActionWrapper from './components/ActionWrapper';
import { fetchBanner, fetchTrendingCollections } from 'api/fetch';
import { IBanner, IBannerItem, IHotNFT, ITrendingCollectionsRes, TrendingCollectionItem } from 'api/types';
import useGetState from 'store/state/getState';
import styles from './styles.module.css';

import Text1024 from 'assets/images/v2/home_text_1024.png';
import Text768 from 'assets/images/v2/home_text_768.png';
import Text375 from 'assets/images/v2/home_text_375.png';

import HomeImage from 'assets/images/v2/home_image.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

export default function Home() {
  const { isSmallScreen } = useSelector(selectInfo);

  const { walletInfo } = useGetState();

  const [bannerList, setBannerList] = useState<IBannerItem[]>([]);
  const [collections, setCollections] = useState<TrendingCollectionItem[]>([]);
  const [isFetchingHotNFTs, setIsFetchingHotNFTs] = useState(false);
  const nav = useRouter();

  const getBannerList = async () => {
    try {
      const { data } = await fetchBanner();
      console.log('list:', data);

      setBannerList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getHotNfts = async () => {
    setIsFetchingHotNFTs(true);
    try {
      const { items } = await fetchTrendingCollections();
      setCollections(items);
    } catch (error) {
      console.error(error);
    }
    // setIsFetchingHotNFTs(false);
  };

  useEffect(() => {
    getBannerList();
  }, []);

  useEffect(() => {
    getHotNfts();
  }, [walletInfo]);

  return (
    <div className="!min-h-[100vh] flex items-center flex-col	">
      <div className="">
        <Banner list={bannerList}></Banner>
        <Trending items={collections} />
        <RecommendSeeds />
        <div
          className={`${styles['wrapper-width']} mt-[48px] mdl:mt-[64px] mb-[64px] py-[32px] px-[32px] mdl:py-[48px] ml-[24px] mdl:ml-[40px] h-[751px] mdl:h-[416px] bg-[#ECF6FF] rounded-lg flex flex-col mdl:flex-row  justify-around`}>
          <div className="flex flex-col">
            <Image
              className="w-[295px] h-auto mdl:w-[422px] mdl:h-[112px]"
              src={isSmallScreen ? Text375 : Text1024}
              alt=""></Image>
            <span className="mt-[16px] mdl:w-[552px]  mc:w-[820px] text-textSecondary text-[16px] mdl:text-[18px] font-medium line-[24px]">
              Al-driven creative generation. Random prompts, instant associations, preset styles, quickly build your own
              NFT.
            </span>
            <Button
              className="mt-[32px]  mdl:mt-[48px] text-[16px] font-medium text-white !rounded-lg  w-[164px] h-[48px] mdl:w-[178px]  mdl:h-[56px] bg-brandNormal"
              onClick={() => {
                nav.push('/create-nft-ai');
              }}>
              Create
            </Button>
          </div>
          <div className="w-[295px] h-[295px] mdl:w-[320px] mdl:h-[320px]">
            <Image className="w-full h-full" src={HomeImage} alt=""></Image>
          </div>
        </div>
      </div>
    </div>
  );
}
