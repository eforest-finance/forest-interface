import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import BaseModal from 'baseComponents/Modal';
import { Modal as AntdModal } from 'antd';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { antdModal, useModal } from '@ebay/nice-modal-react';
import ItemInfoCard, { INftInfoListCard } from 'components/ItemInfoCard';

import Loading from 'components/Loading';
import { transactionPending } from 'constants/promptMessage';
import styles from './styles.module.css';
import Close from 'assets/images/v2/close.svg';
import LoadingXS from './Loading';

import { Divider } from 'antd';
import { useBalance } from 'components/Header/hooks/useBalance';
import { divDecimals } from 'utils/calculate';
import { formatTokenPrice } from 'utils/format';

interface IProps {
  title?: string;
  nftInfo: INftInfoListCard;
  amount: number;
  buttonConfig?:
    | {
        btnText?: string;
        onConfirm?: Function;
      }[]
    | false;
  initialization?: <T, R>(params?: T) => Promise<void | R>;
  onClose?: <T>(params?: T) => void;
  showBalance?: boolean;
}

function ApproveModal({ title, nftInfo, buttonConfig, initialization, showBalance, onClose, amount = 1 }: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { aelfInfo, walletInfo } = useGetState();

  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(true);
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const etransferUrl = aelfInfo.etransferUrl;

  const { onGetBalance } = useBalance({ symbol: 'ELF', chain: aelfInfo?.curChain });

  useEffect(() => {
    if (modal.visible) {
      onConfirm();
    }
    return () => {
      setShowRetryBtn(false);
    };
  }, [modal.visible, initialization]);

  const onConfirm: (onClick?: Function) => void = async (onClick) => {
    if (onClick) {
      try {
        await onClick();
        return;
      } catch (error) {
        setShowRetryBtn(true);
        setLoading(false);
        return;
      }
    } else if (initialization) {
      try {
        setLoading(true);

        if (showBalance) {
          const balanceBG = await onGetBalance();
          const bc = divDecimals(balanceBG, 8).valueOf();
          const newBalance = Number(bc);
          setBalance(newBalance);

          if (newBalance >= nftInfo?.listingPrice * amount) {
            await initialization();
          }
        } else {
          await initialization();
        }
        setLoading(false);

        return;
      } catch (error) {
        setLoading(false);
        return;
      }
    }
  };

  const defaultButtonConfig = [
    {
      btnText: 'Try again',
      onConfirm,
    },
  ];

  const onRetry = async (onClick?: Function) => {
    try {
      setLoading(true);
      await onConfirm(onClick);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const getBalance = async () => {
    // setLoading(true);
    const balanceBG = await onGetBalance();
    const bc = divDecimals(balanceBG, 8).valueOf();
    setBalance(Number(bc));
    // setLoading(false);
  };

  // useEffect(() => {
  //   if (modal.visible && showBalance) {
  //     getBalance();
  //   }
  //   return () => {
  //     setShowRetryBtn(false);
  //   };
  // }, [modal.visible, title, nftInfo, buttonConfig, initialization, onClose]);

  const Modal = useMemo(() => {
    return isSmallScreen ? AntdModal : BaseModal;
  }, [isSmallScreen]);

  return (
    <Modal
      title={<div>{title}</div>}
      open={modal.visible}
      className={styles.modal}
      width={550}
      closeIcon={
        loading ? (
          <LoadingXS />
        ) : (
          <div className={isSmallScreen ? '!h-[86px] flex items-center justify-center' : ''}>
            <Close />
          </div>
        )
      }
      onOk={() => onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={null}>
      <div className="w-full h-full flex flex-col relative">
        <div className="mt-0">
          <ItemInfoCard {...nftInfo} />
        </div>
        <Divider className="my-[24px] mdl:my-[32px]" />

        {!showBalance || loading || balance >= nftInfo?.listingPrice * amount ? (
          <div>
            <div className="text-[16px] font-medium text-textPrimary">Go to your wallet</div>
            <div className="mt-[16px] text-textSecondary text-[14px]">
              You'll be asked to approve this transaction from your wallet.
            </div>
          </div>
        ) : (
          <div className="">
            <div className="flex justify-between">
              <div className="text-textSecondary text-[16px]">Your ELF Balance</div>
              <div className="flex flex-col">
                <span className="text-[16px] text-textPrimary">{formatTokenPrice(balance)} ELF</span>
                <span className="text-error text-[14px]">Insufficient balance</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button
                className="mt-[60px] text-[16px] font-semibold w-[256px] h-[56px]"
                type="primary"
                onClick={() => {
                  window.open(etransferUrl);
                }}>
                Get ELF
              </Button>
            </div>
          </div>
        )}

        {/* 
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
            <div className="p-[24px] w-max h-max bg-fillMask2 rounded-[16px]">
              <Loading imgStyle="w-[48px] h-[48px]" className="w-[48px] !h-[48px] !pb-0" />
            </div>
          </div>
        )} */}
      </div>
    </Modal>
  );
}

export default NiceModal.create(ApproveModal);
