import { useRouter, usePathname } from 'next/navigation';

import Home from 'assets/images/miniApp/home.svg';
import Friends from 'assets/images/miniApp/friends.svg';
import Drops from 'assets/images/miniApp/drops.svg';

import HomeText from 'assets/images/miniApp/footer/home.svg';
import FriendsText from 'assets/images/miniApp/footer/friends.svg';
import DropsText from 'assets/images/miniApp/footer/drops.svg';

import RightArrow from 'assets/images/miniApp/home/rightArrow.svg';

import LeftArrow from 'assets/images/miniApp/home/leftArrow.svg';
import { useEffect } from 'react';

const Footer = () => {
  const router = useRouter();

  const pathName = usePathname();

  const goToHome = () => {
    router.push('/mini-app');
  };

  const goToRules = () => {
    router.push('/mini-app/rules');
  };
  const goToInvite = () => {
    router.push('/mini-app/invite');
  };
  const goToDrops = () => {
    router.push('/mini-app/drops');
  };

  const style = {
    borderTop: ' 4px solid var(--BGC-P50, #D6D1E7)',
    background: '#F2F0F7',
    boxShadow: ' 0px -2px 0px 0px #B1A7D0',
  };
  const textStyle = {
    WebkitTextStrokeWidth: '1px',
    WebkitTextStrokeColor: 'rgba(92, 72, 157, 1)',
    marginTop: '4px',
  };

  return (
    <div className="w-full h-[72px] fixed left-0 bottom-0 bg-white" style={style}>
      <div className="w-full absolute -top-[30px] flex items-center justify-around">
        <div className="w-[80px] flex flex-col items-center" onClick={goToHome}>
          <Home />
          <div className="mt-[4px] flex items-center justify-center">
            {pathName === '/mini-app' && (
              <div className="flex items-center justify-center mr-[2px]">
                <RightArrow />
              </div>
            )}
            <HomeText />
            {pathName === '/mini-app' && (
              <div className="flex items-center justify-center ml-[2px]">
                <LeftArrow />
              </div>
            )}
          </div>
          {/* <span className="text-white" style={textStyle}>
            FOREST
          </span> */}
        </div>
        {/* <button onClick={goToRules}>rules</button> */}
        <div className="w-[80px] flex flex-col items-center" onClick={goToInvite}>
          <Friends />
          <div className="mt-[4px] flex items-center justify-center">
            {pathName === '/mini-app/invite' && (
              <div className="flex items-center justify-center mr-[2px]">
                <RightArrow />
              </div>
            )}
            <FriendsText />
            {pathName === '/mini-app/invite' && (
              <div className="flex items-center justify-center ml-[2px]">
                <LeftArrow />
              </div>
            )}
          </div>
          {/* <span className="text-white" style={textStyle}>
            Invite
          </span> */}
        </div>

        <div className="w-[80px] flex flex-col items-center" onClick={goToDrops}>
          <Drops />
          <div className="mt-[4px] flex items-center justify-center">
            {pathName === '/mini-app/drops' && (
              <div className="flex items-center justify-center mr-[2px]">
                <RightArrow />
              </div>
            )}
            <DropsText />
            {pathName === '/mini-app/drops' && (
              <div className="flex items-center justify-center ml-[2px]">
                <LeftArrow />
              </div>
            )}
          </div>
          {/* <span className="text-white" style={textStyle}>
            Drops
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
