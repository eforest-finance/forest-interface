import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ImageEnhance } from 'components/ImgLoading';
import useResponsive from 'hooks/useResponsive';
import LeftArrow from 'assets/images/swiper/arrow-left-swiper.svg';
import RrightArrow from 'assets/images/swiper/arrow-right-swiper.svg';
import styles from './SeedsMobile.module.css';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatTokenPrice } from 'utils/format';
import { IHotNFT } from 'api/types';
import HonourLabel from 'baseComponents/HonourLabel';
import { Tooltip } from 'antd';
import { useRecommendSeedLogic } from './useRecommendSeedLogic';
import SeedItemCard from './SeedItemCard';

interface IHotNFTsProps {
  items: IHotNFT[];
}

export default function CollectionLists({ items }: any) {
  const { goTsm, gotTsmSeedDetail } = useRecommendSeedLogic();

  const mySwiper = useRef<SwiperClass>();
  const [first, setFist] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);

  const onSlideChange = useCallback((data: any) => {
    setFist(data.isBeginning);
    setLast(data.isEnd);
  }, []);
  const { isXS, isLG, is2XL, is4XL, is5XL } = useResponsive();
  const [maxResultCount, setMaxResultCount] = useState<Number>(0);

  useEffect(() => {
    console.log('width', is2XL, is4XL, is5XL);
    if (is4XL) {
      setMaxResultCount(4);
    } else if (is5XL) {
      setMaxResultCount(4);
    }
  }, [is2XL, is4XL]);

  console.log('items:', items);

  const getPrice = (item: IHotNFT) => {
    if (item.price > 0) {
      return [`${formatTokenPrice(item.price)} ELF`, 'Price'];
    }

    if (item.offerPrice > 0) {
      return [`${formatTokenPrice(item.offerPrice)} ELF`, 'Best Offer'];
    }

    return ['- -', 'Price'];
  };

  return (
    <div className="mt-[16px]">
      <div className=" w-full box-border px-0 relative">
        {!isXS && !first && !(!isLG && items.length === maxResultCount) && (
          <div
            className={clsx(styles.arrow, styles.leftArrow)}
            onClick={() => {
              mySwiper.current?.slidePrev();
            }}>
            <LeftArrow />
          </div>
        )}

        <Swiper
          spaceBetween={8}
          slidesPerView={'auto'}
          centeredSlides={false}
          slidesPerGroupSkip={1}
          breakpoints={{
            600: {
              slidesPerView: 2,
              spaceBetween: 16,
              slidesPerGroup: 1,
              centeredSlides: false,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
              slidesPerGroup: 1,
              centeredSlides: false,
            },
            1440: {
              slidesPerView: 4,
              spaceBetween: 20,
              slidesPerGroup: 4,
              slidesPerGroupSkip: 4,
              centeredSlides: false,
            },
            1920: {
              slidesPerView: 5,
              spaceBetween: 20,
              slidesPerGroup: 5,
              slidesPerGroupSkip: 5,
              centeredSlides: false,
            },
          }}
          onSlideChange={onSlideChange}
          onSwiper={(swiper) => {
            mySwiper.current = swiper;
          }}>
          {items.map((item, idx) => {
            return (
              <SwiperSlide
                className={clsx(
                  isXS ? '!w-[240px]' : '!w-[325px] 2xl:!w-[352px] !mr-[16px]',
                  isXS && idx === items.length - 1 ? 'mr-[16px]' : '',
                  '',
                )}
                key={item.id}>
                <div className="relative">
                  <SeedItemCard
                    key={item.seedName}
                    seedItemData={item}
                    itemClick={() => {
                      gotTsmSeedDetail(item.tokenType, item.symbol);
                    }}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {!isXS && !last && (
          <div
            className={clsx(styles.arrow, styles.rightArrow)}
            onClick={() => {
              mySwiper.current?.slideNext();
            }}>
            <RrightArrow />
          </div>
        )}
      </div>
    </div>
  );
}
