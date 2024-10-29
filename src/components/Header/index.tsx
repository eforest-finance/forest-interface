import { Badge, Drawer, Layout, Menu, Space, Button as AntdButton, Avatar, Collapse } from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AccountMenu from './components/AccountMenu';
import WalletMenu from './components/WalletMenu';
import WalletIcon from 'assets/images/v2/wallet-02.svg';

import { WalletActionSheet } from './components/WalletDropdown';

import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../../hooks/useTheme';

import Logo from 'assets/images/night/forestLogo.svg';

import LogoLight from 'assets/images/light/forestLogo.svg';
import Frame from 'assets/images/Frame.svg';
import Close from 'assets/images/v2/clear_icon.svg';
import Bell from 'assets/images/v2/bell.svg';
import DefalutIcon from 'assets/images/icon_default.png';

import ELFICon from 'assets/images/explore/aelf.svg';

import './style.css';
import styles from './style.module.css';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';
import { useContractConnect } from 'hooks/useContractConnect';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import React from 'react';
import { isPortkeyApp } from 'utils/isMobile';
import DropMenu from 'baseComponents/DropMenu';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { hideHeaderPage } from 'constants/common';
// import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

import useGetState from 'store/state/getState';
import { useUpdateEffect } from 'ahooks';
import { fetchMessageList } from 'api/fetch';
import { IMessage } from 'api/types';
import { NotificationList } from './components/NotificationList';
import useReceiveNotification from './hooks/useReceiveNotification';
import Image from 'next/image';
import useUserInfo from 'hooks/useUserInfo';
import { SupportedELFChainId } from 'constants/chain';
import { divDecimals } from 'utils/calculate';
import { formatTokenPrice } from 'utils/format';

import { useBalance } from './hooks/useBalance';
import { dispatch } from 'store/store';
import useTokenData from 'hooks/useTokenData';
import { setMainBalance, setSideBalance } from 'store/reducer/balance';
import clsx from 'clsx';

const { Panel } = Collapse;

