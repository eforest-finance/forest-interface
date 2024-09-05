import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import ItemInfoCard, { INftInfoListCard } from 'components/ItemInfoCard';

import Loading from 'components/Loading';
import { transactionPending } from 'constants/promptMessage';
import styles from './styles.module.css';
import Close from 'assets/images/v2/close.svg';

import { Divider } from 'antd';
import { useBalance } from 'components/Header/hooks/useBalance';
import { divDecimals } from 'utils/calculate';
import { number } from 'echarts';
import { formatTokenPrice } from 'utils/format';
import { ImageEnhance } from 'components/ImgLoading';
import clsx from 'clsx';

import Success from 'assets/images/v2/success.svg';
import Error from 'assets/images/v2/error.svg';
import Warn from 'assets/images/v2/warn.svg';

import { ActionSheet } from 'antd-mobile';

interface IProps {
  title?: string;
  nftInfo: {
    image: string;
    collectionName: string;
    nftName: string;
    quantity?: string;
    gas: string;
    subTotal: string;
    totalPrice: string;
    usdPrice: string;
  };
  amount: number;
  buttonConfig?:
    | {
        btnText?: string;
        onConfirm?: Function;
      }[]
    | false;
  initialization?: <T, R>(params?: T) => Promise<void | R>;
  onClose?: <T>(params?: T) => void;
  type: 'success' | 'warn' | 'error';
  content?: any;
  footer?: any;
}

function ResultModal({ title, nftInfo, initialization, onClose, content, footer, amount = 1, type }: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { aelfInfo, walletInfo } = useGetState();

  const { image, collectionName, nftName } = nftInfo;

  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(true);
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

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
        await initialization();
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

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Success />;
      case 'error':
        return <Error />;

      case 'warn':
        return <Warn />;

      default:
        break;
    }
  };
  const ModalC = useMemo(() => {
    if (!isSmallScreen) {
      return (
        <Modal
          title={null}
          open={modal.visible}
          className={styles.modal}
          width={550}
          closeIcon={<Close />}
          onOk={() => onConfirm()}
          onCancel={onCancel}
          afterClose={modal.remove}
          footer={footer ? footer : null}>
          <div className="w-full h-full flex flex-col items-center relative">
            <div className="!w-[164px] h-[164px]  flex justify-center items-center overflow-hidden rounded-[20px] border border-solid border-lineBorder">
              <ImageEnhance src={image} className="!rounded-none !w-[160px] !h-[160px]" />
            </div>
            <div className="mt-[16px]">
              <p className={clsx('text-[16px] font-semibold !text-textPrimary', styles['nft-list-card-text-ellipsis'])}>
                {collectionName}
                {amount && amount > 0 && (
                  <span className="inline-block text-[14px] text-brandNormal rounded-[4px] ml-[8px] !h-[24px] bg-functionalLinkBg px-[8px] line-[24px]">
                    x {amount}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p
                className={clsx(
                  'text-[14px]] font-medium text-textSecondary mt-[8px]',
                  styles['nft-list-card-text-ellipsis'],
                )}>
                {nftName}
              </p>
            </div>

            <div className="flex items-center text-[24px] font-semibold mt-[32px]">
              <div className="w-[32px] h-[32px] mr-[16px]">{getIcon()}</div>
              <div>{title}</div>
            </div>
            {content}
          </div>
        </Modal>
      );
    }

    const actions = [
      {
        key: 'header',
        text: (
          <div className="w-full h-full flex flex-col items-center relative px-[8px] mb-[16px]">
            <div className="w-full flex justify-end mb-[16px]">
              <Close onClick={onCancel} />
            </div>
            <div className="!w-[160px] h-[160px]  flex justify-center items-center overflow-hidden rounded-[20px] border border-solid border-lineBorder">
              <ImageEnhance src={image} className="!rounded-none !w-[200px] !h-[200px]" />
            </div>
            <div className="mt-[16px]">
              <p
                className={clsx(
                  'text-[18px] font-semibold !text-textPrimary flex',
                  styles['nft-list-card-text-ellipsis'],
                )}>
                {collectionName}
                {amount && amount > 0 && (
                  <span className="flex items-center w-fit text-[14px] text-brandNormal rounded-[4px] ml-[8px] !h-[24px] bg-functionalLinkBg px-[8px] line-[24px]">
                    x {amount}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p
                className={clsx(
                  'text-base font-medium text-textSecondary mt-[4px]',
                  styles['nft-list-card-text-ellipsis'],
                )}>
                {nftName}
              </p>
            </div>

            <div className="flex flex-col items-center text-[24px] font-semibold mt-[24px]">
              <div className="w-[40px] h-[40px]">{getIcon()}</div>
              <div className="mt-[8px]">{title}</div>
            </div>
            {content}
            {footer}
          </div>
        ),
      },
    ];

    return (
      <ActionSheet popupClassName={styles.actionSheet} visible={modal.visible} actions={actions} onClose={onClose} />
    );
  }, [isSmallScreen, modal.visible, title, nftInfo, initialization, onClose, content, footer, amount, type]);

  return ModalC;
}

export default NiceModal.create(ResultModal);
