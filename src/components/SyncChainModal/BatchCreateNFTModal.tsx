/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-inline-styles/no-inline-styles */

import React from 'react';
import useGetState from 'store/state/getState';
import { ImageEnhance } from 'components/ImgLoading';
import { Progress } from 'antd';

import styles from './style.module.css';
import { ICreateItemsParams } from 'contract/type';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import { useBatchCreateNFTLogic } from './useBatchCreateNFTLogic';
import NiceModal from '@ebay/nice-modal-react';

interface IBatchCreateModalProps {
  isError: boolean;
  isFinished: boolean;
  onCancel?: () => void;
  onFinished?: () => void;
  title?: string;
  createParamsData: {
    createParamsArr?: ICreateItemsParams[];
    collectionInfo?: any;
    proxyIssuerAddress?: string;
    proxyOwnerAddress?: string;
  };
  collectionName?: string;
  tokenName?: string;
  logoImage?: string;
  nftItemCount?: number;
}

const BatchCreateNFTModalContructor = (props: IBatchCreateModalProps) => {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { collectionName } = props;

  const { modal, modalCloseIconShowStatus, confirmBtnShowStatus, onConfirmCreate, creating, progressStatus, percent } =
    useBatchCreateNFTLogic(props.createParamsData, props?.logoImage);

  const renderModalFooter = () => {
    if (!confirmBtnShowStatus) return null;
    return (
      <div className="flex justify-center mt-4 w-full">
        <Button
          type="primary"
          size="ultra"
          className={`${!isSmallScreen ? '!w-[256px]' : '!w-full'}`}
          onClick={onConfirmCreate}>
          Confirm
        </Button>
      </div>
    );
  };

  return (
    <>
      <Modal
        keyboard={false}
        className={`${styles['sync-chain-modal']} ${isSmallScreen && styles['sync-chain-modal-mobile']}`}
        width={800}
        footer={renderModalFooter()}
        title={props.title || 'Create Items'}
        destroyOnClose={true}
        closable={modalCloseIconShowStatus}
        open={modal.visible}
        onOk={modal.hide}
        onCancel={modal.hide}
        afterClose={modal.remove}
        maskClosable={false}>
        <div className="flex flex-col h-full ">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-none">
                {props.logoImage ? (
                  <ImageEnhance src={props.logoImage} alt="token icon" className="!w-16 !h-16 object-cover" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-wrap items-center ml-4">
                {!creating ? (
                  <div className="flex items-center ">
                    <span className="break-all">
                      <span className="font-medium text-lg text-textPrimary">
                        {props.nftItemCount} NFT items will be created under the collection {collectionName}
                      </span>
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-base text-textSecondary">
                    {props.nftItemCount} Items is creating now. Please do not close this window.
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-y-2 mt-6">
              <span className=" font-semibold text-base text-textPrimary">
                NFT launching will require the creation and issuance steps.
              </span>
              <div className=" text-base text-textSecondary">
                A signature approval is required when requesting the side chain token contract to create and issue NFTs.
                Note: Please make sure you have enough ELF balance in your tDVV side chain address.
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8 text-base font-medium text-brandNormal">
            Number of pending creates: {props.nftItemCount}
          </div>

          <div className="flex flex-col">
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={progressStatus === 'exception' ? '#F5594F' : '#1B76E2'}
              status={progressStatus}
            />
            <div className="flex justify-between text-base">
              <span className=" font-semibold text-textPrimary">Start</span>
              <span className=" font-normal text-textSecondary">about 10-20 seconds</span>
              <span className=" font-semibold text-textPrimary">Complete</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const BatchCreateNFTModal = NiceModal.create(BatchCreateNFTModalContructor);
