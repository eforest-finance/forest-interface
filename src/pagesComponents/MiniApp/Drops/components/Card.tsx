import Image from 'next/image';
import PressContainer from 'assets/images/v2/CardContainerPressed_2x.png';
import Orange from 'assets/images/v2/orange.svg';
import { useEffect, useState } from 'react';
import { ImageEnhance } from 'components/ImgLoading';
import { useRouter } from 'next/navigation';

import { useStatus, useShowStartTime } from '../hooks/useGetStatus';

import styles from './styles.module.css';
import B_L from 'assets/images/v2/bgi_b_L_2x.png';
import B_R from 'assets/images/v2/bgi_b_R_2x.png';
import G_L from 'assets/images/v2/bgi_g_L_2x.png';
import G_R from 'assets/images/v2/bgi_g_R_2x.png';
import P_L from 'assets/images/v2/bgi_p_L_2x.png';
import P_R from 'assets/images/v2/bgi_p_R_2x.png';
import Y_L from 'assets/images/v2/bgi_y_L_2x.png';
import Y_R from 'assets/images/v2/bgi_y_R_2x.png';
import moment from 'moment';
import { getType } from '../Detail';

export const Tag = ({ type, title }: { type: string; title: string }) => {
  const source = {
    Blue: {
      bg: '#66b7ef',
      leftImage: B_L,
      rightImage: B_R,
    },
    Green: {
      bg: '#65D4A1',
      leftImage: G_L,
      rightImage: G_R,
    },
    Yellow: {
      bg: '#FFC554',
      leftImage: Y_L,
      rightImage: Y_R,
    },
    Pink: {
      bg: '#CCC6E1',
      leftImage: P_L,
      rightImage: P_R,
    },
  };

  return (
    <div className="flex items-center h-[16px]">
      <Image height={16} src={source[type].leftImage} alt="" />
      <span
        className={`flex items-center h-full text-white text-[10px] font-bold !font-chillPixels `}
        style={{
          background: source[type].bg,
        }}>
        {title}
      </span>
      <Image height={16} src={source[type].rightImage} alt="" />
    </div>
  );
};

export const getTagInfo = (status: number, showStartTime: any, noText?: Boolean) => {
  let type = '';
  let title = '';

  switch (status) {
    case 0:
      type = 'Blue';
      title = 'No Start';
      break;
    case 1:
      type = 'Yellow';
      title = `${showStartTime.days}D ${showStartTime.hours}H ${showStartTime.minutes}M ${noText ? '' : 'To Start'}`;
      break;
    case 2:
      type = 'Green';
      title = 'Ongoing';
      break;
    case 3:
      type = 'Pink';
      title = 'Ended';
      break;
    default:
      type = '';
      title = '';
  }
  return { type, title };
};

const Card = (props: { item: any }) => {
  const { item } = props;
  const [clicked, setClicked] = useState(false);
  const router = useRouter();
  // 0、no start
  // 1、show start time
  // 2、ongoing
  // 3、ended
  const activityStatus = useStatus(item);

  const showStartTime = useShowStartTime(item);

  return (
    <div className="relative flex items-center justify-center">
      <Image className="w-11/12 h-[274px] absolute " src={PressContainer} alt="" />

      <div
        className={`${styles.mask} ${styles.card} w-11/12 h-[274px] relative transition-all ${
          clicked ? 'p-[5px]' : 'p-0'
        }`}
        onClick={() => {
          setClicked(true);
          setTimeout(() => {
            setClicked(false);
            router.push(`/mini-app/drops/detail/${item.id}`);
          }, 500);
        }}>
        <div className={`w-full !h-[160px] relative`}>
          <ImageEnhance
            alt=""
            width="100%"
            className={`w-full !h-[160px] aspect-square object-cover`}
            src={item.imageUrl}
          />
        </div>
        <div className="p-[12px]">
          <span className="flex justify-between items-center">
            <p className={styles.title}>{item?.activityName}</p>
            <Tag
              type={getTagInfo(activityStatus, showStartTime).type}
              title={getTagInfo(activityStatus, showStartTime).title}
            />
          </span>

          <span className="mt-[8px] flex justify-between">
            <p className={`${styles.reward} !font-chillPixels`}>Reward</p>
            <span className={`${styles.content} !font-chillPixels`}>
              {item?.totalReward} {getType(item?.rewardType)}
            </span>
          </span>
          <span className="flex justify-between pt-[4px]">
            <p className={`${styles.reward} !font-chillPixels`}>Eligibility</p>
            <span className={`${styles.content} !font-chillPixels`}>
              Holding {'>'} {item?.minPoints.toLocaleString('en-US')} <Orange className="ml-[4px]" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
