import { Menu } from 'antd';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

import Account from 'assets/images/v2/user.svg';
import Setting from 'assets/images/v2/settings.svg';
import Logout from 'assets/images/v2/logout.svg';
import { useContractConnect } from 'hooks/useContractConnect';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import useGetState from 'store/state/getState';

export default function AccountMenu() {
  const nav = useRouter();
  const { logout } = useContractConnect();
  const { isLogin, login } = useCheckLoginAndToken();
  console.log('isLogin accountMenu', isLogin);

  const { walletInfo } = useGetState();

  const onNavigateSettings = () => {
    login({
      callBack: () => {
        nav.push('/settings');
      },
    });
  };

  const items = [
    {
      label: (
        <AuthNavLink to={`/account/${walletInfo.address}#Collected`}>
          <div className={styles['nav-icon']}>
            <Account />
          </div>
          Profile
        </AuthNavLink>
      ),
      key: 'account',
    },
    {
      label: (
        <a className="" onClick={onNavigateSettings}>
          <div className={styles['nav-icon']}>
            <Setting />
          </div>
          Settings
        </a>
      ),
      key: 'settings',
    },
  ];
  return (
    <Menu
      className={styles.menu}
      items={
        isLogin
          ? [
              ...items,
              {
                label: (
                  <div
                    className="flex items-center justify-center !hover:text-textPrimary"
                    onClick={() => {
                      logout();
                    }}>
                    <div className={styles['nav-icon']}>
                      <Logout />
                    </div>
                    <span className="!hover:text-textPrimary !text-[var(--color-primary)]">Log Out</span>
                  </div>
                ),
                key: 'logOut',
              },
            ]
          : items
      }></Menu>
  );
}
