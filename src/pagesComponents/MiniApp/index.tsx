import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import styles from './style.module.css';
import Image from 'next/image';

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
import Lock from 'assets/images/miniApp/home/lock.svg';
import TimeBg from 'assets/images/miniApp/home/timeBg.png';

import Tree from 'assets/images/miniApp/home/tree/Tree_10.png';

import OrangeBig from 'assets/images/miniApp/home/orangeBig.png';
import Up from 'assets/images/miniApp/home/up.svg';
import Close from 'assets/images/miniApp/home/close.svg';
import CloseActive from 'assets/images/miniApp/home/closeActive.svg';

import KettleSm from 'assets/images/miniApp/home/kettleSm.svg';

import ModelBg from 'assets/images/miniApp/home/modelBg.png';

import ProgressBg from 'assets/images/miniApp/home/progressBg.png';

import LevelUp from 'assets/images/miniApp/home/levelUp.svg';

import BtnBg from 'assets/images/miniApp/home/btnBg.png';

import OrangSm from 'assets/images/miniApp/home/orangeSm.svg';

import UpIcon from 'assets/images/miniApp/home/upIcon.svg';

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

const orangeBig = {
  width: '60px',
  height: '60px',
  backgroundImage: `url(${OrangeBig.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const timeBg = {
  backgroundImage: `url(${TimeBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  height: '12px',
};
const modelBg = {
  backgroundImage: `url(${ModelBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const progressBg = {
  backgroundImage: `url(${ProgressBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const btnBg = {
  backgroundImage: `url(${BtnBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
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

  const [model, setModel] = useState(false);

  return (
    <div className={styles['mini-app']} style={homeBg}>
      <div className="w-full text-center">
        <div className="flex items-center justify-between p-[16px]">
          <div className="w-[180px] h-[52px] flex items-center justify-between px-[12px] py-[6px]" style={orangeBg}>
            <Orange />
            <span className="-tracking-[2px] text-[16px] text-white font-bold" style={text}>
              351,286
            </span>
          </div>
          <div className="w-[48px] h-[52px] flex items-center justify-center" style={boxBg}>
            <Kettle />
          </div>
          <div className="w-[48px] h-[52px] flex items-center justify-center" style={boxBg} onClick={goToRules}>
            <Book />
          </div>
          <div className="w-[48px] h-[52px] flex items-center justify-center mt-[4px]" style={boxBg1}>
            <Wallet />
          </div>
        </div>
        {/* <div
          className="[text-shadow:_0_2px_0px_#A16A19] -tracking-[4.48px] text-[28px] text-white leading-9 font-bold"
          style={text}>
          Welcome to Forest Water, harvest and wait for good luck
        </div> */}
        <div className="w-3/4 m-auto flex items-center justify-between">
          <div className="mt-[60px] relative" style={orangeBig}>
            <div className="-tracking-[2px] text-[24px] text-white font-bold pt-[20px]" style={text}>
              0.00
            </div>
            <div className="flex items-center absolute bottom-0">
              <Lock />
              <div className="text-[10px] px-[6px] py-[1px] !font-smithesyzer text-[#4A310B]" style={timeBg}>
                11:59:59
              </div>
            </div>
          </div>
          <div style={orangeBig}>
            <div className="-tracking-[2px] text-[24px] text-white font-bold pt-[24px]" style={text}>
              36
            </div>
          </div>
          <div className="mt-[60px] relative" style={orangeBig}>
            <div className="-tracking-[2px] text-[24px] text-white font-bold pt-[20px]" style={text}>
              5
            </div>
            <div className="flex items-center absolute bottom-0">
              <Lock />
              <div
                className="text-[10px] px-[2px] py-[1px] !font-smithesyzer text-[#4A310B] -tracking-[1px]"
                style={timeBg}>
                INVITATION
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* <div className="mt-[24px] absolute top-0 left-1/2 transform -translate-x-1/2">
            <KettleBig />
            <div
              className="[text-shadow:_0_2px_0px_#6B4700] -tracking-[3.84px] text-[24px] text-white leading-9 font-bold"
              style={text}>
              Tap to water
            </div>
          </div> */}
          <div className="absolute right-[20px] top-[30px]" onClick={() => setModel(true)}>
            <Up />
          </div>
          <Image src={Tree} width={400} height={400} alt={'321321'} />
        </div>
        <div className="w-[80%] flex items-center justify-between absolute bottom-[200px] left-[10%]">
          <Orange />
          <div className="mt-[50px]">
            <NFT />
          </div>
          <ELF />
        </div>
      </div>
      {model && (
        <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center">
          <div
            className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
            style={modelBg}>
            <div className="absolute right-[16px] top-[16px]" onClick={() => setModel(false)}>
              {/* <Close /> */}
              <CloseActive />
            </div>
            {/* <div>On-chain confirmation in progress…</div> */}
            <div>
              {/* <div className="flex items-center justify-center">
                <Orange />
                <span className="text-white pl-[10px] text-[20px] -tracking-[3.2px]" style={text}>
                  x 36
                </span>
              </div>
              <div className="my-[16px] text-[#E0373E]">Claim failed!</div>
              <div className="text-[12px] text-[#5C489D]">
                <span>ELF_2qJH...GGBB_tDVV</span>
                <span>
                  ELF_2qJH...GGBB_tDVV has insufficient ELF balance, not enough to cover the gas fee. Please use
                  ETransfer to top up ELF.
                </span>
              </div> */}
              {/* <div className="text-white text-[24px] leading-10 -tracking-[3px]" style={text}>
                kettle
              </div>
              <div className="my-[16px]">
                <Kettle />
              </div>
              <div className="w-[200px] h-[20px] m-auto p-[2px] relative" style={progressBg}>
                <div className="bg-[#FFB933] w-[150px] h-full rounded"></div>
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[16px]"
                  style={text}>
                  <span>48</span>
                  <span>/</span>
                  <span>60</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-[10px] text-[14px] py-[8px]">
                <span>09:59</span>
                <span className="flex items-center gap-[4px]">
                  <KettleSm />
                  <span>+1</span>
                </span>
              </div>
              <div className="my-[16px] text-[14px]">
                The kettle restores it’s watering function once every 10 minutes.
              </div> */}
              <div className="text-white text-[24px] leading-10 -tracking-[3px]" style={text}>
                Level up
              </div>
              <div>
                <LevelUp />
              </div>
              <div
                className="text-white text-[16px] leading-[20px] my-[4px] flex items-center justify-center gap-[4px]"
                style={text}>
                <UpIcon />
                <span>Level 2</span>
              </div>
              <div className="text-[12px] flex items-center justify-center gap-[2px]">
                <span>24H</span>
                <span>+12</span>
                <OrangSm width={12} height={12} />
              </div>
              <div className="text-[14px] mt-[16px]">Consume golden fruits to obtain a higher-level tree</div>
              <div className="w-[160px] h-[40px] flex items-center justify-center m-auto my-[24px]" style={btnBg}>
                <span className="text-white" style={text}>
                  PAY 300
                </span>
                <OrangSm width={16} height={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
