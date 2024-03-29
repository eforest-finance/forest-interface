import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ImgLoading from 'components/ImgLoading';
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
        centeredSlides={true}
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
        {swiperData.map((item) => {
          return (
            <SwiperSlide className={(isXS && '!w-[82%]') || ''} key={item.id}>
              <div className="relative">
                <Link href={`/explore-items/${item.id}`}>
                  <ImgLoading className="rounded-[12px]" src={item.imgUrl} />
                  <div className="absolute bottom-[16px] w-full px-[16px] text-[16px] font-semibold leading-[24px] text-white">
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
