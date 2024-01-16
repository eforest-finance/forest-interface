import { Menu } from 'antd';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

import Account from 'assets/images/account.svg';
import Setting from 'assets/images/setting.svg';
import Logout from 'assets/images/logout.svg';
import MyCollection from 'assets/images/myCollection.svg';
import { useContractConnect } from 'hooks/useContractConnect';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function AccountMenu() {
  const nav = useRouter();
  const { logout } = useContractConnect();
  const { isLogin, login } = useCheckLoginAndToken();
  console.log('isLogin accountMenu', isLogin);

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
        <AuthNavLink to="/account#Collected">
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
        <AuthNavLink to={'/my-collections'}>
          <div className={styles['nav-icon']}>
            <MyCollection />
          </div>
          My Collections
        </AuthNavLink>
      ),
      key: 'myCollection',
    },
    {
      label: (
        <a onClick={onNavigateSettings}>
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
      items={
        isLogin
          ? [
              ...items,
              {
                label: (
                  <div
                    className="flex items-center justify-center"
                    onClick={() => {
                      logout();
                    }}>
                    <div className={styles['nav-icon']}>
                      <Logout />
                    </div>
                    Log Out
                  </div>
                ),
                key: 'logOut',
              },
            ]
          : items
      }></Menu>
  );
}
