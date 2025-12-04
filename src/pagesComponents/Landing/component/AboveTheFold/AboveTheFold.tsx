import { useRouter } from 'next/navigation';
import Image from 'next/image';

import forestNightBanner from 'assets/images/night/forestBanner.png';
import forestLightBanner from 'assets/images/light/forestBanner.png';

import styles from './AboveTheFold.module.css';
import { useTheme } from 'hooks/useTheme';

import BaseButton from 'baseComponents/Button';
import useResponsive from 'hooks/useResponsive';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function AboveTheFold() {
  const router = useRouter();

  const [theme] = useTheme();

  const { login } = useCheckLoginAndToken();

  const createAnNFT = () => {
    login({
      callBack: () => {
        router.push('/create-item');
      },
    });
  };

  const { width } = useResponsive();

  return (
    <div className={`${width < 1280 ? styles['marketplace-mobile'] : ''} ${styles['above-the-fold']}`}>
      <div className={`${styles['above-the-fold-content']}`}>
        <div className={`${styles['slogan-wrapper']}`}>
          <h3>The word for world is forest</h3>
          <p>
            Buy, sell, and discover exclusive digital items.
            <br />
            Embrace an art tour to Metaverse.
          </p>
          <div className="text-center mb-[56px] flex items-center justify-center xlTW:hidden">
            <Image
              className="w-[284px] h-[240px] mdTW:w-[547px] mdTW:h-[462px]"
              src={theme === 'dark' ? forestNightBanner : forestLightBanner}
              alt={'forestBanner'}
            />
          </div>
          <div className={styles['action-wrapper']}>
            <BaseButton type="primary" className="mr-[16px]" size="ultra" onClick={createAnNFT}>
              Create an Item
            </BaseButton>
            <BaseButton type="default" onClick={() => router.push('/collections')} size="ultra">
              Explore NFTs
            </BaseButton>
          </div>
        </div>
        <Image
          className="hidden xlTW:block"
          width={547}
          height={462}
          src={theme === 'dark' ? forestNightBanner : forestLightBanner}
          alt={'forestBanner'}
        />
      </div>
    </div>
  );
}
