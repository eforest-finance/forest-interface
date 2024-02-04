import { Swiper, SwiperClass, SwiperProps, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import ImgLoading from 'components/ImgLoading';
import useResponsive from 'hooks/useResponsive';
import LeftArrow from 'assets/images/swiper/arrow-left-swiper.svg';
import RrightArrow from 'assets/images/swiper/arrow-right-swiper.svg';
import styles from './style.module.css';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import { CountDown } from '../../../components/CountDown';
import { Autoplay, EffectFade } from 'swiper/modules';
import { IActionDetail } from 'api/types';
import moment from 'moment';
import Link from 'next/link';

interface ISwiperProps {
  swiperData: IActionDetail[];
}

const TimeWarning = ({ startTime, expireTime }: IActionDetail) => {
  const [, refresh] = useState(0);

  let title;
  let endTime;

  if (moment().isBefore(moment(startTime))) {
    title = 'Event starts in';
    endTime = startTime;
  } else if (moment().isSameOrAfter(moment(expireTime))) {
    title = 'Event ended';
    endTime = expireTime;
  } else {
    title = 'Event ends in';
    endTime = expireTime;
  }

  return <CountDown title={title} value={endTime} onEnd={() => refresh((prev) => prev + 1)} />;
};

export function ActivitySwiper({ swiperData }: ISwiperProps) {
  const mySwiper = useRef<SwiperClass>();
  const mySwiper2 = useRef<SwiperClass>();
  const [first, setFist] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(swiperData.length === 1);

  const timerRef = useRef<number | null | any>(null);

  const onSlideChange = useCallback((data: any) => {
    setFist(data.isBeginning);
    setLast(data.isEnd);
  }, []);
  const { isXS } = useResponsive();

  const stopAutoPlay = () => {
    mySwiper.current?.autoplay.stop();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      mySwiper.current?.autoplay.start();
      clearTimeout(timerRef.current);
    }, 30000);
  };

  const commonSwiperProps: SwiperProps = {
    spaceBetween: 16,
    slidesPerView: 'auto',
    centeredSlides: true,
    slidesPerGroupSkip: 1,
    autoplay: {
      delay: 5000,
    },
    speed: 1000,
  };

  if (!swiperData?.length) {
    return null;
  }

  return (
    <div className="relative -mx-5 sml:mx-0 sml:rounded-lg sml:border sml:border-solid sml:border-lineBorder">
      {!isXS && !first && !(swiperData.length === 1) && (
        <div
          className={clsx(styles.arrow, styles.leftArrow)}
          onClick={() => {
            mySwiper.current?.slidePrev();
            stopAutoPlay();
          }}>
          <LeftArrow />
        </div>
      )}

      <Swiper
        key={'activitySwiper'}
        {...commonSwiperProps}
        modules={[Autoplay]}
        breakpoints={{
          600: {
            slidesPerView: 1,
            spaceBetween: 16,
            slidesPerGroup: 1,
            centeredSlides: false,
          },
        }}
        onSlideChange={onSlideChange}
        onActiveIndexChange={(swiper) => {
          !isXS && mySwiper2.current?.slideTo?.(swiper.realIndex);
        }}
        onTouchEnd={() => {
          stopAutoPlay();
        }}
        onTouchCancel={() => {
          stopAutoPlay();
        }}
        onSwiper={(swiper) => {
          mySwiper.current = swiper;
        }}>
        {swiperData.map((item) => {
          return (
            <SwiperSlide
              className={clsx(isXS && styles['calcWidth'], isXS && 'border border-solid border-lineBorder rounded-lg')}
              key={item.dropId}>
              <div className="relative">
                <Link href={`/drops-detail/${item.dropId}`}>
                  <ImgLoading className="h-[300px]" src={item.bannerUrl || ''} />
                  <div className={isXS ? 'h-[136px] pl-6 pt-6 pb-8' : 'h-48'}>
                    {isXS ? <TimeWarning {...item} /> : null}
                  </div>
                  {isXS ? (
                    <div className="absolute left-0 bottom-[136px] w-full px-4 pb-6">
                      <span className="line-clamp-2 text-4xl text-white font-semibold">{item.dropName || ''}</span>
                    </div>
                  ) : null}
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {!isXS && !last && !(swiperData.length === 1) && (
        <div
          className={clsx(styles.arrow, styles.rightArrow)}
          onClick={() => {
            mySwiper.current?.slideNext();
            stopAutoPlay();
          }}>
          <RrightArrow />
        </div>
      )}

      {!isXS ? (
        <div className="absolute z-10 bottom-0 left-0 w-full flex h-48 p-8">
          <Swiper
            key={'activitySwiper02'}
            {...commonSwiperProps}
            effect={'fade'}
            modules={[EffectFade]}
            className={styles['user-disabled']}
            onSwiper={(swiper) => {
              mySwiper2.current = swiper;
            }}>
            {swiperData.map((item) => {
              return (
                <SwiperSlide key={item.dropId}>
                  <div className="flex bg-fillPageBg">
                    <div className="flex flex-col flex-1 mr-32">
                      <div className="text-4xl h-10 font-semibold text-textPrimary line-clamp-1">
                        {item.dropName || ''}
                      </div>
                      <p className="mt-4 h-[72px] text-textSecondary line-clamp-3 text-base font-medium">
                        {item.introduction || ''}
                      </p>
                    </div>
                    <TimeWarning {...item} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : null}
    </div>
  );
}
