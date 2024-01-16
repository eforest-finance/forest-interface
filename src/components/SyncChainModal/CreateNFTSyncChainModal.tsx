/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-inline-styles/no-inline-styles */

import React, { useEffect, useState } from 'react';
import useGetState from 'store/state/getState';
import Image from 'next/image';

import styles from './style.module.css';
import { useCreateLogicForCreateModal } from './useCreateNFTForModal';
import { ICreateItemsParams, IIssuerParams } from 'contract/type';
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
  createParamsData: {
    createParams?: ICreateItemsParams;
    issuerParams?: IIssuerParams;
    proxyIssuerAddress?: string;
  };
  collectionName?: string;
  tokenName?: string;
  logoImage?: string;
  successUrl: string;
}

const CreateNFTSyncChainModal = (props: ISyncChainModalProps) => {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [modalVisible, setModalVisible] = useState<boolean>(props.visible);

  const { tokenName, collectionName } = props;

  const {
    modalCloseIconShowStatus,
    confirmBtnShowStatus,
    requestAuthLoadingStatus,
    onConfirmCreate,
    percentAndStatusForShow,
    creating,
    creatingFailed,
    currentStep,
    successModalVisible,
    setSuccessModalVisible,
    onFailedRetry,
  } = useCreateLogicForCreateModal(props.createParamsData);

  const handleFinished = () => {
    props.onFinished && props.onFinished();
  };

  useEffect(() => {
    setModalVisible(props.visible);
  }, [props.visible]);

  const renderModalFooter = () => {
    if (!confirmBtnShowStatus) return null;
    return (
      <div className="flex justify-center mt-[62px]">
        <Button type="primary" size="ultra" className="!w-[225Px]" onClick={onConfirmCreate}>
          Confirm
        </Button>
      </div>
    );
  };

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
            <div className="flex flex-1 flex-wrap items-center ml-[16Px]">
              <span className="font-semibold text-[20px] leading-[28Px] pr-[8px] break-all">{tokenName}</span>
              {!creating ? (
                <div className="flex items-center ">
                  <span className="break-all">
                    <span className="font-medium text-[16px] pr-[8px] text-[var(--text-secondary1)]">
                      will be created under the collection
                    </span>
                    <span className="font-semibold text-[20Px] leading-[28Px]">{collectionName}</span>
                  </span>
                </div>
              ) : !creatingFailed ? (
                <span className="font-medium text-[16px] text-[var(--text-secondary1)]">
                  is being created now. Please don't close this window
                </span>
              ) : (
                <span className="font-medium text-[16px] text-[var(--text-secondary1)]">
                  {`creation failed. Please try again${currentStep.step === 2 ? '' : ' later'}.`}
                </span>
              )}
            </div>
          </div>
          <div className="text-[var(--color-primary)] text-[20px] font-semibold my-[24Px]">
            Creating an Item takes three steps
          </div>
          <ProgressSteps
            stepsData={percentAndStatusForShow}
            showProgress={!confirmBtnShowStatus}
            retryFailedStep={onFailedRetry}
          />
        </SpinLoading>
        {renderModalFooter()}
      </Modal>
      <SuccessModal
        title="Create an Item"
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

export { CreateNFTSyncChainModal };
