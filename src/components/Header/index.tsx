import { Drawer, Layout, Menu, Space } from 'antd';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import AccountMenu from './components/AccountMenu';
import WalletMenu from './components/WalletMenu';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../../hooks/useTheme';

import User from 'assets/images/user.svg';
import Wallet from 'assets/images/wallet.svg';
import Night from 'assets/images/night.svg';
import Light from 'assets/images/light.svg';
import Logo from 'assets/images/night/forestLogo.svg';
import LogoLight from 'assets/images/light/forestLogo.svg';
import Frame from 'assets/images/Frame.svg';
import Explore from 'assets/images/explore.svg';
import Create from 'assets/images/create.svg';
import CreateCollection from 'assets/images/CreateCollection.svg';
import Profile from 'assets/images/profile.svg';
import MyCollection from 'assets/images/myCollection.svg';
import Setting from 'assets/images/setting.svg';
import Logout from 'assets/images/logoutMobile.svg';

import './style.css';
import styles from './style.module.css';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';
import { useContractConnect } from 'hooks/useContractConnect';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import React from 'react';
import { isPortkeyApp } from 'utils/isMobile';
import Button from 'baseComponents/Button';
import DropMenu from 'baseComponents/DropMenu';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { hideHeaderPage } from 'constants/common';
function Header() {
  const [theme, changeTheme] = useTheme();
  const nav = useRouter();
  const pathname = usePathname();

  const { logout } = useContractConnect();
  const { isLogin, login } = useCheckLoginAndToken();
  const { isSmallScreen } = useSelector(selectInfo);
  const [visible, setVisible] = useState(false);
  const [childVisible, setChildVisible] = useState(false);
  const [walletVisible, setWalletVisible] = useState(false);

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
  const onClose = () => {
    setTimeout(() => {
      setVisible(false);
      setChildVisible(false);
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

  const ProjectLogo = theme === 'dark' ? <Logo /> : <LogoLight />;

  return (
    <Layout.Header
      className={`${hidden && 'hidden'} ${
        isSmallScreen ? '!h-[62.4px] !bg-transparent bg-tr' : '!h-[80px]'
      } w-[100%] !p-0 !bg-transparent`}>
      <div className={`${styles['marketplace-header']} ${isSmallScreen ? styles['mobile-header-wrapper'] : ''}`}>
        <Link href={'/'}>
          <div className={`flex justify-center items-center ${styles['forest-logo']}`}>{ProjectLogo}</div>
        </Link>
        {isSmallScreen ? (
          <>
            <div className={`${styles.frame} flex justify-center items-center`} onClick={showDrawer}>
              <Frame />
            </div>
            <Drawer
              className="header-drawer"
              extra={
                <div className={`flex justify-center items-center ${styles['mobile-forest-logo']}`}>{ProjectLogo}</div>
              }
              placement="right"
              onClose={onClose}
              open={visible}>
              <div>
                <div className="menu-wrap" onClick={onClose}>
                  <p className="menu-item">
                    <Link href={'/collections'}>
                      <Explore /> <span>Explore</span>
                    </Link>
                  </p>
                  <p className="menu-item">
                    <AuthNavLink to="/create-item" className="create-icon">
                      <Create />
                      <span>Create an Item</span>
                    </AuthNavLink>
                  </p>
                  <p className="menu-item">
                    <AuthNavLink to="/create-collection" className="create-collection-icon">
                      <CreateCollection />
                      <span>Create a Collection</span>
                    </AuthNavLink>
                  </p>
                </div>
                <div className="menu-wrap">
                  <p className="menu-item" onClick={onClose}>
                    <AuthNavLink to={'/account'}>
                      <Profile /> <span>Profile</span>
                    </AuthNavLink>
                  </p>
                  <p className="menu-item" onClick={onClose}>
                    <AuthNavLink to={'/my-collections'}>
                      <MyCollection /> <span>My Collections</span>
                    </AuthNavLink>
                  </p>
                  <p className="menu-item" onClick={showChildDrawer}>
                    <Wallet /> <span>Wallet</span>
                    <Drawer
                      className="header-drawer child-drawer"
                      extra={
                        <div className={`flex justify-center items-center ${styles['forest-logo']}`}>{ProjectLogo}</div>
                      }
                      placement="right"
                      destroyOnClose={true}
                      onClose={onClose}
                      open={childVisible}>
                      <h1 className="drawer-title font-semibold">Wallet</h1>
                      <WalletMenu />
                      <div className="return-wrap">
                        <Button type="default" onClick={onChildClose}>
                          Return
                        </Button>
                      </div>
                    </Drawer>
                  </p>
                  <p className="menu-item" onClick={onClose}>
                    <a onClick={onNavigateSettings}>
                      <Setting /> <span>Settings</span>
                    </a>
                  </p>
                  <p
                    className="menu-item"
                    onClick={() => {
                      changeTheme(theme === 'dark' ? 'light' : 'dark');
                    }}>
                    <a>
                      {theme !== 'dark' ? (
                        <div className="header-theme-btn flex items-center">
                          <Night />
                        </div>
                      ) : (
                        <div className="header-theme-btn flex items-center">
                          <Light />
                        </div>
                      )}
                      <span>{theme !== 'dark' ? 'Night' : 'Daytime'}</span>
                    </a>
                  </p>
                </div>
                <div className="absolute h-1 w-1 translate-y-[100px]"></div>
                {!isPortkeyApp() && isLogin ? (
                  <div className="menu-wrap">
                    <p className="menu-item" onClick={() => logout()}>
                      <Logout />
                      <span>Log out</span>
                    </p>
                  </div>
                ) : null}
              </div>
            </Drawer>
          </>
        ) : (
          <Space className="!gap-[85px]">
            <Space className="!gap-[40px] flex">
              <Link
                href="/collections"
                className={`${styles['nav-text']} ${pathname === '/collections' && styles['text-select']}`}>
                Explore
              </Link>
              <DropMenu
                getPopupContainer={(v) => v}
                className={`${styles['nav-text']} ${pathname === '/create' && styles['text-select']}`}
                overlay={
                  <Menu
                    items={[
                      { label: <AuthNavLink to={'/create-item'}>Create an Item</AuthNavLink>, key: 'item' },
                      {
                        label: <AuthNavLink to={'/create-collection'}>Create a Collection</AuthNavLink>,
                        key: 'Collection',
                      },
                    ]}
                  />
                }>
                <span className="!cursor-default">Create</span>
              </DropMenu>
            </Space>

            <Space className={styles['icon-btn-wrap']}>
              <DropMenu overlay={<AccountMenu />} placement="bottomRight" getPopupContainer={(v) => v}>
                <span className={`${styles['header-account-btn']} flex w-[40px] h-[40px]`}>
                  <User />
                </span>
              </DropMenu>
              <DropMenu
                className={styles['header-wallet-custom']}
                trigger={['hover']}
                open={walletVisible}
                destroyPopupOnHide={true}
                getPopupContainer={(v) => v}
                onOpenChange={(flag) => setWalletVisible(flag)}
                overlay={<WalletMenu />}
                placement="bottomRight">
                <span className={`${styles['header-wallet-btn']} flex w-[40px] h-[40px]`}>
                  <Wallet />
                </span>
              </DropMenu>
              <div
                onClick={() => {
                  changeTheme(theme === 'dark' ? 'light' : 'dark');
                }}>
                {theme !== 'dark' ? (
                  <div className={`${styles['header-theme-btn']} flex w-[40px] h-[40px]`}>
                    <Night />
                  </div>
                ) : (
                  <div className={`${styles['header-theme-btn']} flex w-[40px] h-[40px]`}>
                    <Light />
                  </div>
                )}
              </div>
            </Space>
          </Space>
        )}
      </div>
    </Layout.Header>
  );
}

export default React.memo(Header);
