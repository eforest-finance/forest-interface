import { useEffect, useMemo, useState } from 'react';
import baseStyles from '../../style.module.css';
import styles from './styles.module.css';
import OrangeBig from 'assets/images/v2/orangeBig.svg';

import Check from 'assets/images/v2/i_check.svg';
import NoBalance from 'assets/images/v2/noBalance.svg';

import Back from 'assets/images/miniApp/home/back.svg';
import BackActive from 'assets/images/miniApp/home/backActive.svg';

import { getTagInfo, Tag } from '../components/Card';
import { ImageEnhance } from 'components/ImgLoading/ImgLoadingEnhance';
import Top from 'assets/images/v2/Cloud_Top2_3x.png';
import Image from 'next/image';

import Close from 'assets/images/miniApp/home/close.svg';
import CloseActive from 'assets/images/miniApp/home/closeActive.svg';

import ProgressBar_LR from 'assets/images/miniApp/welcome/ProgressBar_LR.svg';
import ProgressContainer_L from 'assets/images/miniApp/welcome/ProgressContainer_L.svg';

import ProgressContainer_R from 'assets/images/miniApp/welcome/ProgressContainer_R.svg';

import { useSelector } from 'react-redux';
import { getUserInfo } from 'store/reducer/userInfo';

import { fetchMiniAppActivityDetail, fetchMiniAppUserInfo, fetchMiniAppPointsConvert } from 'api/fetch';

import { Activity } from 'api/types';

import { ClaimTreePoints } from 'contract/miniApp';

import ModelBg from 'assets/images/miniApp/home/modelBg.png';
import { getOmittedStr, OmittedType } from 'utils';

import { useStatus, useShowStartTime } from '../hooks/useGetStatus';
import { TelegramPlatform } from '@portkey/did-ui-react';
import useTelegram from 'hooks/useTelegram';
import { useRouter } from 'next/navigation';

import deepEqual from 'fast-deep-equal';
import { diff } from 'deep-diff';

