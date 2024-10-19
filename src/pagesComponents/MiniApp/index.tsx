import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import styles from './style.module.css';

import { useSelector } from 'react-redux';
import { getUserInfo } from 'store/reducer/userInfo';
import useTelegram from 'hooks/useTelegram';
import Grass from 'assets/images/miniApp/home/grass.png';
import OrangeBg from 'assets/images/miniApp/home/orangeBg.png';
import Orange from 'assets/images/miniApp/home/orange.svg';
import BoxBg from 'assets/images/miniApp/home/boxBg.png';
import BoxBg1 from 'assets/images/miniApp/home/box1Bg.png';
import Kettle from 'assets/images/miniApp/home/kettle.svg';
import KettleBig from 'assets/images/miniApp/home/kettleBig.svg';
import Book from 'assets/images/miniApp/home/book.svg';
import Wallet from 'assets/images/miniApp/home/wallet.svg';
import NFT from 'assets/images/miniApp/home/nft.svg';
import ELF from 'assets/images/miniApp/home/elf.svg';

const homeBg = {
  backgroundImage: `url(${Grass.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const orangeBg = {
  backgroundImage: `url(${OrangeBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const boxBg = {
  backgroundImage: `url(${BoxBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const boxBg1 = {
  backgroundImage: `url(${BoxBg1.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const text = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#6B4700',
};

const Home = () => {
  const { isInTelegram } = useTelegram();
  const userInfo = useSelector(getUserInfo);

  console.log('userInfo', userInfo);

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  console.log('isInTG----isInTG', isInTG);

  const router = useRouter();

  const goToRules = () => {
    router.push('/mini-app/rules');
  };
  return (
    <div className={styles['mini-app']} style={homeBg}>
      <div className="w-full text-center">
        <div className="flex items-center justify-between p-[16px]">
          <div className="w-[180px] h-[52px] flex items-center justify-between px-[12px] py-[6px]" style={orangeBg}>
            <Orange />
            <span>351,286</span>
          </div>
          <div className="w-[48px] h-[52px] flex items-center justify-center" style={boxBg}>
            <Kettle />
          </div>
          <div className="w-[48px] h-[52px] flex items-center justify-center" style={boxBg}>
            <Book />
          </div>
          <div className="w-[48px] h-[52px] flex items-center justify-center mt-[4px]" style={boxBg1}>
            <Wallet />
          </div>
        </div>
        <div
          className="[text-shadow:_0_2px_0px_#A16A19] -tracking-[4.48px] text-[28px] text-white leading-9 font-bold"
          style={text}>
          Welcome to Forest Water, harvest and wait for good luck
        </div>
        <div className="mt-[24px]">
          <KettleBig />
          <div
            className="[text-shadow:_0_2px_0px_#6B4700] -tracking-[3.84px] text-[24px] text-white leading-9 font-bold"
            style={text}>
            Tap to water
          </div>
        </div>
        <div className="w-[80%] flex items-center justify-between absolute bottom-[200px] left-[10%]">
          <Orange />
          <div className="mt-[50px]">
            <NFT />
          </div>
          <ELF />
        </div>
        {/* <button className="mt-10" onClick={goToRules}>
          rules1
        </button> */}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
