import styles from '../style.module.css';
import Title from 'assets/images/miniApp/rules/rulesTitle.svg';
import Tree from 'assets/images/miniApp/rules/tree.svg';
import Airplane from 'assets/images/miniApp/rules/airplane.svg';
import X from 'assets/images/miniApp/rules/x.svg';

import MagicTree from 'assets/images/miniApp/rules/magicTree.svg';
import GoldenFruit from 'assets/images/miniApp/rules/goldenFruit.svg';
import Kettle from 'assets/images/miniApp/rules/kettle.svg';
import Drops from 'assets/images/miniApp/rules/drops.svg';

import BtnBg from 'assets/images/miniApp/rules/btnBg.png';
import SmallBg from 'assets/images/miniApp/rules/smallBg.png';

import Box from 'assets/images/miniApp/rules/box.png';
import BoxBg from 'assets/images/miniApp/rules/boxBgs.png';

import Level1 from 'assets/images/miniApp/rules/level1.svg';
import Level2 from 'assets/images/miniApp/rules/level2.svg';
import Level3 from 'assets/images/miniApp/rules/level3.svg';
import Level4 from 'assets/images/miniApp/rules/level4.svg';
import Level5 from 'assets/images/miniApp/rules/level5.svg';
import Level6 from 'assets/images/miniApp/rules/level6.svg';
import Orange from 'assets/images/miniApp/rules/orange.svg';

const btnStyle = {
  backgroundImage: `url(${BtnBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const BoxStyle = {
  backgroundImage: `url(${Box.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const smBoxBgStyle = {
  backgroundImage: `url(${SmallBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const SmallBoxStyle = {
  backgroundImage: `url(${BoxBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const Rules = () => {
  console.log('BtnBg', BtnBg);

  const levelList = [
    {
      icon: <Level1 />,
      name: 'Level 1',
      unlock: '0',
      hours: '12',
    },
    {
      icon: <Level2 />,
      name: 'Level 2',
      unlock: '12',
      hours: '12',
    },
    {
      icon: <Level3 />,
      name: 'Level 3',
      unlock: '12',
      hours: '12',
    },
    {
      icon: <Level4 />,
      name: 'Level 4',
      unlock: '12',
      hours: '12',
    },
    {
      icon: <Level5 />,
      name: 'Level 5',
      unlock: '?',
      hours: '?',
    },
    {
      icon: <Level6 />,
      name: 'Level 6',
      unlock: '?',
      hours: '?',
    },
  ];
  return (
    <div className={styles['mini-app']}>
      <div className="w-full min-h-screen text-center bg-[#B1A7D0] py-[48px] px-[16px]">
        <Title />
        <div className="text-[#5C489D] text-center text-[14px] mt-[24px]">
          Forest is the first NFT marketplace and comprehensive portal within the aelf ecosystem. The Forest miniapp is
          a Telegram-based airdrop gaming platform in the aelf ecosystem.
        </div>
        <div className="flex items-end justify-between text-[14px] mt-[24px]">
          <div className="flex items-center justify-center w-[114px] h-[40px]" style={btnStyle}>
            <Tree />
            <span className="text-white stroke-black stroke-1 ml-1">WEBSITE</span>
          </div>
          <div className="flex items-center justify-center w-[114px] h-[36px]" style={btnStyle}>
            <X />
            <span className="text-white stroke-black stroke-1 ml-1">X</span>
          </div>
          <div className="flex items-center justify-center w-[114px] h-[40px]" style={btnStyle}>
            <Airplane />
            <span className="text-white stroke-black stroke-1 ml-1">Telegram</span>
          </div>
        </div>
        <div className="w-full mt-[24px] p-[20px]" style={BoxStyle}>
          <div>
            <MagicTree />
          </div>
          <div className="text-[#5C489D] text-center text-[14px] my-[16px]">
            It can grow and produce star fruit. With each growth, it will yield more golden fruit.
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            {levelList.map((list, index) => {
              return (
                <div key={index} style={SmallBoxStyle} className="min-h-[128px] px-[12px] py-[16px] text-[12px]">
                  <div>{list.icon}</div>
                  <div>{list.name}</div>
                  <div className="flex items-center justify-between mt-[12px]">
                    <div>Unlock</div>
                    <div className="flex items-center">
                      <span className="pr-[2px]">{list.unlock}</span>
                      <Orange />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-[4px]">
                    <div>24H</div>
                    <div>
                      <span className="pr-[2px]">+{list.hours}</span>
                      <Orange />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-[24px] mt-[24px]" style={smBoxBgStyle}>
          <GoldenFruit />
          <div className="text-[14px] text-[#5C489D] mt-[16px] leading-5">
            Golden fruit is associated with good luck; the more you have, the more treasures you will receive.Star fruit
            is produced by the magical tree.
          </div>
        </div>
        <div className="p-[24px] mt-[24px]" style={smBoxBgStyle}>
          <Kettle />
          <div className="text-[14px] text-[#5C489D] mt-[16px] leading-5">
            Each time you water, it can speed up the maturation time of star fruit by 1 hour. The watering can has a
            maximum capacity of 60, and it replenishes once every hour.
          </div>
        </div>
        <div className="p-[24px] mt-[24px]" style={smBoxBgStyle}>
          <Drops />
          <div className="text-[14px] text-[#5C489D] mt-[16px] leading-5">
            Airdrop rewards from the aelf ecosystem are distributed irregularly and are often related to the quantity of
            star fruit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
