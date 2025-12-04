import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ImageEnhance } from 'components/ImgLoading';
import useResponsive from 'hooks/useResponsive';
import LeftArrow from 'assets/images/swiper/arrow-left-swiper.svg';
import RrightArrow from 'assets/images/swiper/arrow-right-swiper.svg';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatTokenPrice } from 'utils/format';
import { IHotNFT } from 'api/types';
import HonourLabel from 'baseComponents/HonourLabel';
import { Tooltip } from 'antd';
import NumberOfChange from './NumberOfChange';
import { useSwiper } from 'swiper/react';
import { useWindowSize } from 'react-use';

interface IHotNFTsProps {
  items: IHotNFT[];
}

export default function CollectionLists({ items }: any) {
  const mySwiper = useRef<SwiperClass>();
  const swiper = useSwiper();

  const [first, setFist] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(true);

  const onSlideChange = useCallback((data: any) => {
    setFist(data.isBeginning);
    setLast(data.isEnd);
  }, []);
  const { isSM, isXS, isLG, is2XL, is4XL, is5XL } = useResponsive();
  const [maxResultCount, setMaxResultCount] = useState<Number>(0);

  console.log('last:', last, mySwiper);

  useEffect(() => {
    console.log('width', is2XL, is4XL, is5XL);
    if (is4XL) {
      setMaxResultCount(4);
    } else if (is5XL) {
      setMaxResultCount(4);
    }
  }, [is2XL, is4XL]);

  const getPrice = (item: IHotNFT) => {
    if (item.price > 0) {
      return [`${formatTokenPrice(item.price)} ELF`, 'Price'];
    }

    if (item.offerPrice > 0) {
      return [`${formatTokenPrice(item.offerPrice)} ELF`, 'Best Offer'];
    }

    return ['- -', 'Price'];
  };

  const CollectionItem = useCallback(({ item }: any) => {
    console.log('item', item);

    return (
      <Link className={styles.CollectionItem} href={`/explore-items/${item.id}`}>
        <div className={styles.CollectionItem_wrapper}>
          <div className="relative">
            <div className="overflow-hidden">
              <ImageEnhance
                width={'100%'}
                className="w-full aspect-square overflow-hidden relative group-hover:scale-110 transition-all"
                src={item.previewImage}
              />
              <div className={styles['poster-shadow']} />
            </div>

            <div className="absolute w-[64px] h-[64px] z-[2] -bottom-[32px] left-[16px] mdl:left-[24px] rounded-lg overflow-hidden">
              <ImageEnhance
                width={'100%'}
                className="w-full aspect-square overflow-hidden relative  transition-all"
                src={item.logoImage}
              />
            </div>
          </div>

          <div className="p-[16px] pt-[48px] mdl:px-[24px] mdl:pt-[40px] mdl:pb-[24px] group-hover:bg-black">
            <div className="font-semibold text-textPrimary text-[20px] mdl:text-[24px] leading-8">{item.tokenName}</div>
            <div className="flex justify-around my-[8px] h-[44px]">
              <span className="flex-1 w-[68px] text-textSecondary text-[14px] mdl:text-[14px] font-medium">Floor</span>

              <div className="flex flex-col items-end">
                <span className="flex items-center mb-[8px]">
                  <span className={'text-textPrimary text-[14px] mdl:text-[14px] font-semibold'}>
                    {(item.floorPrice || item.floorPrice === 0) && item.floorPrice >= 0
                      ? formatTokenPrice(item.floorPrice) + ' ' + (item.floorPriceSymbol || 'ELF')
                      : '-'}
                  </span>
                </span>
                <Tooltip showArrow={false} title="24h Floor price changes">
                  <div>
                    <NumberOfChange text={item.floorChange} />
                  </div>
                </Tooltip>
              </div>
            </div>

            <div className="flex justify-around h-[44px]">
              <span className="flex-1 w-[68px] text-textSecondary text-[14px] mdl:text-[14px] font-medium">
                30d Vol
              </span>
              <div className="flex flex-col items-end">
                <span className="flex items-center mb-[8px]">
                  <span className={'text-textPrimary text-[14px] mdl:text-[14px]  font-semibold'}>
                    {(item.volumeTotal || item.volumeTotal === 0) && item.volumeTotal >= 0
                      ? formatTokenPrice(item.volumeTotal) + ' ' + (item.floorPriceSymbol || 'ELF')
                      : '-'}
                  </span>
                </span>
                <NumberOfChange text={item.volumeTotalChange} />

                {/* <span>{renderNumberOfChange(item.volumeTotalChange)}</span> */}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }, []);

  return (
    <>
      <div className="w-full box-border relative">
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
              centeredSlides: true,
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
            1650: {
              slidesPerView: 4,
              spaceBetween: 20,
              slidesPerGroup: 4,
              slidesPerGroupSkip: 4,
              centeredSlides: false,
            },
          }}
          onSlideChange={onSlideChange}
          onResize={(swiper) => {
            setLast(swiper.isEnd);
          }}
          onSwiper={(swiper) => {
            mySwiper.current = swiper;
          }}>
          {items.map((item, idx) => {
            return (
              <SwiperSlide
                className={clsx(
                  `overflow-hidden whitespace-nowrap ${isSM && '!w-[240px]'}`,
                  isXS && idx === items.length - 1 ? 'mr-[16px]' : '',
                  '',
                )}
                key={item.id}>
                <div className="relative pt-[24px]">
                  <CollectionItem item={item} />
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
    </>
  );
}
