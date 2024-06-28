import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ImageEnhance } from 'components/ImgLoading';
import useResponsive from 'hooks/useResponsive';
import LeftArrow from 'assets/images/swiper/arrow-left-swiper.svg';
import RrightArrow from 'assets/images/swiper/arrow-right-swiper.svg';
import styles from './style.module.css';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { CollectionHoldItem } from 'api/types';
import { Item } from 'pagesComponents/Collections/Hooks/useCollections';
import { useWindowSize } from 'react-use';

interface ISwiperProps {
  swiperData: Array<CollectionHoldItem | Item>;
}
export function CollectionListSwiper({ swiperData }: ISwiperProps) {
  const mySwiper = useRef<SwiperClass>();
  const [first, setFist] = useState<boolean>(true);
  const onSlideChange = useCallback((data: any) => {
    setFist(data.isBeginning);
    setLast(data.isEnd);
  }, []);
  const { isXS, isLG } = useResponsive();
  const { width } = useWindowSize();

  const getInitializedLast = () => {
    if (width < 1024) {
      return swiperData.length < 3;
    }
    if (width < 1332) {
      return swiperData.length < 4;
    }
    if (width < 1645) {
      return swiperData.length < 5;
    }
    if (width < 1920) {
      return swiperData.length < 6;
    }
    return false;
  };

  const [last, setLast] = useState<boolean>(getInitializedLast());

  return (
    <div className="relative">
      {!isXS && !first && (
        <div
          className={clsx(styles.arrow, styles.leftArrow)}
          onClick={() => {
            mySwiper.current?.slidePrev();
          }}>
          <LeftArrow />
        </div>
      )}

      <Swiper
        className="hhhhh"
        spaceBetween={8}
        centeredSlides={false}
        slidesPerGroupSkip={1}
        slidesPerGroup={1}
        onSlideChange={onSlideChange}
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
        onSwiper={(swiper) => {
          mySwiper.current = swiper;
        }}>
        {swiperData.map((item, idx) => {
          return (
            <SwiperSlide className={clsx(isXS ? '!w-40 !h-40' : '!w-[304px] !h-[304px]')} key={item.id}>
              <div className="relative">
                <Link href={`/explore-items/${item.id}`}>
                  <ImageEnhance
                    width={'100%'}
                    height={'100%'}
                    className=" w-full h-full aspect-square rounded-lg"
                    src={item.logoImage}
                  />
                  <div className="absolute bottom-[16px] w-full px-[16px] text-[16px] font-semibold leading-[24px] text-white line-clamp-1 break-all">
                    {item.tokenName}
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* {!isXS && !last && (
        <div
          className={clsx(styles.arrow, styles.rightArrow)}
          onClick={() => {
            mySwiper.current?.slideNext();
          }}>
          <RrightArrow />
        </div>
      )} */}
    </div>
  );
}
