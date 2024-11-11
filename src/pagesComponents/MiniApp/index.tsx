import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import styles from './style.module.css';
import Image from 'next/image';

import { useSelector } from 'react-redux';
import { getUserInfo, walletInfo } from 'store/reducer/userInfo';
import useTelegram from 'hooks/useTelegram';
import Grass from 'assets/images/miniApp/home/grass.png';
import OrangeBg from 'assets/images/miniApp/home/orangeBg.png';
import Orange from 'assets/images/miniApp/home/orange.svg';
import OrangeModel from 'assets/images/miniApp/home/orangeModel.svg';
import Kettle from 'assets/images/miniApp/home/kettle.svg';
import KettleBig from 'assets/images/miniApp/home/kettleBig.svg';
import Book from 'assets/images/miniApp/home/book.svg';
import Wallet from 'assets/images/miniApp/home/wallet.svg';
import Lock from 'assets/images/miniApp/home/lock.svg';
import TimeBg from 'assets/images/miniApp/home/timeBg.png';

import OrangeBig from 'assets/images/miniApp/home/orangeBig.png';
import Up from 'assets/images/miniApp/home/up.svg';
import Close from 'assets/images/miniApp/home/close.svg';
import CloseActive from 'assets/images/miniApp/home/closeActive.svg';

import KettleSm from 'assets/images/miniApp/home/kettleSm.svg';

import ModelBg from 'assets/images/miniApp/home/modelBg.png';
import ModelBgBig from 'assets/images/miniApp/home/modelBgBig.png';

import ProgressBg from 'assets/images/miniApp/home/progressBg.png';

import LevelUp from 'assets/images/miniApp/home/levelUp.svg';

import BtnBg from 'assets/images/miniApp/home/btnBg.png';

import OrangSm from 'assets/images/miniApp/home/orangeSm.svg';

import UpIcon from 'assets/images/miniApp/home/upIcon.svg';

import Water from 'assets/images/miniApp/home/water.svg';

import TopTree from 'assets/images/miniApp/home/topTree.svg';

import {
  fetchMiniAppUserInfo,
  fetchMiniAppWatering,
  fetchMiniAppClaim,
  fetchMiniAppLevelUpdate,
  fetchMiniAppActivityList,
} from 'api/fetch';

import { Activity, PointsDetail, UserData } from 'api/types';

import CountDown from './components/CountDown';
import { getOmittedStr, OmittedType } from 'utils';
import { useInterval } from 'ahooks';
import { AddTreePoints, TreeLevelUpgrade } from 'contract/miniApp';
import { ClaimParams } from 'contract/type';
import ActivityCard from './components/ActivityCard';

import { TelegramPlatform } from '@portkey/did-ui-react';
import { message } from 'antd';
import NumberAdd from './components/NumberAdd';

const homeBg = {
  backgroundImage: `url(${Grass.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const orangeBg = {
  backgroundImage: `url(${OrangeBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
};

const text = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#6B4700',
};

const textModel = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#5C489D',
  textShadow: '0px 4px 0px #D6D1E7',
};

const titleModel = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#5C489D',
};

const waterText = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#5C489D',
};

