import { Menu, MenuProps } from 'antd';
import { useMemo } from 'react';
import WalletDropdown from '../WalletDropdown';
import styles from './style.module.css';

import Button from 'baseComponents/Button';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
export default function WalletMenu({ onclick }: { onclick?: MenuProps['onClick'] }) {
  const { isLogin, login } = useCheckLoginAndToken();

  const items = useMemo(
    () => [
      {
        key: 'account',
        label: (
          <div className={styles['account-tip']}>
            <p className="text-[var(--color-primary)] text-[20px] font-medium leading-[30px]">Connect your wallet</p>
          </div>
        ),
      },
      {
        key: 'settings',
        label: (
          <div className="w-[100%] py-[16px]">
            <Button onClick={() => login()} size="ultra" type="primary" className="!w-[100%]">
              Connect
            </Button>
          </div>
        ),
      },
    ],
    [login],
  );

  return !isLogin ? (
    <div>
      <Menu className={styles['unconnected-menu']} items={items} />
    </div>
  ) : (
    <WalletDropdown onclick={onclick} />
  );
}
