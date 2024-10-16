import baseStyles from '../../style.module.css';
import styles from './styles.module.css';
import Orange from 'assets/images/v2/orange.svg';
import Check from 'assets/images/v2/i_check.svg';

import { Tag } from '../components/Card';
import { ImageEnhance } from 'components/ImgLoading/ImgLoadingEnhance';
import Top from 'assets/images/v2/Cloud_Top2_3x.png';
import Image from 'next/image';
import DetailFooter from './DetailFooter';

const DropsDetail = () => {
  return (
    <div className="h-screen">
      <div className={`px-[16px] pt-[16px] relative z-0  bg-[#AFADF8] ${baseStyles['mini-app']} ${styles.main}`}>
        <div className={` ${styles.card} relative`}>
          <div className={`${styles.mask}`}>
            <div className="w-full relative">
              <ImageEnhance
                alt=""
                width="100%"
                className="w-full !h-full aspect-square object-cover"
                src="https://schrodinger-testnet.s3.amazonaws.com/watermarkimage/Qmcn8MouVw7NNZ2HARm4mQaWpWDAx2pdsn2WjSCUL1ja1i"
              />
            </div>
          </div>
          <h1 className={styles.title}>SGR Giveaway</h1>
          <div className="mt-[8px]">
            <Tag type="Green" title="ongoing" />
          </div>
          <div className="mt-[8px] text-[#5C489D] text-[14px] font-bold">
            The SGR token was part of the Sögur project, which aimed to create a global digital currency.
          </div>
          <div className={`${styles.cardMask}`}>
            <div className={styles.cardTitle}>Reward</div>
            <div className="mt-[12px] text-[32px] text-[#5C489D] font-bold font-pixels">1,000 ELF</div>
            <div className="text-[14px] text-[#8172B4] font-bold font-pixels">$128.47</div>
            <div className="mt-[12px] text-[14px] text-[#5C489D] font-bold font-pixels">Remaining Amount</div>
            <div className={styles.progress}>
              <div className={styles.percent}>
                <span>800/100</span>
              </div>

              <div className={styles.progressInner}>
                <div className="bg-[#FFB933] h-full w-[100px]"></div>
              </div>
            </div>
          </div>

          <div className={`${styles.cardMask} mt-[16px] mb-[48px]`}>
            <div className={styles.cardTitle}>Eligibility</div>
            <div className="mt-[12px] text-[14px] font-bold text-[#5C489D] flex items-center">
              Holding More Than 1,000 <Orange className="ml-[4px]" />
            </div>
            <div className={styles.tips}>
              <div className="flex items-center pt-[16px] ml-[16px]">
                <Check className="mr-[8px]" /> You qualify
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 -z-10 w-full h-fit bg-[#C8C6FA]">
          <Image alt="" className="w-full h-auto" src={Top} />
        </div>
      </div>
      <div className="w-full h-[95px] bg-[#F2F0F7] flex items-center justify-center ">
        <div className={styles.button}>
          <span className={styles.buttonText}>Claim</span>
        </div>
      </div>
    </div>
  );
};

export default DropsDetail;