const modelBg = {
  backgroundImage: `url(${ModelBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
};

const bottomBg = {
  borderTop: ' 4px solid #D6D1E7',
  background: '#F2F0F7',
  boxShadow: ' 0px -2px 0px 0px #B1A7D0',
};

export const getType = (type: number | undefined) => {
  switch (type) {
    case 0:
      return 'ELF';
    case 1:
      return 'USDT';

    default:
      return 'ELF';
  }
};

const DropsDetail = (props: { params: { id: any } }) => {
  const { id } = props.params;

  const [info, setInfo] = useState<Activity>();
  const router = useRouter();

  const { address, fullAddress } = useSelector(getUserInfo);

  const diffFun = (data: Activity) => {
    const differences = diff(info, data);

    Array.isArray(differences) &&
      differences.map((diffItem) => {
        if (loading && deepEqual(diffItem.path, ['canClaim'])) {
          setLoading(false);
          setClaimModel(true);
        }
      });
  };

  const getInfo = async () => {
    const res = await fetchMiniAppActivityDetail({
      address,
      id,
    });
    setInfo(res);
    diffFun(res);
  };

  const [name, setName] = useState('');

  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  useEffect(() => {
    if (isInTG) {
      const data: any = TelegramPlatform.getInitData();
      const { username } = JSON.parse(data?.user);
      setName(username);
    }
  }, [isInTG]);

  useEffect(() => {
    const TG = TelegramPlatform.getTelegram();
    TG.WebApp.BackButton.show();
    TG.WebApp.BackButton.onClick(() => {
      router.back();
    });
    TG.WebApp.BackButton.offClick(() => {
      TG.WebApp.BackButton.hidden();
    });
  }, [isInTG, router]);

  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const res = await fetchMiniAppUserInfo({ address, tgname: name });
    setBalance(res.totalPoints);
  };

  useEffect(() => {
    address && getBalance();
  }, [address]);

  useEffect(() => {
    getInfo();
  }, [id]);

  const percent = useMemo(() => {
    return `${((Number(info?.totalReward) - Number(info?.leftReward)) * 100) / Number(info?.totalReward)}%`;
  }, [info]);

  const [loading, setLoading] = useState(false);

  const claimTreePoints = async () => {
    const res: any = await fetchMiniAppPointsConvert({ address, activityId: id });
    const result: any = {
      address: res.address,
      activityId: res.activityId,
      points: res.points,
      opTime: res.opTime,
      reward: {
        symbol: res.rewardSymbol,
        amount: res.rewardAmount,
      },
      requestHash: res.requestHash,
    };

    try {
      setLoading(true);
      await ClaimTreePoints(result);
    } catch (error) {
      setLoading(false);
      // setClaimFailModel(true);
      console.log('error', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (address && id) {
        getInfo();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [address, id]);

  const [claimModel, setClaimModel] = useState(false);
  const [claimFailModel, setClaimFailModel] = useState(false);

  const activityStatus = useStatus(info);

  const showStartTime = useShowStartTime(info);

  return (
    <div className="h-screen">
      <div
        className={`px-[16px] pt-[16px] pb-[100px] relative z-0  bg-[#C8C6FA] ${baseStyles['mini-app']} ${styles.main}`}>
        <div className={` ${styles.card} relative`}>
          {!isInTG && (
            <div
              className="w-full pb-[16px] flex items-start group"
              onClick={() => setTimeout(() => router.back(), 300)}>
              <Back className="block group-active:hidden" />
              <BackActive className="hidden group-active:block" />
            </div>
          )}
          <div className={`${styles.mask}`}>
            <div className="w-full relative">
              <ImageEnhance
                alt=""
                width="100%"
                className="w-full !h-[200px] aspect-square object-cover"
                src={info?.imageUrl}
              />
            </div>
          </div>
          <h1 className={styles.title}>{info?.activityName}</h1>
          <div className="mt-[8px]">
            <Tag
              type={getTagInfo(activityStatus, showStartTime).type}
              title={getTagInfo(activityStatus, showStartTime).title}
            />
          </div>
          <div className="mt-[8px] text-[#5C489D] text-[14px] font-bold !font-chillPixels leading-5">
            {info?.activityDesc}
          </div>
          <div className={`${styles.cardMask}`}>
            <div className={styles.cardTitle}>Reward</div>
            <div className="mt-[12px] text-[32px] text-[#5C489D] font-bold !font-chillPixels">
              {info?.redeemRewardOnce} {getType(info?.rewardType)}
            </div>
            <div className="text-[14px] text-[#8172B4] font-bold !font-chillPixels"></div>
            <div className="mt-[12px] text-[14px] text-[#5C489D] font-bold !font-chillPixels">Remaining Amount</div>

            <div className={`w-full h-[20px] text-center mt-[4px] relative ${styles.checkButtonBox}`}>
              <div className={`w-full flex items-center absolute top-[2px] left-[2px] `}>
                {percent !== '0%' && <ProgressBar_LR />}
                <div className={`${styles.innerProgress} h-[16px]`} style={{ width: percent }}></div>
                {percent !== '0%' && <ProgressBar_LR />}
              </div>
              <div className="flex items-center justify-center">
                <ProgressContainer_L />
                <div className={`${styles.containerProgress} w-full h-[20px]`}></div>
                <ProgressContainer_R />
              </div>

              <div className={`${styles.percent} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
                <span>
                  {(Number(info?.totalReward) - Number(info?.leftReward))?.toLocaleString('en-US')}/
                  {info?.totalReward?.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* <div className={styles.progress}>
              <div className={styles.percent}>
                <span>
                  {info?.leftReward?.toLocaleString('en-US')}/{info?.totalReward?.toLocaleString('en-US')}
                </span>
              </div>

              <div className={styles.progressInner}>
                <div className="bg-[#FFB933] h-full rounded-xl" style={{ width: percent }}></div>
              </div>
            </div> */}
          </div>

          <div className={`${styles.cardMask} mt-[16px] mb-[48px]`}>
            <div className={styles.cardTitle}>Eligibility</div>
            <div className="mt-[12px] text-[14px] font-bold text-[#5C489D] flex items-center !font-chillPixels">
              Holding More Than {info?.minPoints.toLocaleString('en-US')} <OrangeBig className="ml-[4px]" />
            </div>
            <div className={styles.tips}>
              {Number(balance) >= Number(info?.minPoints) ? (
                <div className="w-full flex items-center p-[16px] pb-[26px] gap-[8px]">
                  <Check className="mr-[8px]" />
                  <span className="!font-chillPixels text-[#5C489D]">You qualify</span>
                </div>
              ) : (
                <div className="w-full flex items-start p-[16px] pb-[26px] gap-[8px]">
                  <NoBalance className="w-[32px]" />
                  <span className="text-[#E0373E] !font-chillPixels text-[14px]">Insufficient golden fruit held</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`fixed left-0 bottom-0 -z-10 w-full h-fit bg-[#C8C6FA]`}
          style={{ bottom: `${activityStatus == 0 || activityStatus == 3 ? '0px' : '60px'}` }}>
          <Image alt="" className="w-full h-auto" src={Top} />
        </div>
      </div>

      {activityStatus == 1 && (
        <div
          className="w-full h-[95px] bg-[#F2F0F7] flex items-center justify-center fixed left-0 bottom-0"
          style={bottomBg}>
          <div className={styles.button}>
            <span className={styles.buttonText}>{getTagInfo(activityStatus, showStartTime, true).title}</span>
          </div>
        </div>
      )}
      {activityStatus == 2 && (
        <>
          {info?.canClaim ? (
            <>
              {Number(balance) >= Number(info?.minPoints) ? (
                <div
                  className="w-full h-[95px] bg-[#F2F0F7] flex items-center justify-center fixed left-0 bottom-0"
                  style={bottomBg}>
                  <div className="w-[240px] h-[48px] m-auto relative group overflow-hidden" onClick={claimTreePoints}>
                    <div className={`w-[240px] h-[48px] block group-active:hidden ${styles.claimButton}`}></div>
                    <div
                      className={`w-[240px] h-[44px] mt-[4px] hidden group-active:block ${styles.claimButtonActive}`}></div>
                    <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
                      <span className={styles.buttonText}>Claim</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-[95px] bg-[#F2F0F7] flex items-center justify-center fixed left-0 bottom-0"
                  style={bottomBg}>
                  <div className={styles.disabled}>
                    <span className={styles.disabledButtonText}>Claim</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className="w-full h-[95px] bg-[#F2F0F7] flex items-center justify-center fixed left-0 bottom-0"
              style={bottomBg}>
              <div className={styles.disabled}>
                <span className={styles.disabledButtonText}>Claimed</span>
              </div>
            </div>
          )}
        </>
      )}
      {activityStatus == 3 && !info?.canClaim && (
        <div
          className="w-full h-[95px] bg-[#F2F0F7] flex items-center justify-center fixed left-0 bottom-0"
          style={bottomBg}>
          <div className={styles.disabled}>
            <span className={styles.disabledButtonText}>{'Claimed'}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
          <div
            className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
            style={modelBg}>
            <div className="!font-chillPixels">On-chain confirmation in progress…</div>
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
            <div className="w-full flex flex-col py-[20px]">
              <div className="pt-[20px] !font-chillPixels">Claim successful!</div>
              <div className="py-[16px] !font-chillPixels">Extraction successful, please check your wallet</div>

              <div
                className={`w-[160px] h-[40px] m-auto relative group overflow-hidden ${styles.checkButtonBox}`}
                onClick={() => router.push('/mini-app')}>
                <div className={`w-[160px] h-[40px] block group-active:hidden ${styles.checkButton}`}></div>
                <div
                  className={`w-[160px] h-[36px] mt-[4px] hidden group-active:block ${styles.checkButtonActive}`}></div>
                <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
                  <span className={`${styles.buttonText} text-[16px] px-[10px]`}>Check Wallet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {claimFailModel && (
        <div className="w-full h-full fixed top-0 left-0 bg-transparent flex items-center justify-center z-30">
          <div
            className="w-4/5 min-h-[200px] p-[20px] text-[#5C489D] text-[14px] text-center flex items-center justify-center relative"
            style={modelBg}>
            <div
              className="w-[36px] h-[40px] absolute right-[16px] top-[16px] group"
              onClick={() => setTimeout(() => setClaimFailModel(false), 300)}>
              <Close className="block group-active:hidden" />
              <CloseActive className="hidden group-active:block" />
            </div>
            <div className="w-full flex flex-col py-[20px]">
              <div className="!font-chillPixels pt-[20px] text-[#E0373E] text-[14px]">Claim failed!</div>
              <div className="pt-[16px] text-[12px] leading-5">
                <p className="!font-chillPixels">
                  {getOmittedStr(fullAddress, OmittedType.ADDRESS)} has insufficient {getType(info?.rewardType)}{' '}
                  balance, not enough to cover the gas fee.
                </p>
                <p className="!font-chillPixels">Please use ETransfer to top up {getType(info?.rewardType)}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropsDetail;
