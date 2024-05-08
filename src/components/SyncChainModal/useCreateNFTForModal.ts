import { useEffect, useState } from 'react';
import {
  useCreateByStep,
  CreateCollectionOrNFTStep,
  StepStatus,
  CreateByEnum,
  FailStepOfCollectionEnum,
} from 'hooks/useCreate';
import { useProgress } from './useProgress';
import { ICreateItemsParams, IIssuerParams } from 'contract/type';
import { MESSAGE } from 'assets/resString';
import { IStepData } from 'components/ProgressSteps';

export function useCreateLogicForCreateModal(createParamsData: {
  createParams?: ICreateItemsParams;
  issuerParams?: IIssuerParams;
  proxyIssuerAddress?: string;
  skipChainSync?: boolean;
}) {
  const { create, issueRetry, currentStep } = useCreateByStep();
  const [firstStepPercent, setFirstStepPercent] = useState(0);
  const { percent: secondStepPercent, start, pause, finish } = useProgress();
  const [thirdStepPercent, setThirdStepPercent] = useState(0);
  const [requestAuthLoadingStatus, setRequestAuthLoadingStatus] = useState(false);

  const [percentAndStatusForShow, setPercentAndStatusForShow] = useState<IStepData[]>([
    {
      percent: 0,
      status: '',
      title: MESSAGE['createNFT.approveStep.title'],
      subTitle: !!createParamsData.skipChainSync
        ? MESSAGE['createNFTSideChain.approveStep.subTitle']
        : MESSAGE['createNFT.approveStep.subTitle'],
      progressTips: MESSAGE['createNFT.approveStep.progressTips'],
    },
    {
      percent: 0,
      status: '',
      title: MESSAGE['createNFT.syncStep.title'],
      subTitle: MESSAGE['createNFT.syncStep.subTitle'],
      progressTips: MESSAGE['createNFT.syncStep.progressTips'],
      hiddenShow: !!createParamsData.skipChainSync,
    },
    {
      percent: 0,
      status: '',
      title: MESSAGE['createNFT.issueStep.title'],
      subTitle: MESSAGE['createNFT.issueStep.subTitle'],
      progressTips: MESSAGE['createNFT.issueStep.progressTips'],
      retry: true,
    },
  ]);
  const [modalCloseIconShowStatus, setModalCloseIconShowStatus] = useState<boolean>(true);
  const [confirmBtnShowStatus, setConfirmBtnShowStatus] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [creatingFailed, setCreatingFailed] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);

  const onConfirmCreate = () => {
    if (!createParamsData.createParams) {
      return;
    }
    setModalCloseIconShowStatus(false);
    setConfirmBtnShowStatus(false);
    setCreating(true);
    create(
      createParamsData.createParams,
      CreateByEnum.Items,
      createParamsData.issuerParams,
      createParamsData.proxyIssuerAddress,
      !!createParamsData.skipChainSync,
    );
  };

  const onFailedRetry = () => {
    console.log('onFailedRetry', currentStep);
    // current retry only be issue, later provide more common retry opportunity
    if (currentStep.step === CreateCollectionOrNFTStep.issue) {
      issueRetry(createParamsData.issuerParams, createParamsData.proxyIssuerAddress);
    }
  };

  useEffect(() => {
    if (currentStep.status === StepStatus.rejected) {
      setCreatingFailed(true);
    }
    if (currentStep.step === CreateCollectionOrNFTStep.requestContractAuth) {
      if (currentStep.status === StepStatus.pending) {
        setRequestAuthLoadingStatus(true);
        setFirstStepPercent(50);
      }
      if (currentStep.status === StepStatus.fulfilled) {
        setRequestAuthLoadingStatus(false);
        setFirstStepPercent(100);
      }
      if (currentStep.status === StepStatus.rejected) {
        setModalCloseIconShowStatus(true);
        setRequestAuthLoadingStatus(false);
      }
    }
    if (currentStep.step === CreateCollectionOrNFTStep.crossChainSync) {
      if (currentStep.status === StepStatus.pending) {
        start();
      }
      if (currentStep.status === StepStatus.fulfilled) {
        finish();
      }
      if (currentStep.status === StepStatus.rejected) {
        pause();
        setModalCloseIconShowStatus(true);
      }
    }

    if (currentStep.step === CreateCollectionOrNFTStep.issue) {
      if (currentStep.status === StepStatus.pending) {
        setRequestAuthLoadingStatus(true);
        setThirdStepPercent(50);
      }
      if (currentStep.status === StepStatus.fulfilled) {
        setThirdStepPercent(100);
        setModalCloseIconShowStatus(true);
        setRequestAuthLoadingStatus(false);
      }
      if (currentStep.status === StepStatus.rejected) {
        setModalCloseIconShowStatus(true);
        setRequestAuthLoadingStatus(false);
      }
    }
  }, [currentStep, pause, finish, start]);

  useEffect(() => {
    setPercentAndStatusForShow((preData) => {
      const res = [
        Object.assign({}, preData[0], { percent: firstStepPercent }),
        Object.assign({}, preData[1], { percent: secondStepPercent }),
        Object.assign({}, preData[2], { percent: thirdStepPercent }),
      ];
      if (currentStep.status === StepStatus.rejected) {
        res[currentStep.step].status = 'exception';
      }
      if (currentStep.status === StepStatus.fulfilled) {
        res[currentStep.step].status = 'success';
      }

      return res;
    });

    if (currentStep.step === CreateCollectionOrNFTStep.issue && currentStep.status === StepStatus.fulfilled) {
      setSuccessModalVisible(true);
    }
  }, [firstStepPercent, secondStepPercent, thirdStepPercent, currentStep]);

  return {
    modalCloseIconShowStatus,
    confirmBtnShowStatus,
    requestAuthLoadingStatus,
    percentAndStatusForShow,
    onConfirmCreate,
    currentStep,
    creating,
    creatingFailed,
    successModalVisible,
    setSuccessModalVisible,
    onFailedRetry,
  };
}
