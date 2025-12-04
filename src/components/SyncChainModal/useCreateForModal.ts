import { useEffect, useState } from 'react';
import { useCreateByStep, CreateCollectionOrNFTStep, StepStatus, CreateByEnum } from 'hooks/useCreate';
import { useProgress } from './useProgress';
import { ICreateCollectionParams } from 'contract/type';
import { MESSAGE } from 'assets/resString';
import { IStepData } from 'components/ProgressSteps';

export function useCreateLogicForCreateModal(createParamsData: ICreateCollectionParams) {
  const { create, currentStep } = useCreateByStep();
  const [firstStepPercent, setFirstStepPercent] = useState(0);
  const { percent: secondStepPercent, start, pause, finish } = useProgress();
  const [percentAndStatusForShow, setPercentAndStatusForShow] = useState<IStepData[]>([
    {
      percent: 0,
      status: '',
      title: MESSAGE['createCollection.approveStep.title'],
      subTitle: MESSAGE['createCollection.approveStep.subTitle'],
      progressTips: MESSAGE['createCollection.approveStep.progressTips'],
    },
    {
      percent: 0,
      status: '',
      title: MESSAGE['createCollection.syncStep.title'],
      subTitle: MESSAGE['createCollection.syncStep.subTitle'],
      progressTips: MESSAGE['createCollection.syncStep.progressTips'],
    },
  ]);
  const [modalCloseIconShowStatus, setModalCloseIconShowStatus] = useState<boolean>(true);
  const [confirmBtnShowStatus, setConfirmBtnShowStatus] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [creatingFailed, setCreatingFailed] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);
  const [requestAuthLoadingStatus, setRequestAuthLoadingStatus] = useState(false);

  const onConfirmCreate = () => {
    setModalCloseIconShowStatus(false);
    setConfirmBtnShowStatus(false);
    setCreating(true);
    create(createParamsData, CreateByEnum.Collection);
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
        setRequestAuthLoadingStatus(false);
        setModalCloseIconShowStatus(true);
      }
    }
    if (currentStep.step === CreateCollectionOrNFTStep.crossChainSync) {
      if (currentStep.status === StepStatus.pending) {
        start();
      }
      if (currentStep.status === StepStatus.fulfilled) {
        finish();
        setModalCloseIconShowStatus(true);
      }
      if (currentStep.status === StepStatus.rejected) {
        pause();
        setModalCloseIconShowStatus(true);
      }
    }
  }, [currentStep, pause, finish, start]);

  useEffect(() => {
    setPercentAndStatusForShow((preData) => {
      const res = [
        Object.assign({}, preData[0], { percent: firstStepPercent }),
        Object.assign({}, preData[1], { percent: secondStepPercent }),
      ];
      if (currentStep.status === StepStatus.rejected) {
        if (currentStep.step === CreateCollectionOrNFTStep.requestContractAuth) {
          res[0].status = 'exception';
        } else {
          res[1].status = 'exception';
        }
      }
      if (currentStep.status === StepStatus.fulfilled) {
        if (currentStep.step === CreateCollectionOrNFTStep.requestContractAuth) {
          res[0].status = 'success';
        } else {
          res[1].status = 'success';
        }
      }

      return res;
    });

    if (currentStep.step === CreateCollectionOrNFTStep.crossChainSync && currentStep.status === StepStatus.fulfilled) {
      setSuccessModalVisible(true);
    }
  }, [firstStepPercent, secondStepPercent, currentStep]);

  return {
    modalCloseIconShowStatus,
    confirmBtnShowStatus,
    percentAndStatusForShow,
    requestAuthLoadingStatus,
    onConfirmCreate,
    currentStep,
    creating,
    creatingFailed,
    successModalVisible,
    setSuccessModalVisible,
  };
}
