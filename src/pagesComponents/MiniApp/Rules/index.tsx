import styles from '../style.module.css';
import Title from 'assets/images/miniApp/rules/rulesTitle.svg';
import Tree from 'assets/images/miniApp/rules/tree.svg';
import Airplane from 'assets/images/miniApp/rules/airplane.svg';
import X from 'assets/images/miniApp/rules/x.svg';

import Back from 'assets/images/miniApp/home/back.svg';
import BackActive from 'assets/images/miniApp/home/backActive.svg';

import Title1 from 'assets/images/miniApp/rules/title1.svg';
import Title2 from 'assets/images/miniApp/rules/title2.svg';
import Title3 from 'assets/images/miniApp/rules/title3.svg';
import Title4 from 'assets/images/miniApp/rules/title4.svg';

import BtnBg from 'assets/images/miniApp/rules/btnBg.png';
import SmallBg from 'assets/images/miniApp/rules/smallBg.png';

import Box from 'assets/images/miniApp/rules/box.png';
import BoxBg from 'assets/images/miniApp/rules/boxBgs.png';
import Cloud from 'assets/images/miniApp/rules/cloud.png';

import Level1 from 'assets/images/miniApp/rules/level1.svg';
import Level2 from 'assets/images/miniApp/rules/level2.svg';
import Level3 from 'assets/images/miniApp/rules/level3.svg';
import Level4 from 'assets/images/miniApp/rules/level4.svg';
import Level5 from 'assets/images/miniApp/rules/level5.svg';
import Level6 from 'assets/images/miniApp/rules/level6.svg';
import Orange from 'assets/images/miniApp/rules/orange.svg';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import useTelegram from 'hooks/useTelegram';
import { TelegramPlatform } from '@portkey/did-ui-react';

