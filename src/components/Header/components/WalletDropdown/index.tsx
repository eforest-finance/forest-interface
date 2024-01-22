import { Collapse, Menu, MenuProps, Tooltip } from 'antd';
import Arrow from 'assets/images/arrow.svg';
import Photo from 'assets/images/photo.svg';
import UsernameMark from 'assets/images/usernameMark.svg';
import ELF from 'assets/images/ELF.png';
import USDT from 'assets/images/USDT.png';
import { BigNumber } from 'bignumber.js';
import Copy from 'components/Copy';
import useTokenData from 'hooks/useTokenData';
import { useEffect } from 'react';
import { divDecimals } from 'utils/calculate';
import { getUserInfo } from 'store/reducer/userInfo';

import styles from './style.module.css';
import { selectInfo } from 'store/reducer/info';
import Image from 'next/image';
import useUserInfo from 'hooks/useUserInfo';
import { useSelector } from 'react-redux';
import useGetState from 'store/state/getState';
import { useAELFBalances } from 'pagesComponents/Detail/hooks/useAELFBalances';
import { SupportedELFChainId } from 'constants/chain';
import { ZERO } from 'constants/misc';
import { OmittedType, getOmittedStr } from 'utils';
import React from 'react';

const BalanceCard = (option: {
  icon: string;
  name: string;
  rate: number;
  chainList: { name: string; balance: BigNumber }[];
}) => {
  const { icon, name, rate, chainList } = option;
  return (
    <Collapse className={styles['token-balance']} accordion expandIconPosition="end" expandIcon={() => <Arrow />}>
      <Collapse.Panel
        key={name}
        header={
          <div className={styles['panel-header']}>
            <Image className={styles['token-icon']} src={icon === 'elf' ? ELF : USDT} alt="icon" />
            <p className={styles.name}>{name}</p>
            <div className={styles.balance}>
              <p>{Number(chainList[0].balance.plus(chainList[1].balance).valueOf()).toFixed(3)}</p>
              <p>${(Number(chainList[0].balance.plus(chainList[1].balance).valueOf()) * rate).toFixed(2)} USD</p>
            </div>
          </div>
        }>
        {chainList &&
          chainList.map((chain) => {
            const { name, balance } = chain;
            return (
              <div key={name} className={styles['panel-body']}>
                <div className={styles['body-left']}>
                  <p>{option.name}</p>
                  <p>{name}</p>
                </div>
                <div className={styles['body-right']}>
                  <p>{balance.valueOf()}</p>
                  <p>${(Number(balance.valueOf()) * rate).toFixed(2)} USD</p>
                </div>
              </div>
            );
          })}
      </Collapse.Panel>
    </Collapse>
  );
};

function WalletDropdown({ onclick }: { onclick?: MenuProps['onClick'] }) {
  const { isSmallScreen } = useSelector(selectInfo);

  const getUser = useUserInfo();
  const userInfo = useSelector(getUserInfo);
  const rate = useTokenData();
  const { walletInfo, aelfInfo } = useGetState();
  const account = walletInfo?.address || '';

  const {
    balance: { balance: aelfBalance },
  } = useAELFBalances({ symbol: 'ELF', chain: SupportedELFChainId.MAIN_NET });
  const {
    balance: { balance: sideBalance },
  } = useAELFBalances({ symbol: 'ELF', chain: aelfInfo?.curChain });

  const totalBalance = divDecimals(aelfBalance.times(rate).plus(sideBalance?.times(rate) || ZERO), 8);

  const { profileImage: avatar, name: username } = userInfo || {};

  const items = [
    {
      label: (
        <div className={`${styles['user-info']} flex w-[100%]`}>
          {avatar ? (
            <Image
              className={`${styles.avatar} ${styles.border}`}
              width={48}
              height={48}
              src={`${avatar}`}
              alt="avatar"
            />
          ) : (
            <div className={styles.avatar}>
              <Photo />
            </div>
          )}
          <div className={`${styles['right-wrap']} flex-1`}>
            <p className={`${styles.username} flex`}>
              {getOmittedStr(username || ' Unnamed', OmittedType.NAME)}
              {username?.length > 10 && (
                <Tooltip placement="bottom" title={username}>
                  <div className={styles['username-mark']}>
                    <UsernameMark />
                  </div>
                </Tooltip>
              )}
            </p>
            <p className={styles['address']}>{getOmittedStr(userInfo?.fullAddress || '', OmittedType.ADDRESS)}</p>
          </div>
          {userInfo?.fullAddress && <Copy className={styles['copy-btn']} toCopy={userInfo.fullAddress} />}
        </div>
      ),
      key: 'account',
    },
    {
      label: (
        <div className={`${styles['balance-wrap']} w-[100%]`}>
          <div className={`${styles['total-balance']} ${styles['balance']}`}>
            <p className={styles.title}>Total balance</p>
            <p className={styles.value}>${Number(totalBalance.valueOf()).toFixed(2)} USD</p>
          </div>
          <BalanceCard
            icon="elf"
            name={'ELF'}
            rate={rate}
            chainList={[
              {
                name: 'MainChain AELF',
                balance: divDecimals(aelfBalance, 8),
              },
              {
                name: `SideChain ${aelfInfo?.curChain}`,
                balance: divDecimals(sideBalance, 8),
              },
            ]}
          />
        </div>
      ),
      key: 'balance',
    },
  ];

  useEffect(() => {
    if (account) {
      getUser();
    }
  }, [account]);

  return (
    <div>
      <Menu
        triggerSubMenuAction="click"
        className={`min-w-[404px] ${styles['wallet-menu']} ${isSmallScreen && styles['mobile-wallet-menu']}`}
        items={items}
        onClick={onclick}
      />
    </div>
  );
}

export default React.memo(WalletDropdown);
