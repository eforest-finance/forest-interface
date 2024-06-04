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

interface IHotNFTsProps {
  hotNFTs: IHotNFT[];
}

export default function HotNFTs({ hotNFTs }: IHotNFTsProps) {
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

  return (
    <div className="mt-[48px]">
      <h1 className="text-[24px] font-semibold leading-[32px] pb-[16px] text-textPrimary">Hot NFTs </h1>
      <div className=" w-full box-border px-0 relative">
        {!isXS && !first && !(!isLG && hotNFTs.length === maxResultCount) && (
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
          {hotNFTs.map((item, idx) => {
            return (
              <SwiperSlide
                className={clsx(
                  isXS ? '!w-[240px]' : '!w-[325px] 2xl:!w-[352px] !mr-[20px]',
                  isXS && idx === hotNFTs.length - 1 ? 'mr-[16px]' : '',
                  '',
                )}
                key={item.id}>
                <div className="relative">
                  <Link href={`/detail/buy/${item.id}/${item.chainId}`}>
                    <div className="group w-[240px] mdl:w-[325px] 2xl:!w-[352px] rounded-lg overflow-hidden border-[1px]  border-solid border-[var(--line-border)]">
                      <div className="relative overflow-hidden">
                        <ImageEnhance
                          width={'100%'}
                          className=" w-full aspect-square overflow-hidden relative group-hover:scale-110 transition-all"
                          src={item.previewImage}
                        />
                        {item.describe && (
                          <div className="absolute top-[12px] right-[12px] ">
                            <HonourLabel text={item.describe} theme="white" />
                          </div>
                        )}

                        <div className="text-white w-full bg-fillMask1 h-[32px] absolute z-1 bottom-0 left-0 flex justify-center items-center">
                          {item.collectionName}
                        </div>
                        {item?.describe ? (
                          <div className="absolute top-3 right-3">
                            <HonourLabel text={item?.describe} />
                          </div>
                        ) : null}
                      </div>

                      <div className="p-[16px]">
                        <div className="flex justify-between text-base font-semibold text-textPrimary pb-[16px]">
                          <p>{item.nftName}</p>
                        </div>
                        <div className="flex justify-between text-[14px] text-textSecondary font-medium">
                          <p>Last sale</p>
                          <p>{formatTokenPrice(item.latestDealPrice)} ELF</p>
                        </div>
                        <div className="w-full h-[48px] bg-fillHoverBg flex justify-between items-center rounded-sm px-[8px] py-[12px] mt-[8px]">
                          <p className="text-textSecondary font-medium">Price</p>
                          <p className="text-base font-semibold text-textPrimary ">
                            {formatTokenPrice(item.offerPrice)} ELF
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
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