const cloudStyle = {
  backgroundImage: `url(${Cloud.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: '0 172px',
};

const btnStyle = {
  backgroundImage: `url(${BtnBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
};

const BoxStyle = {
  backgroundImage: `url(${Box.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px #A09DF7)',
};

const smBoxBgStyle = {
  backgroundImage: `url(${SmallBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px #A09DF7)',
};

const SmallBoxStyle = {
  backgroundImage: `url(${BoxBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px #D6D1E7)',
};

const gradient = {
  background: 'linear-gradient( transparent 40px, #AFADF8 40px 100%)',
};

const titleText = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#5C489D',
};

const btnText = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#6B4700',
};

const Rules = () => {
  console.log('BtnBg', BtnBg);
  const router = useRouter();
  const levelList = [
    {
      icon: <Level1 />,
      name: 'Level 1',
      unlock: '0',
      hours: '100',
    },
    {
      icon: <Level2 />,
      name: 'Level 2',
      unlock: '300',
      hours: '200',
    },
    {
      icon: <Level3 />,
      name: 'Level 3',
      unlock: '5000',
      hours: '400',
    },
    {
      icon: <Level4 />,
      name: 'Level 4',
      unlock: '15000',
      hours: '600',
    },
    {
      icon: <Level5 />,
      name: 'Level 5',
      unlock: '40000',
      hours: '800',
    },
    {
      icon: <Level6 />,
      name: 'Level 6',
      unlock: '80000',
      hours: '1000',
    },
  ];
  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  useEffect(() => {
    if (isInTG) {
      const TG = TelegramPlatform.getTelegram();
      TG.WebApp.BackButton.show();
      TG.WebApp.BackButton.onClick(() => {
        router.back();
      });
    }
  }, [isInTG, router]);
  return (
    <div className={styles['mini-app']}>
      <div className="w-full min-h-screen text-center bg-[#C8C6FA]" style={cloudStyle}>
        {!isInTG && (
          <div
            className="w-full h-[56px] p-[16px] pb-0 flex items-start group"
            onClick={() => setTimeout(() => router.back(), 300)}>
            <Back className="block group-active:hidden" />
            <BackActive className="hidden group-active:block" />
          </div>
        )}
        <div className={`${isInTG ? 'pt-[40px]' : 'pt-[24px]'}`}>
          <Title />
          <div className="text-[#5C489D] text-center text-[14px] mt-[24px] px-[16px] leading-5 !font-chillPixels">
            Forest is the first NFT marketplace and comprehensive portal within the aelf ecosystem.The Forest miniapp is
            a gamified airdrop platform that connects aelf and Telegram.
          </div>
        </div>

        <div className="flex items-end justify-between text-[14px] mt-[24px] px-[16px]">
          <div
            className={`w-[114px] h-[40px] relative group overflow-hidden ${styles.payBtn}`}
            onClick={() => window.open('https://www.eforest.finance')}>
            <div className={`w-[114px] h-[40px] block group-active:hidden ${styles.rulesBtnBg}`}></div>
            <div className={`w-[114px] h-[36px] mt-[4px] hidden group-active:block ${styles.rulesBtnBgActive}`}></div>
            <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
              <Tree />
              <span className="text-white stroke-black stroke-1 ml-1 -tracking-[2.24px]" style={btnText}>
                WEBSITE
              </span>
            </div>
          </div>
          <div
            className={`w-[114px] h-[40px] relative group overflow-hidden ${styles.payBtn}`}
            onClick={() => window.open('https://x.com/NFT_Forest_NFT')}>
            <div className={`w-[114px] h-[40px] block group-active:hidden ${styles.rulesBtnBg}`}></div>
            <div className={`w-[114px] h-[36px] mt-[4px] hidden group-active:block ${styles.rulesBtnBgActive}`}></div>
            <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
              <X />
              <span className="text-white stroke-black stroke-1 ml-1 -tracking-[2.24px]" style={btnText}>
                X
              </span>
            </div>
          </div>

          <div
            className={`w-[114px] h-[40px] relative group overflow-hidden ${styles.payBtn}`}
            onClick={() => window.open('https://t.me/+F8_CiBmTdmI2YzE9')}>
            <div className={`w-[114px] h-[40px] block group-active:hidden ${styles.rulesBtnBg}`}></div>
            <div className={`w-[114px] h-[36px] mt-[4px] hidden group-active:block ${styles.rulesBtnBgActive}`}></div>
            <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
              <Airplane />
              <span className="text-white stroke-black stroke-1 ml-1 -tracking-[2.24px]" style={btnText}>
                Telegram
              </span>
            </div>
          </div>
        </div>
        <div className="pb-[48px] px-[16px]" style={gradient}>
          <div className="w-full mt-[40px] p-[24px] pb-[40px]" style={BoxStyle}>
            <div className="flex items-center justify-center">
              <Title1 />
              <span className={styles.inviteTitle}>Magic tree</span>
              <Title1 />
            </div>
            <div className="text-[#5C489D] text-center text-[14px] my-[16px] !font-chillPixels leading-5">
              It can grow and produce star fruit. With each growth, it will yield more golden fruit.
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              {levelList.map((list, index) => {
                return (
                  <div
                    key={index}
                    style={SmallBoxStyle}
                    className="min-h-[128px] px-[12px] py-[16px] text-[12px] text-[#5C489D]">
                    <div>{list.icon}</div>
                    <div className="text-white -tracking-[1px] font-bold" style={titleText}>
                      {list.name}
                    </div>
                    <div className="flex items-center justify-between mt-[12px]">
                      <div className="!font-chillPixels">Cost</div>
                      <div className="flex items-center">
                        <span className="pr-[2px] !font-chillPixels">{list.unlock}</span>
                        <Orange />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-[4px] ">
                      <div className="!font-chillPixels">24H</div>
                      <div>
                        <span className="pr-[2px] !font-chillPixels">+{list.hours}</span>
                        <Orange />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-[24px] mt-[24px]" style={smBoxBgStyle}>
            <div className="flex items-center justify-center">
              <Title2 />
              <span className={styles.inviteTitle}>GOLDEN FURIT</span>
              <Title2 />
            </div>
            <div className="text-[14px] text-[#5C489D] mt-[16px] leading-5 !font-chillPixels">
              Golden fruits are associated with good fortune; the more you have, the more treasures you receive. Golden
              fruits are produced by the magical tree.
            </div>
          </div>
          <div className="p-[24px] mt-[24px]" style={smBoxBgStyle}>
            <div className="flex items-center justify-center">
              <Title3 />
              <span className={styles.inviteTitle}>KETTLE</span>
              <Title3 />
            </div>
            <div className="text-[14px] text-[#5C489D] mt-[16px] leading-5 !font-chillPixels">
              Watering speeds up the maturation of the golden fruits, and the amount of water in the kettle will
              automatically replenish over time.
            </div>
          </div>
          <div className="p-[24px] mt-[24px]" style={smBoxBgStyle}>
            <div className="flex items-center justify-center">
              <Title4 />
              <span className={styles.inviteTitle}>DROPS</span>
              <Title4 />
            </div>
            <div className="text-[14px] text-[#5C489D] mt-[16px] leading-5 !font-chillPixels">
              Occasional airdrop rewards from the aelf ecosystem. These could be tokens, NFTs, or special gifts, often
              related to the number of golden fruits held.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
