import { Carousel, Image, Skeleton } from 'antd5/';
import Button from 'baseComponents/Button';
import styles from './styles.module.css';
import { IBanner, IBannerItem } from 'api/types';
import { useRef, useState } from 'react';

import NextImage from 'next/image';

import Mask from 'assets/images/v2/mask.png';

import { useRouter } from 'next/navigation';

const Banner: React.FC<{ list: Array<IBannerItem> }> = (props: { list: Array<IBannerItem> }) => {
  const { list = [] } = props;

  const sliderRef = useRef<any>(null);

  const nav = useRouter();

  const [current, setCurrent] = useState<number>(0);

  return (
    <div className="relative w-[100vw] h-[584px]  mdl:h-[720px]  overflow-hidden group">
      <Carousel
        ref={(slider) => {
          sliderRef.current = slider;
        }}
        className="w-full "
        effect="fade"
        autoplay
        autoplaySpeed={5000}
        afterChange={(current: number) => {
          setCurrent(current);
        }}
        dots={false}>
        {list.map((item, index: number) => (
          <div key={`list-${index}`} className="block w-[100vw] h-[584px] mdl:w-full mdl:h-full">
            {item.type === 'video' ? (
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <video
                  className="object-cover min-h-full min-w-full"
                  muted={true}
                  /* eslint-disable */
                  webkit-playsinline={true}
                  /* eslint-disable */
                  playsInline={true}
                  autoPlay
                  loop={true}>
                  <source src={item.src} />
                </video>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center overflow-hidden">
                <Image
                  wrapperClassName="mdl:w-full mdl:h-[720px] h-full"
                  className="object-cover !w-auto  mdl:!w-full !h-full transition-all cursor-pointer"
                  src={item.src}
                  preview={false}
                  placeholder={
                    <Skeleton.Image className="!w-full !h-[473px] mdl:w-full mdl:h-[720px]  !rounded-[12px]" active />
                  }
                />
              </div>
            )}

            <div className="w-full h-full absolute z-[19] bg-fillMask3 top-0 left-0" />

            <div className="absolute z-20 top-[218px] mdl:top-[16rem]  left-[16px] mdl:left-[40px]">
              <div className="text-[32px] mdl:text-[40px] font-semibold text-textWhite">{item.title}</div>
              <div className="max-w-[520px] mb-[32px] mdl:mb-[48px] mt-[16px] text-[14px] mdl:text-[16px] font-semibold text-textWhite">
                {item.description}
              </div>
              <Button
                onClick={() => {
                  if (item?.target === '_blank') {
                    window.open(item.link);
                  } else {
                    nav.push(item.link);
                  }
                }}
                className="border-0 z-20 w-[164px] h-[48px] mdl:w-[170px] mdl:h-[56px] rounded-lg bg-fillCardBg hover:bg-fillHoverBg text-textPrimary text-[16px]">
                {item.buttonTitle}
              </Button>
            </div>
          </div>
        ))}
      </Carousel>

      <NextImage className="absolute bottom-[-1px] w-full" src={Mask} alt="" />

      {list.length > 1 && (
        <div className="w-[100vw] mdl:w-auto flex mdl:block justify-around absolute z-10 bottom-[24px] mdl:bottom-[40px]  mdl:right-0   mdl:mr-[40px]">
          {list.map((item: IBannerItem, index: number) => (
            <div
              key={`view-list-${index}`}
              className={`${index === current ? styles.current : ''} relative inline-block`}>
              <Image
                onClick={() => {
                  sliderRef.current.goTo(index);
                }}
                wrapperClassName="w-[160px] mdl:w-[225px] h-[90px] mdl:h-[126px] mdl:ml-[24px] rounded-lg overflow-hidden"
                className="!w-[225px] !h-[126px] transition-all cursor-pointer"
                src={item.poster}
                preview={false}
                placeholder={
                  <Skeleton.Image className="!w-full !h-[473px] mdl:!h-[332px] 2xl:!h-[473px] !rounded-[12px]" active />
                }
              />
              <div className={styles['card-mask']} />
              <span className="absolute  bottom-[8px] mdl:bottom-[12px] left-[12px] mdl:left-[55px] text-[12px] mdl:text-[18px] font-semibold text-white">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Banner;
