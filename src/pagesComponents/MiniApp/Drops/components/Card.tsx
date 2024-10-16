import Image from 'next/image';
import PressContainer from 'assets/images/v2/CardContainerPressed_2x.png';
import Orange from 'assets/images/v2/orange.svg';
import { useEffect, useState } from 'react';
import { ImageEnhance } from 'components/ImgLoading';

import styles from './styles.module.css';
import B_L from 'assets/images/v2/bgi_b_L_2x.png';
import B_R from 'assets/images/v2/bgi_b_R_2x.png';
import G_L from 'assets/images/v2/bgi_g_L_2x.png';
import G_R from 'assets/images/v2/bgi_g_R_2x.png';
import P_L from 'assets/images/v2/bgi_p_L_2x.png';
import P_R from 'assets/images/v2/bgi_p_R_2x.png';
import Y_L from 'assets/images/v2/bgi_y_L_2x.png';
import Y_R from 'assets/images/v2/bgi_y_R_2x.png';

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
        className={`flex items-center h-full text-white text-[10px] font-bold  font-pixels `}
        style={{
          background: source[type].bg,
        }}>
        {title}
      </span>
      <Image height={16} src={source[type].rightImage} alt="" />
    </div>
  );
};

const Card = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      {clicked && <Image className="w-[368px] h-[274px] absolute " src={PressContainer} alt=""></Image>}

      <div
        className={`${styles.mask} ${styles.card} relative`}
        onClick={() => {
          setClicked(true);
          setTimeout(() => {
            setClicked(false);
          }, 500);
        }}>
        <div className="w-full relative">
          <ImageEnhance
            alt=""
            width="100%"
            className="w-full !h-[160px] aspect-square object-cover"
            src="https://schrodinger-testnet.s3.amazonaws.com/watermarkimage/Qmcn8MouVw7NNZ2HARm4mQaWpWDAx2pdsn2WjSCUL1ja1i"
          />
        </div>
        <div className="p-[12px]">
          <span className="mt-[12px] flex justify-between items-center">
            <p className={styles.title}>SGR GIVEAWAY</p>
            <Tag type="Green" title="12D 24H 12M To Start" />
          </span>

          <span className="mt-[8px] flex justify-between">
            <p className={styles.reward}>Reward</p>
            <span className={styles.content}>1000 ELF</span>
          </span>
          <span className="flex justify-between">
            <p className={styles.reward}>Eligibility</p>
            <span className={styles.content}>
              Holding {'>'} 1,000 <Orange className="ml-[4px]" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
