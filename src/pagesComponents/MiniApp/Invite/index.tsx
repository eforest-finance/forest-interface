import styles from '../style.module.css';
import Footer from '../components/Footer';
import Title from 'assets/images/miniApp/invite/title.svg';
import Box from 'assets/images/miniApp/invite/box.png';
import Invitation from 'assets/images/miniApp/invite/invitation.svg';

import RefreshCenter from 'assets/images/miniApp/invite/refreshCenter.svg';
import InviteBtnSm from 'assets/images/miniApp/invite/InviteBtnSm.png';
import Copy from 'assets/images/miniApp/invite/copy.svg';
import Person from 'assets/images/miniApp/invite/person.svg';
import ListBg from 'assets/images/miniApp/invite/listBg.png';
import Point from 'assets/images/miniApp/invite/point.svg';

import BoxBg from 'assets/images/miniApp/invite/boxBgs.png';

import noData from 'assets/images/miniApp/invite/noData.png';
import Cat from 'assets/images/miniApp/invite/cat.svg';
import Cloud from 'assets/images/miniApp/rules/cloud.png';

import { useSelector } from 'react-redux';
import { getUserInfo } from 'store/reducer/userInfo';

import { fetchMiniAppFriendList } from 'api/fetch';
import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { TelegramPlatform } from '@portkey/did-ui-react';
import useTelegram from 'hooks/useTelegram';
import { store } from 'store/store';
import { shareText } from './config';

