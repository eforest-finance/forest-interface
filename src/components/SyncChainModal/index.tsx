/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-inline-styles/no-inline-styles */

import React, { useEffect, useState } from 'react';
import useGetState from 'store/state/getState';
import Image from 'next/image';

import styles from './style.module.css';
import { useCreateLogicForCreateModal } from './useCreateForModal';
import { ICreateCollectionParams } from 'contract/type';
import { SuccessModal } from './SuccessModal';
import { ProgressSteps } from 'components/ProgressSteps';
import SpinLoading from './loading';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';

interface ISyncChainModalProps {
  visible: boolean;
  isError: boolean;
  isFinished: boolean;
  onCancel?: () => void;
  onFinished?: () => void;
  title?: string;
  createParamsData: ICreateCollectionParams;
  seed?: string;
  tokenName?: string;
  logoImage?: string;
  successUrl: string;
}

const SyncChainModal = (props: ISyncChainModalProps) => {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [modalVisible, setModalVisible] = useState<boolean>(props.visible);

  const { tokenName, seed } = props;

  const {
    modalCloseIconShowStatus,
    confirmBtnShowStatus,
    requestAuthLoadingStatus,
    onConfirmCreate,
    percentAndStatusForShow,
    creating,
    creatingFailed,
    successModalVisible,
    setSuccessModalVisible,
  } = useCreateLogicForCreateModal(props.createParamsData);

  const handleFinished = () => {
    props.onFinished && props.onFinished();
  };

  useEffect(() => {
    setModalVisible(props.visible);
  }, [props.visible]);

  return (
    <>
      <Modal
        keyboard={false}
        open={modalVisible}
        className={`${styles['sync-chain-modal']} ${isSmallScreen && styles['sync-chain-modal-mobile']}`}
        width={1200}
        footer={null}
        title={props.title}
        destroyOnClose={true}
        closable={modalCloseIconShowStatus}
        onCancel={() => {
          setModalVisible(false);
        }}
        afterClose={handleFinished}
        maskClosable={false}>
        <SpinLoading spinning={requestAuthLoadingStatus} delay={300}>
          <div className="flex items-center">
            <div className="w-[64px] h-[64px] rounded-md overflow-hidden flex-none">
              {props.logoImage ? (
                <Image
                  src={props.logoImage}
                  alt="token icon"
                  width={64}
                  height={64}
                  className="w-[64px] object-cover"></Image>
              ) : null}
            </div>
            <div className="flex flex-1 flex-wrap items-center ml-4 font-semibold text-textPrimary">
              <span className=" pr-2 break-all">{tokenName}</span>
              {!creating ? (
                <div className="flex items-center">
                  <span className="break-all font-semibold text-xl text-textPrimary">
                    will be created using the {seed}
                  </span>
                </div>
              ) : !creatingFailed ? (
                <span>is being created now. Please don't close this window.</span>
              ) : (
                <span>creation failed. Please try again later.</span>
              )}
            </div>
          </div>
          <div className="text-textPrimary text-xl font-semibold my-6">Collection creation takes two steps</div>
          <ProgressSteps stepsData={percentAndStatusForShow} showProgress={!confirmBtnShowStatus} />
        </SpinLoading>
        {confirmBtnShowStatus ? (
          <div className="flex justify-center mt-[62px]">
            <Button type="primary" size="ultra" className="!w-[225Px]" onClick={onConfirmCreate}>
              Confirm
            </Button>
          </div>
        ) : null}
      </Modal>
      <SuccessModal
        title="Create a Collection"
        visible={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        afterClose={() => setSuccessModalVisible(false)}
        tokenName={props.tokenName || ''}
        logoImage={props.logoImage || ''}
        successUrl={props.successUrl}
      />
    </>
  );
};

export default SyncChainModal;