function Header() {
  const [theme, changeTheme] = useTheme();
  const nav = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname?.split('/')?.[1] === '';

  const { logout } = useContractConnect();
  const { isLogin, login } = useCheckLoginAndToken();
  const { isSmallScreen } = useSelector(selectInfo);
  const [visible, setVisible] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);

  const [childVisible, setChildVisible] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);
  const [messagePageQuery, setMessagePageQuery] = useState({
    skipCount: 0,
    maxResultCount: 100,
  });
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const { aelfInfo, walletInfo } = useGetState();
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const { notifications } = useReceiveNotification(walletInfo.address);
  const { data: sideBalance = 0, run } = useBalance({ symbol: 'ELF', chain: aelfInfo?.curChain });
  const { data: mainBalance = 0, run: runMainChain } = useBalance({
    symbol: 'ELF',
    chain: SupportedELFChainId.MAIN_NET,
  });

  const rate = useTokenData();

  const [headerTheme, setHeaderTheme] = useState(false);

  console.log('sideBalance:111111', sideBalance);

  useEffect(() => {
    dispatch(setSideBalance(sideBalance));
    dispatch(setMainBalance(mainBalance));
  }, [sideBalance, mainBalance]);

  // const { walletType } = useWebLogin();
  const hidden = useMemo(() => {
    const path = pathname?.split('/')?.[1];
    if (hideHeaderPage.includes(path)) {
      return true;
    }
    return false;
  }, [pathname]);

  const showDrawer = () => {
    setVisible(true);
  };
  const showChildDrawer = async () => {
    if (isLogin) {
      setChildVisible(true);
    } else {
      login({});
    }
  };

  const showNotification = async () => {
    if (isLogin) {
      setNotificationModalVisible(true);
    } else {
      login({});
    }
  };
  const onClose = () => {
    setTimeout(() => {
      setVisible(false);
      setChildVisible(false);
      setNotificationModalVisible(false);
    }, 10);
  };
  const onChildClose = () => {
    setTimeout(() => {
      setChildVisible(false);
    }, 10);
  };
  const onNavigateSettings = async () => {
    login({
      callBack: () => {
        nav.push('/settings');
      },
    });
  };

  const handleLogin = () => {
    login();
  };

  const getMessageList = async () => {
    const { items, totalCount } = await fetchMessageList(messagePageQuery);
    setMessageList(items);
  };

  useUpdateEffect(() => {
    onClose();
  }, [pathname]);

  useEffect(() => {
    if (isLogin) {
      if (walletInfo.address || (notifications && notifications.hasChanged)) {
        getMessageList();
      }
    }
  }, [isLogin, walletInfo.address, notifications]);

  const ProjectLogo = !headerTheme && isHomePage ? <Logo /> : <LogoLight />;

  const unReadMessageCount = messageList.filter((itm) => itm.status === 0).length;

  const getUserInfo = useUserInfo();

  const {
    userInfo: { userInfo },
  } = useSelector((store) => store);
  const profileImage = userInfo.profileImage;

  useEffect(() => {
    if (isLogin) {
      getUserInfo();
      run();
      runMainChain();
    }
  }, [isLogin]);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      () => {
        const isWhite = document.body.scrollTop > 20;
        setHeaderTheme(isWhite);
        console.log(document.body.scrollTop);
      },
      true,
    );
  }, []);

  const toggleMessageReadStatus = () => {
    if (!messageList?.length) return;
    setMessageList(
      messageList.map((item) => ({
        ...item,
        status: 1,
      })),
    );
  };

  return (
    <Layout.Header
      className={`${isHomePage ? `${headerTheme ? styles['white-header'] : styles['black-header']}` : ''}  ${
        isHomePage && styles.homeHeader
      } top-0 z-[999] ${hidden && 'hidden'} ${
        isSmallScreen ? '!h-[62.4px] !bg-transparent bg-tr' : '!h-[80px]'
      } w-[100%] !p-0 !bg-transparent`}>
      <div
        className={`${styles['marketplace-header']} ${!isHomePage && 'fixed border border-solid border-lineBorder'} ${
          isSmallScreen ? styles['mobile-header-wrapper'] : ''
        }`}>
        <div className="flex  justify-center items-center">
          <Link href={'/'}>
            <div className={`flex justify-center items-center mr-[64px] ${styles['forest-logo']}`}>{ProjectLogo}</div>
          </Link>

          {!isSmallScreen && (
            <Space className="!gap-[85px]">
              <Space className="!gap-[40px] flex">
                <Link
                  href="/collections"
                  className={`${styles['nav-text']} ${pathname === '/collections' && styles['text-select']}`}>
                  Collections
                </Link>
                <DropMenu
                  getPopupContainer={(v) => v}
                  className={`${styles['nav-text']} ${styles.menu} ${
                    ['/create-item', '/create-collection', '/create-nft-ai'].includes(pathname) && styles['text-select']
                  }`}
                  overlay={
                    <Menu
                      items={[
                        {
                          label: (
                            <AuthNavLink
                              to={'/create-item'}
                              className={pathname === '/create-item' ? '!text-lineDash' : ''}>
                              Create an Item
                            </AuthNavLink>
                          ),
                          key: 'item',
                        },
                        {
                          label: (
                            <AuthNavLink
                              to={'/create-collection'}
                              className={pathname === '/create-collection' ? '!text-lineDash' : ''}>
                              Create a Collection
                            </AuthNavLink>
                          ),
                          key: 'Collection',
                        },
                        {
                          label: (
                            <AuthNavLink
                              to={'/create-nft-ai'}
                              className={pathname === '/create-nft-ai' ? '!text-lineDash' : ''}>
                              AI NFT Generator
                            </AuthNavLink>
                          ),
                          key: 'Collection',
                        },
                      ]}
                    />
                  }>
                  <span className="!cursor-default">Create</span>
                </DropMenu>
                {aelfInfo.showDropEntrance ? (
                  <Link
                    href="/drops"
                    className={`${styles['nav-text']} ${pathname === '/drops' && styles['text-select']}`}>
                    Drops
                  </Link>
                ) : null}
              </Space>
            </Space>
          )}
        </div>

        {isSmallScreen ? (
          <>
            <div className={` flex justify-center items-center`}>
              {!isLogin && (
                <AntdButton
                  className="border-0 mr-[24px] w-[68px] h-[32px] font-medium text-[12px] !rounded-md bg-brandNormal"
                  type="primary"
                  onClick={handleLogin}>
                  Login
                </AntdButton>
              )}

              {isLogin && !isPortkeyApp() && (
                <div className="flex items-center w-[32px] h-[32px] mr-[24px]">
                  <WalletIcon
                    className={`${styles.walletIcon} !w-[24px] !h-[24px] `}
                    onClick={() => {
                      setActionVisible(true);
                    }}
                  />
                </div>
              )}

              <Frame className={`${styles.frame} !w-[24px] !h-[24px] `} onClick={showDrawer} />
            </div>
            <Drawer
              zIndex={300}
              className="header-drawer"
              extra={<div className={`flex justify-center items-center font-semibold text-[20px] `}>Menu</div>}
              placement="right"
              closeIcon={<Close />}
              onClose={onClose}
              open={visible}>
              <div>
                <div className="h-[64px] flex items-center">
                  <Link href={'/collections'}>
                    <div className="text-[18px] text-textPrimary font-medium">Collections</div>
                  </Link>
                </div>
                <div className="text-[18px] h-[64px] font-medium flex items-center">Create</div>

                <div className="pl-[24px] h-[64px] flex items-center">
                  <Link href={'/create-item'}>
                    <div className="text-[18px] text-textPrimary font-medium">Create an Item</div>
                  </Link>
                </div>

                <div className="pl-[24px] h-[64px] flex items-center">
                  <Link href={'/create-collection'}>
                    <div className="text-[18px] text-textPrimary font-medium">Create a Collection</div>
                  </Link>
                </div>

                <div className="pl-[24px] h-[64px] flex items-center">
                  <Link href={'/create-nft-ai'}>
                    <div className="text-[18px] text-textPrimary font-medium">AI NFT Generator</div>
                  </Link>
                </div>

                {aelfInfo.showDropEntrance ? (
                  <div className="h-[64px] flex items-center">
                    <Link href={'/drops'}>
                      <div className="text-[18px] text-textPrimary font-medium">Drops</div>
                    </Link>
                  </div>
                ) : null}

                <div className="h-[64px] flex items-center">
                  <AuthNavLink to={`/account/${walletInfo.address}#Collected`}>
                    <div className="text-textPrimary font-medium text-[18px]">Profile</div>
                  </AuthNavLink>
                </div>

                <div className="menu-wrap">
                  <div className="menu-item" onClick={showNotification}>
                    <Badge dot={!!unReadMessageCount} count={unReadMessageCount} className=" !ml-0"></Badge>
                    <span>Notifications</span>
                    <Drawer
                      className="header-drawer child-drawer"
                      extra={<span className=" text-textPrimary font-semibold text-xl">Notifications</span>}
                      placement="right"
                      destroyOnClose={true}
                      onClose={() => {
                        toggleMessageReadStatus();
                        onClose();
                      }}
                      bodyStyle={{
                        paddingLeft: 0,
                        paddingRight: 0,
                      }}
                      open={notificationModalVisible}>
                      <NotificationList hiddenTitle={true} dataSource={messageList} />
                    </Drawer>
                  </div>

                  <p className="menu-item" onClick={onClose}>
                    <a onClick={onNavigateSettings}>
                      <span>Settings</span>
                    </a>
                  </p>
                </div>
                <div className="absolute h-1 w-1 translate-y-[100px]"></div>
                {!isPortkeyApp() && isLogin ? (
                  <div className="menu-wrap">
                    <p className="menu-item" onClick={() => logout()}>
                      <span>Log out</span>
                    </p>
                  </div>
                ) : null}
              </div>
            </Drawer>
          </>
        ) : (
          <>
            {isLogin ? (
              <Space className={styles['icon-btn-wrap']}>
                <DropMenu
                  overlay={<NotificationList dataSource={messageList} />}
                  dropMenuClassName=" border border-solid border-lineBorder w-[430px] bg-fillPageBg rounded-lg overflow-hidden"
                  placement="bottomCenter"
                  onOpenChange={(open: boolean) => {
                    console.log('onOpenChange', open);
                    if (!open && messageList.length) {
                      toggleMessageReadStatus();
                    }
                  }}
                  getPopupContainer={(v) => v}>
                  <span
                    className={`${styles['bell']} ${
                      (!isHomePage || headerTheme) && 'border border-solid border-lineBorder'
                    }`}>
                    <Bell className={` !w-[24px] !h-[24px]`} />
                  </span>
                </DropMenu>
                <DropMenu
                  className=""
                  trigger={['hover']}
                  open={walletVisible}
                  // open={true}
                  destroyPopupOnHide={true}
                  getPopupContainer={(v) => v}
                  onOpenChange={(flag) => setWalletVisible(flag)}
                  overlay={<WalletMenu />}
                  placement="bottomRight">
                  <div
                    className={clsx(
                      styles['balance'],
                      (!isHomePage || headerTheme) && 'border border-solid border-lineBorder',
                    )}>
                    <ELFICon className="mr-[12px] w-[24px] h-[24px] justify-center items-center" />
                    <span className="text-[16px] font-medium">
                      {formatTokenPrice(divDecimals(sideBalance, 8).valueOf())} ELF
                    </span>
                  </div>
                </DropMenu>
                <DropMenu overlay={<AccountMenu />} placement="bottomRight" getPopupContainer={(v) => v}>
                  <span
                    className={`cursor-pointer  justify-center items-center flex w-[48px] h-[48px] rounded-lg ${
                      (!isHomePage || headerTheme) && 'border border-solid border-lineBorder'
                    }`}>
                    {profileImage ? (
                      <div className=" relative !w-[24px] !h-[24px] justify-center items-center flex rounded-[50%] overflow-hidden !bg-fillHoverBg">
                        <Avatar size={24} src={profileImage} />
                      </div>
                    ) : (
                      <Image
                        src={DefalutIcon}
                        alt=""
                        className="!w-[24px] !h-[24px] rounded-md overflow-hidden !bg-fillHoverBg"
                      />
                    )}
                  </span>
                </DropMenu>
              </Space>
            ) : (
              <AntdButton
                className="border-0 w-[103px] h-[48px] font-medium text-[16px] !rounded-lg bg-brandNormal"
                type="primary"
                onClick={handleLogin}>
                Login
              </AntdButton>
            )}
          </>
        )}
      </div>
      <WalletActionSheet
        visible={actionVisible}
        onClose={() => {
          setActionVisible(false);
        }}
      />
    </Layout.Header>
  );
}

export default React.memo(Header);
