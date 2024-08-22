import { useCallback, useEffect, useState } from 'react';
import { message, Skeleton, Button } from 'antd5/';

import Banner from './components/Banner';
import Trending from './components/Trending';
import { RecommendSeeds } from './components/RecommendSeeds';
import { fetchBanner, fetchTrendingCollections } from 'api/fetch';
import { IBanner, IBannerItem, IHotNFT, ITrendingCollectionsRes, TrendingCollectionItem } from 'api/types';
import useGetState from 'store/state/getState';
import styles from './styles.module.css';

import useResponsive from 'hooks/useResponsive';

import Text1024 from 'assets/images/v2/home_text_1024+.png';
import Text1441 from 'assets/images/v2/home_text_1441+.png';
import Text375 from 'assets/images/v2/home_text_x+.png';

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

  const { isLG, isMD, is2XL } = useResponsive();

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

  const getAIImageSource = () => {
    if (!is2XL) {
      return Text1441;
    }

    if (!isLG) {
      return Text1024;
    }
    return Text375;
  };

  return (
    <div className={`!min-h-[100vh] flex flex-col items-center ${isMD && 'items-center'} `}>
      <Banner list={bannerList}></Banner>
      <div className="max-w-[1888px] px-[16px]  mdl:px-[24px] w-full">
        <Trending items={collections} />
        <RecommendSeeds />
        <div
          className={`${styles['wrapper-width']}  mdb:mt-[64px] mb-[64px] py-[32px] px-[24px] mdb:py-[48px] h-[751px] mdb:h-[416px] bg-[#ECF6FF] rounded-lg flex flex-col mdb:flex-row  justify-around items-center`}>
          <div className="flex flex-col">
            <Image
              className="w-[254px] h-auto mc:w-[614px] mc:h-[112px] mdl:w-[338px] mdl:h-[152px] mdb:w-[254px] mdb:h-[128px]"
              src={getAIImageSource()}
              alt=""
            />
            <span className="mt-[16px] mdl:w-[464px] mdb:w-[254px] mc:w-[820px] w-[295px] text-textSecondary text-[16px] mdb:text-[18px] font-medium line-[24px]">
              Unlock breakthroughs in creation and creativity with Forest's AI-Empowered Generation Engine
            </span>
            <Button
              className="!border-0  hover:!bg-brandHover hover:!text-textWhite  mt-[32px]  mdb:mt-[48px] text-[16px] font-medium text-white !rounded-lg  w-[164px] h-[48px] mdb:w-[178px]  mdb:h-[56px] bg-brandNormal"
              onClick={() => {
                nav.push('/create-nft-ai');
              }}>
              Create
            </Button>
          </div>
          <div className="w-[295px] mdb:w-[320px] mdb:h-[295px]">
            <Image className="w-full h-full" src={HomeImage} alt=""></Image>
          </div>
        </div>
      </div>
    </div>
  );
}
