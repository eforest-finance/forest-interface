import React, { ReactNode, useMemo } from 'react';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import useGetState from 'store/state/getState';
import Jump from 'assets/images/detail/jump.svg';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { isMobile } from 'react-device-detect';
import { StaticImageData } from 'next/image';
import NftInfoList, { INftInfoList } from 'components/NftInfoList';
import NftInfoCard, { INftInfoCard } from 'components/NftInfoCard';

interface IProps {
  previewImage?: string | StaticImageData;
  title?: string;
  description?: string | ReactNode | string[];
  hideButton?: boolean;
  buttonInfo?: {
    btnText?: string;
    onConfirm?: <T, R>(params?: T) => R | void;
  };
  info: INftInfoCard;
  jumpInfo?: {
    url?: string;
    btnText?: string;
  };
  error?: {
    title?: string;
    description?: string | ReactNode | string[];
    list?: INftInfoList[];
  };
}

function ResultModal({
  previewImage,
  jumpInfo,
  title,
  description,
  buttonInfo,
  hideButton = false,
  info,
  error,
}: IProps) {
  const modal = useModal();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const aProps = useMemo(() => (isMobile ? {} : { target: '_blank', rel: 'noreferrer' }), []);

  const onClick = () => {
    if (buttonInfo?.onConfirm) {
      buttonInfo.onConfirm();
      return;
    }
    modal.hide();
    return;
  };

  const JumpInfo = useMemo(
    () =>
      jumpInfo ? (
        <a href={jumpInfo.url} {...aProps} className="flex items-center">
          {jumpInfo.btnText || 'View on aelf Explorer'} <Jump className="fill-textSecondary w-4 h-4 ml-2" />
        </a>
      ) : null,
    [aProps, jumpInfo],
  );

  const footer = (
    <div className="w-full flex flex-col items-center">
      {!hideButton && (
        <Button
          type="primary"
          size="ultra"
          isFull={isSmallScreen ? true : false}
          className={`${!isSmallScreen && '!w-[256px]'}`}
          onClick={onClick}>
          {buttonInfo?.btnText || 'View'}
        </Button>
      )}

      {!isSmallScreen ? <div className="mt-[16px]">{JumpInfo}</div> : null}
    </div>
  );

  const getDescriptionCom = (description: string | ReactNode | string[]) => {
    if (typeof description === 'string') {
      return <p>{description}</p>;
    } else if (description instanceof Array) {
      return description.map((item, index) => {
        return <p key={index}>{item}</p>;
      });
    } else {
      return description;
    }
  };

  return (
    <Modal
      title=" "
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      footer={footer}>
      <div className="w-full h-full flex flex-col">
        <NftInfoCard previewImage={previewImage} info={info} />
        <div className="flex flex-col items-center mt-12">
          <span className="text-textPrimary font-semibold text-2xl">{title}</span>
          <p className="text-base font-medium text-textSecondary mt-4">{getDescriptionCom(description)}</p>
        </div>
        {error && (
          <div className="flex flex-col flex-1 w-full border-0 mdTW:border border-solid border-lineBorder rounded-lg px-0 mdTW:px-[32px] py-[32px] my-[32px]">
            <span className="text-functionalDanger font-semibold text-xl text-center mdTW:text-left">
              {error.title}
            </span>
            <p className="text-base font-medium text-textSecondary mt-[8px] text-center mdTW:text-left">
              {getDescriptionCom(error.description)}
            </p>
            {error?.list?.length && (
              <div className="mt-[32px]">
                {error.list?.map((item, index) => {
                  return <NftInfoList key={index} {...item} />;
                })}
              </div>
            )}
          </div>
        )}
        {isSmallScreen ? <div className="py-[16px] flex justify-center">{JumpInfo}</div> : null}
      </div>
    </Modal>
  );
}

export default NiceModal.create(ResultModal);
