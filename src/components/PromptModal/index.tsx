import React, { ReactNode, useEffect, useState } from 'react';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import NftInfoListCard, { INftInfoListCard } from 'components/NftInfoListCard';
import Loading from 'components/Loading';
import { transactionPending } from 'constants/promptMessage';

interface IProps {
  title?: string;
  nftInfo: INftInfoListCard;
  buttonConfig?:
    | {
        btnText?: string;
        onConfirm?: Function;
      }[]
    | false;
  initialization?: <T, R>(params?: T) => Promise<void | R>;
  onClose?: <T>(params?: T) => void;
  content?: {
    title?: string | ReactNode;
    content?: string | string[] | ReactNode;
  };
}

function PromptModal({ title, nftInfo, buttonConfig, initialization, content, onClose }: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [loading, setLoading] = useState<boolean>(true);
  const [showRetryBtn, setShowRetryBtn] = useState<boolean>(false);

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
        await initialization();
        return;
      } catch (error) {
        setShowRetryBtn(true);
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

  const footer = () => {
    if (!showRetryBtn) return null;
    if (typeof buttonConfig === 'boolean' && !buttonConfig) {
      return null;
    } else {
      return (
        <>
          {(buttonConfig || defaultButtonConfig).map((item, index) => {
            return (
              <Button
                type="primary"
                size="ultra"
                key={index}
                disabled={loading}
                isFull={isSmallScreen ? true : false}
                className={`${!isSmallScreen && '!w-[256px]'}`}
                onClick={() => onRetry(item?.onConfirm)}>
                {item.btnText}
              </Button>
            );
          })}
        </>
      );
    }
  };

  const getContentCom = (content: string | ReactNode | string[]) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    } else if (content instanceof Array) {
      return content.map((item, index) => {
        return <p key={index}>{item}</p>;
      });
    } else {
      return content;
    }
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  useEffect(() => {
    if (modal.visible) {
      onConfirm();
    }
    return () => {
      setShowRetryBtn(false);
    };
  }, [modal.visible, title, nftInfo, buttonConfig, initialization, content, onClose]);

  return (
    <Modal
      title={title}
      open={modal.visible}
      onOk={() => onConfirm()}
      onCancel={onCancel}
      afterClose={modal.remove}
      footer={footer()}>
      <div className="w-full h-full flex flex-col relative">
        <NftInfoListCard {...nftInfo} />

        {content ? (
          <div className="mt-[32px] bg-fillHoverBg rounded-lg p-[24px]">
            <div className="text-lg text-textPrimary font-medium">
              {content?.title ? getContentCom(content?.title) : transactionPending}
            </div>
            <div className="text-base text-textSecondary mt-[16px]">{getContentCom(content?.content)}</div>
          </div>
        ) : null}

        {loading && (
          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
            <div className="p-[24px] w-max h-max bg-fillMask2 rounded-[16px]">
              <Loading imgStyle="w-[48px] h-[48px]" className="w-[48px] !h-[48px] !pb-0" />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default NiceModal.create(PromptModal);
