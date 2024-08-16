import { Collapse, Menu, MenuProps, Divider, message, Tooltip } from 'antd';
import { ActionSheet } from 'antd-mobile';

import Arrow from 'assets/images/arrow.svg';
import Wallet from 'assets/images/v2/wallet-02.svg';

import ELF from 'assets/images/ELF.png';
import USDT from 'assets/images/USDT.png';
import { BigNumber } from 'bignumber.js';
import useTokenData from 'hooks/useTokenData';
import { useEffect, useRef, useState } from 'react';
import { divDecimals } from 'utils/calculate';
import { getUserBalance, getUserInfo } from 'store/reducer/userInfo';

import styles from './style.module.css';
import { selectInfo } from 'store/reducer/info';
import Image from 'next/image';
import useUserInfo from 'hooks/useUserInfo';
import { useSelector } from 'react-redux';
import useGetState from 'store/state/getState';
import { OmittedType, getOmittedStr } from 'utils';
import React from 'react';
import { WalletType, useWebLogin } from 'aelf-web-login';
import Button from 'baseComponents/Button';
import { useRouter } from 'next/navigation';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { useCopyToClipboard } from 'react-use';

function WalletActionSheet(props: any) {
  const { visible, onClose } = props;

  const userInfo = useSelector(getUserInfo);
  const { main: aelfBalance, side: sideBalance } = useSelector(getUserBalance);
  console.log('sideBalance:menu', sideBalance);

  const { walletInfo, aelfInfo, infoState } = useGetState();
  const rate = infoState.elfRate;

  const { walletType } = useWebLogin();
  const router = useRouter();

  const [sideTooltip, setSideTooltip] = useState('Copy');
  const [mainTooltip, setMainTooltip] = useState('Copy');

  const [, setCopied] = useCopyToClipboard();
  const actions = [
    {
      text: (
        <div className={`${styles['user-info']} flex w-[100%]`}>
          <Wallet />
          <span className="flex items-center pl-[8px] font-semibold text-[16px] !text-[var(--text-primary)] ">
            ELF Balance
          </span>
        </div>
      ),
      key: 'Balance',
    },
    {
      text: (
        <div className="flex pt-[16px] justify-between">
          <div className="text-[14px] font-medium !text-textPrimary">
            <div className="flex items-center">
              <span className="mr-[8px] inline-block w-[8px] h-[8px] bg-brandNormal rounded-[50%]" />
              <span className="!text-textPrimary">SideChain {aelfInfo?.curChain}</span>
            </div>
            <Tooltip
              overlayInnerStyle={{ borderRadius: '8px' }}
              overlayClassName={styles.toolTipWrapper}
              title={sideTooltip}
              color="white"
              onOpenChange={(visible) => {
                if (!visible) {
                  setSideTooltip('Copy');
                }
              }}>
              <div
                onClick={() => {
                  const address = userInfo?.fullAddress;
                  setCopied(address);
                  setSideTooltip('Copied');
                }}
                className="mt-[6px] w-[168px] h-[36px] cursor-pointer  hover:bg-fillHoverBg rounded-md flex  items-center">
                <p>{getOmittedStr(userInfo?.fullAddress || '', OmittedType.ADDRESS)}</p>
              </div>
            </Tooltip>
          </div>

          <div className="flex justify-center items-center flex-col text-[12px] font-medium">
            <div className="flex !text-textPrimary items-center w-full">
              <Image className="w-[16px] h-[16px] mr-[8px]" src={ELF} alt="icon" />
              <p className="text-[16px]">{formatTokenPrice(divDecimals(sideBalance, 8).valueOf())} ELF</p>
            </div>
            <div className="text-[12px] mt-[4px] text-textSecondary">
              ${formatTokenPrice(divDecimals(sideBalance, 8).times(rate))} USD
            </div>
          </div>
        </div>
      ),
      key: 'side',
    },
    {
      text: (
        <>
          <div className="flex pb-[16px] justify-between">
            <div className="text-[14px] font-medium text-textPrimary">
              <div className="flex items-center">
                <span className="mr-[8px] inline-block w-[8px] h-[8px] bg-black rounded-[50%]" />
                <span className="!text-textPrimary">MainChain AELF</span>
              </div>

              <Tooltip
                overlayInnerStyle={{ borderRadius: '8px' }}
                overlayClassName={styles.toolTipWrapper}
                title={mainTooltip}
                color="white"
                onOpenChange={(visible) => {
                  if (!visible) {
                    setSideTooltip('Copy');
                  }
                }}>
                <div
                  onClick={() => {
                    const address = `ELF_${walletInfo?.aelfChainAddress}_AELF`;
                    setCopied(address);
                    setMainTooltip('Copied');
                  }}
                  className="mt-[6px] w-[168px] h-[36px] cursor-pointer  hover:bg-fillHoverBg rounded-md flex justify-center items-center">
                  <p>{getOmittedStr(`ELF_${walletInfo?.aelfChainAddress}_AELF` || '', OmittedType.ADDRESS)}</p>
                </div>
              </Tooltip>
            </div>

            <div className="flex justify-center items-center flex-col text-[16px] font-medium">
              <div className="flex text-textPrimary  items-center w-full">
                <Image className="w-[16px] h-[16px] mr-[8px]" src={ELF} alt="icon" />
                <p>{formatTokenPrice(divDecimals(aelfBalance, 8).valueOf())} ELF</p>
              </div>
              <div className="text-[12px] mt-[4px] text-textSecondary">
                ${formatTokenPrice(divDecimals(aelfBalance, 8).times(rate))} USD
              </div>
            </div>
          </div>
          <div>
            {walletType === WalletType.portkey && (
              <Button
                isFull
                size="ultra"
                className={`mb-[24px] ${styles['view-asset-btn']}`}
                onClick={() => {
                  router.push('/asset');
                }}>
                My Assets
              </Button>
            )}
          </div>
        </>
      ),
      key: 'mainChain',
    },
  ];
  return <ActionSheet popupClassName={styles.actionSheet} visible={visible} actions={actions} onClose={onClose} />;
}

