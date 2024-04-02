import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ImgLoading, { ImageEnhance } from 'components/ImgLoading';
import useResponsive from 'hooks/useResponsive';
import LeftArrow from 'assets/images/swiper/arrow-left-swiper.svg';
import RrightArrow from 'assets/images/swiper/arrow-right-swiper.svg';
import styles from './style.module.css';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

export interface ISwiperData {
  id: string;
  symbol: string;
  tokenName: string;
  imgUrl: string;
}

interface ISwiperProps {
  swiperData: ISwiperData[];
}

export default function CollectionsSwiper({ swiperData }: ISwiperProps) {
  const mySwiper = useRef<SwiperClass>();
  const [first, setFist] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(swiperData.length > 4);
  const onSlideChange = useCallback((data: any) => {
    setFist(data.isBeginning);
    setLast(data.isEnd);
  }, []);
  const { isXS, isLG } = useResponsive();

  return (
    <div className="relative">
      {!isXS && !first && !(!isLG && swiperData.length === 4) && (
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
        wrapperClass={clsx(isXS && 'mx-4')}
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
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
            slidesPerGroup: 4,
            slidesPerGroupSkip: 0,
            centeredSlides: false,
          },
        }}
        onSlideChange={onSlideChange}
        onSwiper={(swiper) => {
          mySwiper.current = swiper;
        }}>
        {swiperData.map((item, idx) => {
          return (
            <SwiperSlide
              className={clsx(isXS ? '!w-40' : '', isXS && idx === swiperData.length - 1 ? 'mr-8' : '')}
              key={item.id}>
              <div className="relative">
                <Link href={`/explore-items/${item.id}`}>
                  {/* <ImgLoading className="rounded-[12px]" src={item.imgUrl} /> */}
                  <ImageEnhance
                    width={'100%'}
                    height={'100%'}
                    className=" w-full h-full aspect-square rounded-lg"
                    src={item.imgUrl}
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
      {!isXS && !last && !(!isLG && swiperData.length === 4) && (
        <div
          className={clsx(styles.arrow, styles.rightArrow)}
          onClick={() => {
            mySwiper.current?.slideNext();
          }}>
          <RrightArrow />
        </div>
      )}
    </div>
  );
}
