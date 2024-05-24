import { useState } from 'react';
import { useCreateByStep } from 'hooks/useCreate';
import { useProgress } from './useProgress';
import { ICreateItemsParams } from 'contract/type';
import { BatchCreateNFTSuccessModal } from 'components/SyncChainModal/BatchCreateNFTSuccessModal';
import { useModal } from '@ebay/nice-modal-react';
import { getExploreLink } from 'utils';
import { useSelector } from 'store/store';
import { message } from 'antd';
import { useNiceModalCommonService } from 'hooks/useNiceModalCommonService';

export function useBatchCreateNFTLogic(
  createParamsData: {
    createParamsArr?: ICreateItemsParams[];
    collectionInfo?: any;
    proxyIssuerAddress?: string;
    proxyOwnerAddress?: string;
  },
  logoImage?: string,
) {
  const modal = useModal();
  useNiceModalCommonService(modal);

  const { curChain } = useSelector((store) => store.aelfInfo.aelfInfo);
  const { batchCreateNFT } = useCreateByStep();
  const { percent, start, finish, pause } = useProgress(20 * 1000);
  const [progressStatus, setProgressStatus] = useState<string>('normal');

  const [modalCloseIconShowStatus, setModalCloseIconShowStatus] = useState<boolean>(true);
  const [confirmBtnShowStatus, setConfirmBtnShowStatus] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [creatingFailed] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);

  const { createParamsArr = [], proxyOwnerAddress, proxyIssuerAddress, collectionInfo } = createParamsData;
  const batchCreateNFTSuccessModal = useModal(BatchCreateNFTSuccessModal);

  const onConfirmCreate = async () => {
    if (!createParamsData.createParamsArr?.length) {
      return;
    }
    setModalCloseIconShowStatus(false);
    setConfirmBtnShowStatus(false);
    setCreating(true);
    start();
    try {
      const result = await batchCreateNFT(createParamsArr, proxyOwnerAddress, proxyIssuerAddress);
      finish();
      setModalCloseIconShowStatus(true);

      const explorerUrl = getExploreLink(result.TransactionId as string, 'transaction', curChain as Chain);

      modal.hide();

      batchCreateNFTSuccessModal.show({
        collectionName: collectionInfo.tokenName,
        collectionLogoImage: collectionInfo.logoImage,
        logoImage: logoImage || '',
        explorerUrl,
      });
    } catch (error) {
      pause();
      setProgressStatus('exception');
      setModalCloseIconShowStatus(true);
      message.error(error?.errorMessage?.message);
    }
  };

  return {
    modal,
    modalCloseIconShowStatus,
    confirmBtnShowStatus,
    onConfirmCreate,
    creating,
    creatingFailed,
    successModalVisible,
    setSuccessModalVisible,
    progressStatus,
    setProgressStatus,
    percent,
  };
}