function WalletDropdown({ onclick }: { onclick?: MenuProps['onClick'] }) {
  const { isSmallScreen } = useSelector(selectInfo);

  const getUser = useUserInfo();
  const userInfo = useSelector(getUserInfo);
  const { walletInfo, aelfInfo, infoState } = useGetState();
  const account = walletInfo?.address || '';
  const { walletType } = useWebLogin();
  const router = useRouter();

  const rate = infoState.elfRate;

  const { main: aelfBalance, side: sideBalance } = useSelector(getUserBalance);
  console.log('sideBalance:menu', sideBalance);

  const [sideTooltip, setSideTooltip] = useState('Copy');
  const [mainTooltip, setMainTooltip] = useState('Copy');

  const [, setCopied] = useCopyToClipboard();

  const items = [
    {
      label: (
        <div className={`${styles['user-info']} flex w-[100%]`}>
          <Wallet />
          <span className="flex items-center pl-[8px] font-semibold text-[16px] !text-[var(--text-primary)] ">
            ELF Balance
          </span>
        </div>
      ),
      key: 'account',
    },
    {
      label: (
        <div className={`${styles['balance-wrap']} w-[100%]`}>
          <div className="flex pt-[16px] justify-between">
            <div className="text-[14px] font-medium text-textPrimary">
              <div className="">
                <span className="mr-[8px] inline-block w-[8px] h-[8px] bg-brandNormal rounded-[50%]" />
                <span className="!text-textPrimary">SideChain {aelfInfo?.curChain}</span>
              </div>
              <Tooltip
                overlayInnerStyle={{ borderRadius: '8px' }}
                overlayClassName={styles.toolTipWrapper}
                title={sideTooltip}
                color="white"
                onOpenChange={(visible) => {
                  if (!visible) {
                    setSideTooltip('Copy');
                  }
                }}>
                <div
                  onClick={() => {
                    const address = userInfo?.fullAddress;
                    setCopied(address);
                    setSideTooltip('Copied');
                  }}
                  className="mt-[6px] w-[168px] h-[36px] cursor-pointer  hover:bg-fillHoverBg rounded-md flex justify-center items-center">
                  <p>{getOmittedStr(userInfo?.fullAddress || '', OmittedType.ADDRESS)}</p>
                </div>
              </Tooltip>
            </div>

            <div className="flex justify-center items-end flex-col text-[14px] font-medium">
              <div className="flex text-textPrimary items-center w-full">
                <Image className="w-[16px] h-[16px] mr-[8px]" src={ELF} alt="icon" />
                <p className="text-[16px]">{formatTokenPrice(divDecimals(sideBalance, 8).valueOf())} ELF</p>
              </div>
              <div className="text-textSecondary">${formatTokenPrice(divDecimals(sideBalance, 8).times(rate))} USD</div>
            </div>
          </div>
          <Divider orientationMargin={'18px'} />
          <div className="flex pb-[16px] justify-between">
            <div className="text-[14px] font-medium text-textPrimary">
              <div className="">
                <span className="mr-[8px] inline-block w-[8px] h-[8px] bg-black rounded-[50%]" />
                <span className="!text-textPrimary">MainChain AELF</span>
              </div>

              <Tooltip
                overlayInnerStyle={{ borderRadius: '8px' }}
                overlayClassName={styles.toolTipWrapper}
                title={mainTooltip}
                color="white"
                onOpenChange={(visible) => {
                  if (!visible) {
                    setSideTooltip('Copy');
                  }
                }}>
                <div
                  onClick={() => {
                    const address = `ELF_${walletInfo?.aelfChainAddress}_AELF`;
                    setCopied(address);
                    setMainTooltip('Copied');
                  }}
                  className="mt-[6px] w-[168px] h-[36px] cursor-pointer  hover:bg-fillHoverBg rounded-md flex justify-center items-center">
                  <p>{getOmittedStr(`ELF_${walletInfo?.aelfChainAddress}_AELF` || '', OmittedType.ADDRESS)}</p>
                </div>
              </Tooltip>
            </div>

            <div className="flex justify-center items-end flex-col text-[14px] font-medium">
              <div className="flex text-textPrimary  items-center w-full">
                <Image className="w-[16px] h-[16px] mr-[8px]" src={ELF} alt="icon" />
                <p className="text-[16px]">{formatTokenPrice(divDecimals(aelfBalance, 8).valueOf())} ELF</p>
              </div>
              <div className="text-textSecondary">${formatTokenPrice(divDecimals(aelfBalance, 8).times(rate))} USD</div>
            </div>
          </div>
          {walletType === WalletType.portkey && (
            <Button
              isFull
              size="ultra"
              className={`mb-[24px] ${styles['view-asset-btn']}`}
              onClick={() => {
                router.push('/asset');
              }}>
              My Assets
            </Button>
          )}
        </div>
      ),
      key: 'balance',
    },
  ];

  useEffect(() => {
    if (account) {
      getUser();
    }
  }, [account, getUser]);

  return (
    <div>
      <Menu
        className={`min-w-[404px] ${styles['wallet-menu']} ${isSmallScreen && styles['mobile-wallet-menu']}`}
        items={items}
        onClick={onclick}
      />
    </div>
  );
}

export { WalletActionSheet };

export default React.memo(WalletDropdown);
