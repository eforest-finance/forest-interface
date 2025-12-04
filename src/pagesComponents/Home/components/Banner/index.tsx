import { Carousel, Image, Skeleton } from 'antd5/';
import Button from 'baseComponents/Button';
import styles from './styles.module.css';
import { IBanner, IBannerItem } from 'api/types';
import { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

import NextImage from 'next/image';

import Mask from 'assets/images/v2/mask.png';

import { useRouter } from 'next/navigation';

const Banner: React.FC<{ list: Array<IBannerItem> }> = (props: { list: Array<IBannerItem> }) => {
  const { list = [] } = props;

  const { isSmallScreen } = useSelector(selectInfo);

  const sliderRef = useRef<any>(null);

  const nav = useRouter();

  const [current, setCurrent] = useState<number>(0);

  const [index, setIndex] = useState(0);

  const [bgStyle, setBgStyle] = useState({ '--bgImage': `url(${list[0]?.src})` });

  useEffect(() => {
    const timer = setInterval(() => {
      if (index >= 2) {
        setIndex(0);
      } else {
        setIndex((v) => v + 1);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [index]);

  useEffect(() => {
    setBgStyle({
      '--bgImage': `url(${list[index]?.src})`,
    });
  }, [index, list]);

  if (isSmallScreen) {
    return (
      <div>
        <Carousel
          ref={(slider) => {
            sliderRef.current = slider;
          }}
          className="w-screen"
          effect="fade"
          autoplay
          autoplaySpeed={5000}
          afterChange={(current: number) => {
            setCurrent(current);
          }}
          dots={{ className: `${styles.dotsStyle}` }}>
          {list.map((item, key) => {
            return (
              <Image
                key={key}
                wrapperClassName="w-full h-[300px]"
                src={item?.src}
                preview={false}
                placeholder={<Skeleton.Image className="!w-full !h-[300px]" active />}
                alt=""
              />
            );
          })}
        </Carousel>

        <div className="px-[16px] py-[24px]">
          <div className="text-[32px] leading-tight font-semibold">{list[current]?.title}</div>
          <div className="text-[16px] leading-6 pt-[8px] text-textSecondary">{list[current]?.description}</div>
          <Button type="primary" className="mt-[24px] w-full" onClick={() => nav.push(list[current]?.link)}>
            {list[current]?.buttonTitle}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-[100vw] h-[496px] group overflow-hidden relative ${styles.bannerBox}`} style={bgStyle}>
      <div className="w-[1360px] mt-[160px] flex items-start justify-between absolute z-10 left-1/2 top-0 -translate-x-1/2 cursor-pointer">
        <div className="w-[448px]">
          <div className="text-[40px] text-white leading-tight font-semibold">{list[index]?.title}</div>
          <div className="text-[16px] text-white leading-6 pt-[10px] h-[60px]">{list[index]?.description}</div>
          <Button type="primary" className="mt-[40px]" onClick={() => nav.push(list[index]?.link)}>
            {list[index]?.buttonTitle}
          </Button>

          <div className="flex items-center gap-[8px] mt-[50px]">
            {list.map((_, key) => {
              return (
                <div
                  key={key}
                  className={`w-[48px] h-[4px] rounded-xl transition ${index == key ? 'bg-white' : 'bg-[#D6D6D6]'}`}
                  onClick={() => setIndex(key)}></div>
              );
            })}

            {/* <div
              className={`w-[48px] h-[4px] rounded-xl transition ${index == 2 ? 'bg-white' : 'bg-[#D6D6D6]'}`}
              onClick={() => setIndex(2)}></div>
            <div
              className={`w-[48px] h-[4px] rounded-xl transition ${index == 3 ? 'bg-white' : 'bg-[#D6D6D6]'}`}
              onClick={() => setIndex(3)}></div> */}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[8px] -mr-[8px]">
            {list.map((item, key) => {
              return (
                <div
                  key={key}
                  onClick={() => setIndex(key)}
                  className={`w-[256px] h-[256px] ${index == key ? styles.borderActiveStyle : styles.borderStyle}`}>
                  <Image
                    wrapperClassName="w-[256px] h-[256px]"
                    src={item.src}
                    preview={false}
                    placeholder={<Skeleton.Image className="!w-[256px] !h-[256px] !rounded-[26px]" active />}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="relative w-[100vw] h-[496px]  mdl:h-[542px]  overflow-hidden group">
  //     <Carousel
  //       ref={(slider) => {
  //         sliderRef.current = slider;
  //       }}
  //       className="w-full "
  //       effect="fade"
  //       autoplay
  //       autoplaySpeed={5000}
  //       afterChange={(current: number) => {
  //         setCurrent(current);
  //       }}
  //       dots={false}>
  //       {list.map((item, index: number) => (
  //         <div key={`list-${index}`} className="block w-[100vw] h-[584px] mdl:w-full mdl:h-full">
  //           {item.type === 'video' ? (
  //             <div className="w-full h-full flex justify-center items-center overflow-hidden">
  //               <video
  //                 className="object-cover min-h-full min-w-full"
  //                 muted={true}
  //                 /* eslint-disable */
  //                 webkit-playsinline={true}
  //                 /* eslint-disable */
  //                 playsInline={true}
  //                 autoPlay
  //                 loop={true}>
  //                 <source src={item.src} />
  //               </video>
  //             </div>
  //           ) : (
  //             <div className="w-full h-full flex justify-center items-center overflow-hidden">
  //               <Image
  //                 wrapperClassName="mdl:w-full mdl:h-[542px] h-full"
  //                 className="object-cover !w-auto  mdl:!w-full !h-full transition-all cursor-pointer"
  //                 src={item.src}
  //                 preview={false}
  //                 placeholder={
  //                   <Skeleton.Image className="!w-full !h-[473px] mdl:w-full mdl:h-[542px]  !rounded-[12px]" active />
  //                 }
  //               />
  //             </div>
  //           )}

  //           <div className="w-full h-full absolute z-[19] bg-fillMask3 top-0 left-0" />

  //           <div className="w-full max-w-[1360px] absolute z-20 top-[80px] left-[50%] -translate-x-1/2">
  //             <div className="pl-[20px] pt-[180px] mdl:pt-[80px] mdl:pl-0">
  //               <div className="text-[32px] mdl:text-[40px] font-semibold text-textWhite">{item.title}</div>
  //               <div className="max-w-[520px] mb-[32px] mdl:mb-[48px] mt-[16px] text-[14px] mdl:text-[16px] font-semibold text-textWhite">
  //                 {item.description}
  //               </div>
  //               <Button
  //                 onClick={() => {
  //                   if (item?.target === '_blank') {
  //                     window.open(item.link);
  //                   } else {
  //                     nav.push(item.link);
  //                   }
  //                 }}
  //                 className="border-0 z-20 h-[48px] mdl:h-[56px] rounded-lg bg-fillCardBg hover:bg-fillHoverBg text-textPrimary text-[16px]">
  //                 {item.buttonTitle}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </Carousel>

  //     {/* <NextImage className="absolute bottom-[-1px] w-full h-[150px]" src={Mask} alt="" /> */}

  //     {list.length > 1 && (
  //       <div className="w-[100vw] mdl:w-auto flex mdl:block justify-around absolute z-10 bottom-[24px] mdl:bottom-[40px]  mdl:right-0   mdl:mr-[40px]">
  //         {list.map((item: IBannerItem, index: number) => (
  //           <div
  //             key={`view-list-${index}`}
  //             className={`${index === current ? styles.current : ''} relative inline-block`}>
  //             <Image
  //               onClick={() => {
  //                 sliderRef.current.goTo(index);
  //               }}
  //               wrapperClassName="w-[160px] mdl:w-[225px] h-[90px] mdl:h-[126px] mdl:ml-[24px] rounded-lg overflow-hidden"
  //               className="!w-[225px] !h-[126px] transition-all cursor-pointer"
  //               src={item.poster}
  //               preview={false}
  //               placeholder={
  //                 <Skeleton.Image className="!w-full !h-[473px] mdl:!h-[332px] 2xl:!h-[473px] !rounded-[12px]" active />
  //               }
  //             />
  //             <div className={styles['card-mask']} />
  //             <span className="absolute  bottom-[8px] mdl:bottom-[12px] left-[12px] mdl:left-[55px] text-[12px] mdl:text-[18px] font-semibold text-white">
  //               {item.name}
  //             </span>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );
};
export default Banner;