const cloudStyle = {
  backgroundImage: `url(${Cloud.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: '0 50px',
};

const BoxStyle = {
  backgroundImage: `url(${Box.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px #A09DF7)',
};

const SmallBoxStyle = {
  backgroundImage: `url(${BoxBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const titleStyle = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#5C489D',
  color: '#fff',
  letterSpacing: '-4.56px',
};

const InviteBtnSmStyle = {
  backgroundImage: `url(${InviteBtnSm.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px rgba(0, 0, 0, 0.20))',
};

const textBtnStyle = {
  WebkitTextStrokeWidth: '1px',
  WebkitTextStrokeColor: '#6B4700',
  color: '#fff',
  letterSpacing: '-2px',
};

const listBg = {
  backgroundImage: `url(${ListBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const noDataBg = {
  backgroundImage: `url(${noData.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  filter: 'drop-shadow(0px 4px 0px #A09DF7)',
};

const Invite = () => {
  const userInfo = useSelector(getUserInfo);

  console.log('userInfo', userInfo);

  const { address } = userInfo;

  const [list, setList] = useState([]);

  const getFriendList = async () => {
    if (address) {
      setAnimation(true);
      const list: any = await fetchMiniAppFriendList({ address });
      setList(list);
      setTimeout(() => {
        setAnimation(false);
      }, 500);
    }
  };

  useEffect(() => {
    getFriendList();
  }, [address]);

  const cmsInfo = store.getState().aelfInfo.aelfInfo;
  const telegram: any = TelegramPlatform.getInitData();
  const { username } = TelegramPlatform.isTelegramPlatform() && JSON.parse(telegram?.user);

  const shareLink = useMemo(() => {
    const encodeParams = encodeURIComponent(
      `${cmsInfo?.tgWebAppUrl}?startapp=address--${address}__type--${'treegame'}&text=${shareText}`,
    );
    return `https://t.me/share/url?url=${encodeParams}`;
  }, [cmsInfo.tgWebAppUrl, address]);

  const copyLink = useMemo(
    () => `${cmsInfo?.tgWebAppUrl}/?startapp=address--${address}__type--${'treegame'}&text=${shareText}`,
    [cmsInfo?.tgWebAppUrl, address],
  );

  const goToInvite = () => {
    TelegramPlatform?.getWebApp()?.openTelegramLink(shareLink);
  };

  const [animation, setAnimation] = useState(false);
  const { isInTelegram } = useTelegram();

  const isInTG = useMemo(() => {
    return isInTelegram();
  }, [isInTelegram]);

  useEffect(() => {
    if (isInTG) {
      const TG = TelegramPlatform.getTelegram();
      TG.WebApp.BackButton.hide();
    }
  }, [isInTG]);

  return (
    <div className={styles['mini-app']}>
      <div className="w-full min-h-screen text-center bg-[#C8C6FA]" style={cloudStyle}>
        <div className="pt-[48px]">
          <Title />
        </div>
        <div className="flex items-end justify-center mt-[24px] pb-[24px] gap-[8px] ">
          <div className={`w-[198px] h-[40px] relative group overflow-hidden ${styles.payBtn}`} onClick={goToInvite}>
            <div className={`w-[198px] h-[40px] block group-active:hidden ${styles.inviteBtnBg}`}></div>
            <div className={`w-[198px] h-[36px] mt-[4px] hidden group-active:block ${styles.inviteBtnBgActive}`}></div>
            <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
              <Person />
              <span className="text-[16px] leading-[19px] pl-[2px]" style={textBtnStyle}>
                invite friends
              </span>
            </div>
          </div>
          <div
            className={`w-[40px] h-[40px] relative group overflow-hidden ${styles.payBtn}`}
            onClick={() => {
              copy(copyLink);
              message.success('Copy successful');
            }}>
            <div className={`w-[40px] h-[40px] block group-active:hidden ${styles.inviteBtnBgSm}`}></div>
            <div className={`w-[40px] h-[36px] mt-[4px] hidden group-active:block ${styles.inviteBtnBgSmActive}`}></div>
            <div className="w-full h-full flex items-center justify-center gap-[4px] absolute top-0 left-1/2 -translate-x-1/2 group-active:top-[4px]">
              <Copy />
            </div>
          </div>
        </div>
        <div className="bg-[#AFADF8]">
          <div className="px-[16px]">
            <div className="w-full mt-[18px] p-[20px] pb-[40px]" style={BoxStyle}>
              <div className="flex items-center justify-center pt-[4px] pb-[20px]">
                <Cat />
                <span className={styles.inviteTitle}>How it works</span>
                <Cat />
              </div>
              <Invitation />
              <div
                className="text-[#5C489D] text-left text-[14px] p-[16px] pb-[30px] my-[16px] flex items-start gap-[10px]"
                style={SmallBoxStyle}>
                <div className="flex flex-col gap-[43px] mt-[6px] w-[2px] bg-[#B1A7D0]">
                  <Point className="-ml-[3px]" />
                  <Point className="-ml-[3px]" />
                  <Point className="-ml-[3px]" />
                </div>
                <div className="leading-5">
                  <div className="!font-chillPixels">Share your invitation link with your friends</div>
                  <div className="mt-[12px] !font-chillPixels">Your friend has joined and started playing Forest</div>
                  <div className="mt-[12px] !font-chillPixels">
                    You will receive <span className="text-[#FFA800] !font-chillPixels">3%</span> of the golden fruits
                    your friend harvests. Your friend will immediately receive
                    <span className="text-[#FFA800] !font-chillPixels">100</span> golden fruits.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-[24px] mb-[12px] px-[16px]">
            <div style={titleStyle} className="text-[24px]">
              your friends ({list.length})
            </div>
            <div
              className={`w-[36px] h-[40px] flex items-center justify-center relative group ${
                animation ? styles.animateBtnActive : styles.animateBtn
              }`}
              onClick={() => getFriendList()}>
              <div
                className={`w-[16px] h-[17px] absolute top-1/2 left-1/2 -translate-x-1/2 ${
                  animation ? '-translate-y-1/2' : '-translate-y-2/3'
                }`}>
                <RefreshCenter className={animation ? `${styles.animateRefresh}` : ''} />
              </div>
            </div>
          </div>
          <div className="px-[16px] pb-[120px]">
            <div
              className={`w-full mt-[12px] p-[24px] pb-[40px] text-[#5C489D] ${
                list.length > 0 && 'grid grid-cols-2 gap-[16px]'
              } text-[14px]`}
              style={list.length > 0 ? listBg : noDataBg}>
              {list.length > 0 ? (
                list.map((item, index) => {
                  return (
                    <span key={index} className="!font-chillPixels">
                      {item}
                    </span>
                  );
                })
              ) : (
                <div className="!font-chillPixels">You don't have any invitations yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Invite;
