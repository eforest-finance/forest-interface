import React, { ReactNode, useCallback, useEffect, useState, useMemo } from 'react';
import Modal from 'baseComponents/Modal';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
// import NftInfoListCard, { INftInfoListCard } from 'components/NftInfoListCard';
import ItemInfoList, { INftInfoListCard } from 'components/ItemInfoCard/list';

import Loading from 'components/Loading';
import { transactionPending } from 'constants/promptMessage';
import styles from './styles.module.css';
import Close from 'assets/images/v2/close.svg';
import LoadingXS from './Loading';

import { Divider, Badge, Modal as AntdModal } from 'antd';
import { useBalance } from 'components/Header/hooks/useBalance';
import { divDecimals } from 'utils/calculate';

interface IProps {
  title?: string;
  list: INftInfoListCard[];
  buttonConfig?:
    | {
        btnText?: string;
        onConfirm?: Function;
      }[]
    | false;
  initialization?: <T, R>(params?: T) => Promise<void | R>;
  onClose?: <T>(params?: T) => void;
}

function CancelListModal({ title, buttonConfig, initialization, onClose, list }: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { aelfInfo, walletInfo } = useGetState();

  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(true);
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const { onGetBalance } = useBalance({ symbol: 'ELF', chain: aelfInfo?.curChain });

  const amount = useMemo(() => {
    return list.reduce((acc, cur) => {
      acc += cur?.number || 0;
      return acc;
    }, 0);
  }, [list]);

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
        await initialization();
        setLoading(false);
        return;
      } catch (error) {
        setShowRetryBtn(true);
        setLoading(false);
        return;
      }
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

  useEffect(() => {
    if (modal.visible) {
      getBalance();
    }
    return () => {
      setShowRetryBtn(false);
    };
  }, [modal.visible, title, buttonConfig, initialization, onClose]);

  const ModalC = useMemo(() => {
    return isSmallScreen ? AntdModal : Modal;
  }, [modal.visible, isSmallScreen]);

  return (
    <ModalC
      title={
        <div className={styles.modalTitle}>
          {title}
          {!!amount && amount > 0 && <Badge count={`${amount}`} />}
        </div>
      }
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
      footer={
        <div className="px-[24px] w-full h-full flex flex-col items-start relative">
          <div className="mdTW:text-xl text-[18px] font-medium text-textPrimary">Go to your wallet</div>
          <div className="mdTW:mt-[16px] text-[14px] text-textSecondary ">
            You'll be asked to approve this transaction from your wallet.
          </div>
        </div>
      }>
      <div className="w-full h-full flex flex-col relative">
        <ItemInfoList list={list} />
        {!isSmallScreen && <Divider className="my-[24px] mdTW:my-[32px]" />}
      </div>
    </ModalC>
  );
}

export default NiceModal.create(CancelListModal);
