import { Carousel, Image, Skeleton } from 'antd5/';
import styles from './styles.module.css';
import { IBanner, IBannerItem } from 'api/types';
import Link from 'next/link';
import useResponsive from 'hooks/useResponsive';
import { useEffect, useState } from 'react';

const Banner: React.FC<{ list: Array<IBanner> }> = (props: { list: Array<IBanner> }) => {
  const { list } = props;
  const { isXS } = useResponsive();
  const [dataList, setDataList] = useState<IBannerItem[]>();

  useEffect(() => {
    if (isXS) {
      setDataList(list.map((item) => item.h5));
    } else {
      setDataList(list.map((item) => item.pc));
    }
  }, [isXS, list]);

  if (!dataList?.length) {
    return null;
  }

  return (
    <div className="w-full rounded-[12px] overflow-hidden group">
      <Carousel className="w-full " effect="fade" autoplay autoplaySpeed={5000} dots={dataList.length > 1}>
        {dataList.map((item: IBannerItem, index: number) => (
          <div key={`banner-${index}`} className={styles['carousel-item']}>
            <Link href={item.link}>
              <Image
                className="!w-[343px] mdl:!w-[1360px] 2xl:!w-[1840px] !h-[473px] mdl:!h-[332px] 2xl:!h-[473px]  object-cover rounded-[12px]  group-hover:scale-110 transition-all cursor-pointer"
                src={item.image}
                preview={false}
                placeholder={
                  <Skeleton.Image className="!w-full !h-[473px] mdl:!h-[332px] 2xl:!h-[473px] !rounded-[12px]" active />
                }
              />
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
export default Banner;