const orangeBig = {
  width: '60px',
  height: '60px',
  backgroundImage: `url(${OrangeBig.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
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
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
};

const modelBgBig = {
  backgroundImage: `url(${ModelBgBig.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
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
  const { address, fullAddress } = useSelector(getUserInfo);

  const TG = TelegramPlatform.getTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  console.log('isInTG', isInTG);

  const [userInfo, setUserInfo] = useState<UserData>();

  const getInfo = async (address: string, tgname: string) => {
    if (address) {
      const useInfo = await fetchMiniAppUserInfo({ address, tgname });
      setUserInfo(useInfo);
    }
  };

  const watering = async () => {
    if (address) {
      const useInfo = await fetchMiniAppWatering({ count: 1, address });
      setUserInfo(useInfo);
    }
  };

  const claim = async (index: Number) => {
    let type = 'normalOne';
    switch (index) {
      case 0:
        type = 'normalOne';
        break;
      case 1:
        type = 'normalTwo';
        break;
      case 2:
        type = 'invite';
        break;
      default:
        type = 'normalOne';
    }
    if (address) {
      if (type == 'normalOne') {
        if (Number(userInfo?.pointsDetails[0].remainingTime) > 0) {
          return message.warning("Wait till the fruit's ripe");
        }
      }
      if (type == 'normalTwo') {
        if (Number(userInfo?.pointsDetails[1].remainingTime) > 0) {
          return message.warning("Wait till the fruit's ripe");
        }
      }

      if (type == 'invite' && Number(userInfo?.pointsDetails[2].amount) < 100) {
        return message.warning('It can only be withdrawn when it reaches 100');
      }

      const res = await fetchMiniAppClaim({ address, pointsDetailType: type });

      addTreePoints(res);
    }
  };

  const [claimData, setClaimData] = useState<ClaimParams>();

  const addTreePoints = async (params: ClaimParams) => {
    try {
      setLoading(true);
      await AddTreePoints(params);
      setTimeout(
        () => {
          setLoading(false);
          setClaimModel(true);
          setClaimType(0);
          setClaimData(params);
          getInfo(address, name);
        },
        process.env.NEXT_PUBLIC_APP_ENV == 'production' ? 10000 : 20000,
      );
    } catch (error) {
      setLoading(false);
      setClaimModel(true);
      setClaimType(1);
      setClaimData(params);
      console.log('error', error);
    }
  };

  const [name, setName] = useState('');

  useEffect(() => {
    if (isInTG) {
      const data: any = TelegramPlatform.getInitData();
      const { username } = JSON.parse(data?.user);
      setName(username);
    }
  }, [isInTG]);

  useEffect(() => {
    if (isInTG) {
      TG.WebApp.BackButton.hide();
    }
  }, [isInTG]);

  useEffect(() => {
    address && getInfo(address, name);
  }, [address]);

  useInterval(() => {
    address && getInfo(address, name);
  }, 5000);

  const router = useRouter();

  const goToRules = () => {
    router.push('/mini-app/rules');
  };

  const [model, setModel] = useState(false);

  const [showWater, setShowWater] = useState(false);

  const waterAnimate = () => {
    setShowWater(true);
    isInTG && TG.WebApp.HapticFeedback.impactOccurred('heavy');
    setTimeout(() => {
      setShowWater(false);
    }, 300);
  };

  const [showTip, setShowTip] = useState(!localStorage.getItem('hideTip'));

  const isLock = (remainingTime: number) => {
    return remainingTime > 0;
  };

  const [loading, setLoading] = useState(false);
  const [claimModel, setClaimModel] = useState(false);

  const [kettleModal, setKettleModal] = useState(false);

  const [claimType, setClaimType] = useState(0);

  const [percent, setPercent] = useState(100);

  useEffect(() => {
    setPercent(Math.floor((Number(userInfo?.waterInfo?.current) * 100) / Number(userInfo?.waterInfo?.max)));
  }, [userInfo]);

  const [levelUpModel, setLevelUpModel] = useState(false);

  const [levelUpFailModel, setLevelUpFailModel] = useState(false);

  const updateTree = async (nextLevel: number) => {
    const res = await fetchMiniAppLevelUpdate({ address, nextLevel });
    setLoading(true);
    setModel(false);
    try {
      await TreeLevelUpgrade(res);

      setTimeout(
        () => {
          setLoading(false);
          setLevelUpModel(true);
        },
        process.env.NEXT_PUBLIC_APP_ENV == 'production' ? 10000 : 20000,
      );
    } catch (error) {
      setLoading(false);
      setLevelUpFailModel(true);
    }
  };

  const getTimeUnit = (timeUnit: number) => {
    switch (timeUnit) {
      case 0:
        return 'H';
      case 1:
        return 'M';
      case 2:
        return 'S';
      default:
        return 'H';
    }
  };

  const [activeList, setActiveList] = useState<Activity[]>([]);

  const getActiveList = async () => {
    const res = await fetchMiniAppActivityList({ address });
    setActiveList(res);
  };

  useEffect(() => {
    getActiveList();
  }, []);

  const wateringFun = () => {
    if (Number(userInfo?.waterInfo?.current) > 0) {
      if (userInfo?.pointsDetails[0]?.remainingTime == 0 && userInfo?.pointsDetails[1]?.remainingTime == 0) {
        message.warning('Please harvest first');
      } else {
        waterAnimate();
        watering();
      }
    } else {
      message.error("You don't have enough water");
    }
  };

  return (
    <>
      {!address ? (
        <Welcome />
      ) : (
        <div className={styles['mini-app']} style={homeBg}>
          <div className="w-full text-center">
            <div className="flex items-center justify-between p-[16px]">
              <div className="w-[180px] h-[52px] flex items-center justify-between px-[12px] py-[6px]" style={orangeBg}>
                <Orange />
                <span className="-tracking-[2px] text-[16px] text-white font-bold" style={text}>
                  {userInfo?.totalPoints?.toLocaleString('en-US')}
                </span>
              </div>
              <div className="relative group" onClick={() => setTimeout(() => setKettleModal(true), 300)}>
                <span
                  className="-tracking-[2px] text-[16px] text-white font-bold absolute bottom-[2px] right-[2px] group-active:bottom-[0px]  z-10"
                  style={waterText}>
                  {userInfo?.waterInfo?.current}
                </span>
                <div className={`w-[48px] h-[52px] block group-active:hidden ${styles.boxBg}`}></div>
                <div className={`w-[48px] h-[48px] mt-[4px] hidden group-active:block ${styles.boxBgHover}`}></div>
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2  group-active:top-[12px]">
                  <Kettle />
                </div>
              </div>
              <div className="relative group" onClick={() => setTimeout(() => goToRules(), 300)}>
                <div className={`w-[48px] h-[52px] block group-active:hidden ${styles.boxBg}`}></div>
                <div className={`w-[48px] h-[48px] mt-[4px] hidden group-active:block ${styles.boxBgHover}`}></div>
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2  group-active:top-[12px]">
                  <Book />
                </div>
              </div>
              <div className="relative group" onClick={() => setTimeout(() => router.push('asset'), 300)}>
                <div className={`w-[48px] h-[52px] block group-active:hidden ${styles.boxBg}`}></div>
                <div className={`w-[48px] h-[48px] mt-[4px] hidden group-active:block ${styles.boxBgHover}`}></div>
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2  group-active:top-[12px]">
                  <Wallet />
                </div>
              </div>
            </div>
            {showTip && (
              <div
                className="w-full h-full fixed top-0 left-0 z-40"
                onClick={() => {
                  setShowTip(false);
                  localStorage.setItem('hideTip', '1');
                }}>
                <div
                  className="w-[334px] py-[10px] pt-[100px] m-auto [text-shadow:_0_2px_0px_#A16A19] -tracking-[6.48px] text-[28px] text-white leading-9 font-bold"
                  style={text}>
                  Welcome to Forest Water, harvest and wait for good luck
                </div>
                <div className="mt-[24px] z-20">
                  <KettleBig className={styles.animateStyle} />
                  <div
                    className="[text-shadow:_0_2px_0px_#6B4700] -tracking-[5.84px] text-[24px] text-white leading-9 font-bold"
                    style={text}>
                    Tap to water
                  </div>
                </div>
              </div>
            )}
            <div
              className="w-3/4 m-auto flex items-center justify-between transition-opacity ease-in-out delay-100"
              style={{ opacity: showTip ? '0' : '1' }}>
              {userInfo?.pointsDetails.map((list, index) => {
                return (
                  <div
                    key={index}
                    className={`relative ${index !== 1 && 'mt-[40px]'}`}
                    style={orangeBig}
                    onClick={() => claim(index)}>
                    <div
                      className={`-tracking-[3.84px] text-[24px] text-white font-bold pt-[20px] absolute top-0 left-1/2 -translate-x-1/2`}
                      style={text}>
                      {index !== 2 ? <NumberAdd item={list} /> : list.amount}
                    </div>
                    <div className="flex items-center absolute bottom-0 left-1/2 -translate-x-1/2">
                      {index !== 2 ? isLock(list.remainingTime) && <Lock /> : list.amount < 100 && <Lock />}
                      <div className="flex items-center justify-center" style={timeBg}>
                        {index == 2 ? (
                          <span className="text-[12px] px-[6px] py-[1px] !font-smithesyzer text-[#4A310B] leading-[10px]">
                            INVITATION
                          </span>
                        ) : (
                          <>
                            {list?.remainingTime ? (
                              <CountDown
                                className="text-[12px] px-[6px] py-[1px] !font-smithesyzer text-[#4A310B] leading-[10px]"
                                remainingTime={list?.remainingTime}
                              />
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!showTip && Number(userInfo?.totalPoints) >= Number(userInfo?.treeInfo?.nextLevelCost) && (
              <div
                className={`absolute right-[20px] top-[230px] z-10 ${styles.beeAnimation}`}
                onClick={() => setModel(true)}>
                <Up />
              </div>
            )}
            <div className="relative min-h-[400px]">
              {userInfo?.treeInfo && (
                <Image
                  src={require(`assets/images/miniApp/home/tree/Tree_${userInfo?.treeInfo?.current?.level}.png`)}
                  width={400}
                  height={400}
                  alt={''}
                  onClick={wateringFun}
                />
              )}

              {showWater && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                  <Water className="transition-all duration-300 ease-in-out	delay-100 animate-ping" />
                </div>
              )}

              <div className="w-full flex items-start justify-between px-[14%] absolute bottom-[20px] left-0 pointer-events-none">
                {activeList.map((list, index) => {
                  return <ActivityCard key={list.id} list={list} index={index} activeList={activeList} />;
                })}
              </div>
            </div>
          </div>

          {loading && (
            <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
              <div
                className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] leading-5 text-center flex items-center justify-center relative"
                style={modelBg}>
                <div className="!font-chillPixels">On-chain confirmation in progress…</div>
              </div>
            </div>
          )}

          {model && (
            <>
              {userInfo?.treeInfo?.next ? (
                <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
                  <div
                    className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
                    style={modelBgBig}>
                    <div
                      className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
                      onClick={() => setTimeout(() => setModel(false), 300)}>
                      <Close className="block group-active:hidden" />
                      <CloseActive className="hidden group-active:block" />
                    </div>
                    <div>
                      <div className="text-white text-[24px] leading-10 -tracking-[3.84px]" style={titleModel}>
                        Level up
                      </div>
                      <div>
                        <LevelUp />
                      </div>
                      <div
                        className="text-white text-[16px] leading-[20px] my-[4px] flex items-center justify-center gap-[4px] -tracking-[2.56px]"
                        style={titleModel}>
                        <UpIcon />
                        <span>Level {userInfo?.treeInfo?.next?.level}</span>
                      </div>
                      <div className="text-[12px] flex items-center justify-center gap-[2px]">
                        <span className="!font-chillPixels">
                          {userInfo?.treeInfo?.next?.frequency}
                          {getTimeUnit(userInfo?.treeInfo?.next?.timeUnit || 0)}
                        </span>
                        <span className="!font-chillPixels">+{userInfo?.treeInfo?.next?.produce}</span>
                        <OrangSm width={12} height={12} />
                      </div>
                      <div className="text-[14px] mt-[16px] !font-chillPixels">
                        Consume golden fruits to obtain a higher-level tree
                      </div>
                      <div
                        className={`w-[160px] h-[40px] relative m-auto my-[24px] group overflow-hidden ${styles.payBtn}`}
                        onClick={() => updateTree(userInfo?.treeInfo?.next?.level || 0)}>
                        <div className={`w-[160px] h-[40px] block group-active:hidden ${styles.btnBg}`}></div>
                        <div
                          className={`w-[160px] h-[36px] mt-[4px] hidden group-active:block ${styles.btnBgActive}`}></div>

                        <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
                          <span className="text-white -tracking-[2.56px]" style={text}>
                            PAY {userInfo?.treeInfo?.nextLevelCost}
                          </span>
                          <OrangSm width={16} height={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
                  <div
                    className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
                    style={modelBgBig}>
                    <div
                      className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
                      onClick={() => setTimeout(() => setModel(false), 300)}>
                      <Close className="block group-active:hidden" />
                      <CloseActive className="hidden group-active:block" />
                    </div>
                    <div className="flex flex-col gap-[16px] pt-[56px] pb-[16px]">
                      <div className="text-white text-[16px] leading-[20px] my-[4px] flex flex-col items-center justify-center gap-[12px]">
                        <TopTree />
                        <span style={titleModel}>Level {userInfo?.treeInfo?.current?.level}</span>
                      </div>
                      <div className="text-[14px] leading-5 !font-chillPixels">
                        This is the highest level tree available at the moment. Please wait for new levels to be
                        unlocked.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {levelUpModel && (
            <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
              <div
                className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
                style={modelBgBig}>
                <div
                  className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
                  onClick={() => setTimeout(() => setLevelUpModel(false), 300)}>
                  <Close className="block group-active:hidden" />
                  <CloseActive className="hidden group-active:block" />
                </div>
                <div>
                  <div className="text-white text-[24px] leading-10 -tracking-[3.84px]" style={titleModel}>
                    Level up!
                  </div>
                  <div>
                    <LevelUp />
                  </div>
                  <div
                    className="text-white text-[16px] leading-[20px] my-[4px] flex items-center justify-center gap-[4px] -tracking-[2.56px]"
                    style={titleModel}>
                    <span>Level {userInfo?.treeInfo?.next?.level}</span>
                  </div>
                  <div className="text-[14px] mt-[16px] !font-chillPixels">
                    Congratulations, your tree has leveled up to level {userInfo?.treeInfo?.next?.level}!
                  </div>
                  <div
                    className={`w-[160px] h-[40px] relative m-auto my-[24px] group overflow-hidden ${styles.payBtn}`}
                    onClick={() => setLevelUpModel(false)}>
                    <div className={`w-[160px] h-[40px] block group-active:hidden ${styles.btnBg}`}></div>
                    <div
                      className={`w-[160px] h-[36px] mt-[4px] hidden group-active:block ${styles.btnBgActive}`}></div>
                    <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
                      <span className="text-white -tracking-[2.56px]" style={text}>
                        confirm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {levelUpFailModel && (
            <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
              <div
                className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
                style={modelBg}>
                <div
                  className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
                  onClick={() => setTimeout(() => setLevelUpFailModel(false), 300)}>
                  <Close className="block group-active:hidden" />
                  <CloseActive className="hidden group-active:block" />
                </div>
                <div className="flex flex-col gap-[16px]">
                  <div className="text-[#E0373E] !font-chillPixels">Upgrade Failed</div>
                  <div className="!font-chillPixels">{getOmittedStr(fullAddress, OmittedType.ADDRESS)}</div>
                </div>
              </div>
            </div>
          )}

          {claimModel && (
            <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
              <div
                className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
                style={modelBg}>
                <div
                  className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
                  onClick={() => setTimeout(() => setClaimModel(false), 300)}>
                  <Close className="block group-active:hidden" />
                  <CloseActive className="hidden group-active:block" />
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex items-center justify-center">
                    <OrangeModel />
                    <span className="text-white pl-[10px] text-[20px] -tracking-[3.2px]" style={textModel}>
                      x {claimData?.points}
                    </span>
                  </div>
                  {claimType == 0 && (
                    <div className="my-[16px] text-[#5C489D] !font-chillPixels text-[14px]">Claim successful!</div>
                  )}
                  {claimType == 1 && (
                    <div>
                      <div className="my-[16px] text-[#E0373E] !font-chillPixels text-[14px]">Claim failed!</div>
                      <div className="text-[12px] !font-chillPixels">
                        {getOmittedStr(fullAddress, OmittedType.ADDRESS)}
                      </div>
                    </div>
                  )}
                  {claimType == 2 && (
                    <div className="text-[12px] text-[#5C489D]">
                      <div className="my-[16px] text-[#E0373E] !font-chillPixels">Claim failed!</div>
                      <p className="mt-[10px] !font-chillPixels">
                        {getOmittedStr(fullAddress, OmittedType.ADDRESS)} has insufficient ELF balance, not enough to
                        cover the gas fee.
                      </p>
                      <p className="mt-[10px] !font-chillPixels">Please use ETransfer to top up ELF.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {kettleModal && (
            <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
              <div
                className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
                style={modelBgBig}>
                <div
                  className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
                  onClick={() => setTimeout(() => setKettleModal(false), 300)}>
                  <Close className="block group-active:hidden" />
                  <CloseActive className="hidden group-active:block" />
                </div>
                <div className="flex flex-col">
                  <div className="text-white text-[24px] leading-10 -tracking-[3.84px]" style={titleModel}>
                    kettle
                  </div>
                  <div className="my-[16px]">
                    <Kettle />
                  </div>
                  <div className="w-[200px] h-[20px] m-auto p-[2px] relative" style={progressBg}>
                    <div
                      className={`bg-[#FFB933] h-full rounded ${styles.gradient}`}
                      style={{ width: `${percent}%` }}></div>
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[16px] -tracking-[2.56px]"
                      style={text}>
                      <span>{userInfo?.waterInfo?.current}</span>
                      <span>/</span>
                      <span>{userInfo?.waterInfo?.max}</span>
                    </div>
                  </div>
                  {userInfo?.waterInfo.max !== userInfo?.waterInfo?.current && (
                    <div className="flex items-center justify-center gap-[10px] text-[14px] py-[8px]">
                      <CountDown
                        className="!font-chillPixels"
                        noDays={true}
                        remainingTime={
                          Number(userInfo?.waterInfo?.frequency) * 60 -
                          Math.floor(Number(new Date().getTime() - Number(userInfo?.waterInfo?.updateTime)) / 1000)
                        }
                      />
                      <span className="flex items-center gap-[4px]">
                        <KettleSm />
                        <span className="!font-chillPixels">+1</span>
                      </span>
                    </div>
                  )}
                  <div className="my-[16px] text-[14px] !font-chillPixels">
                    The kettle replenishes its water every 10 minutes.
                  </div>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;
