/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-inline-styles/no-inline-styles */

import { ProgressProps, Progress, Modal } from 'antd';
import { CloseCircleFilled, CheckCircleFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { useResponsive } from 'ahooks/es/useResponsive';

import clsx from 'clsx';
import styles from './style.module.css';
import { useTheme } from 'hooks/useTheme';
import Button from 'baseComponents/Button';

interface IProgressStepProps extends ProgressProps {
  title: string;
  subTitle: string;
  retry?: boolean;
  retryFailedStep: () => void;
}
export interface IStepData {
  percent: number;
  status: string;
  title: string;
  subTitle: string;
  progressTips: string;
  retry?: boolean;
}
export interface IProgressStepsProps {
  stepsData: IStepData[];
  showProgress: boolean;
  retryFailedStep?: Function;
}

const ChainStepItemIcon = ({ status = '', step = 1, percent = 0 }) => {
  const responsive = useResponsive();
  const [theme] = useTheme();

  const ICON_SIZE = !responsive.md ? 24 : 50;
  const MR = !responsive.md ? '16px' : '12px';
  const Mt = !responsive.md ? '4px' : '0px';

  if (status === 'success') {
    return <CheckCircleFilled style={{ fontSize: ICON_SIZE, color: '#1B76E2', marginRight: MR, marginTop: Mt }} />;
  }
  if (status === 'exception') {
    return <CloseCircleFilled style={{ fontSize: ICON_SIZE, color: '#F5594F', marginRight: MR, marginTop: Mt }} />;
  }
  if (!responsive.md) {
    return (
      <Progress
        className="mr-[16px] mt-[2px]"
        type="circle"
        width={24}
        percent={percent}
        format={() => step}
        strokeColor={'#1B76E2'}
        trailColor={theme === 'dark' ? '#383d3d' : '#e6e7e9'}
      />
    );
  }
  return (
    <div className={styles['step-icon']}>
      <span className={styles['icon-title']}>{step}</span>
    </div>
  );
};

const ChainStepItemContent = ({
  title = '',
  subTitle = '',
  step = 1,
  isLast = false,
  retry = false,
  status = '',
  retryFailedStep = () => void 0,
}) => {
  const responsive = useResponsive();

  if (!responsive.md) {
    return (
      <div className={styles['content']}>
        <span className={clsx(styles['title'], '!inline')}>
          {title}{' '}
          <span
            onClick={() =>
              Modal.info({
                title: <span className="text-[var(--color-primary)] text-[24px]">Step {step}</span>,
                content: <span className="text-[var(--color-secondary)] text-[16px]">{subTitle}</span>,
                closable: true,
                icon: null,
                okText: '',
                okButtonProps: { style: { display: 'none' } },
              })
            }>
            <QuestionCircleOutlined style={{ fontSize: 20, color: '#5C6764', marginLeft: '16px' }} />
          </span>
        </span>
        <div className={clsx(!isLast && 'h-[80px]')}>
          {retry && status === 'exception' ? (
            <Button
              type="primary"
              size="small"
              className="!rounded-[4px]"
              onClick={() => {
                retryFailedStep && retryFailedStep();
              }}>
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div className={styles['content']}>
      <span className={styles['title']}>{title}</span>
      <span className={styles['sub-title']}>{subTitle}</span>
    </div>
  );
};

const ChainStepItem = ({
  title = '',
  subTitle = '',
  step = 1,
  status = '',
  percent = 0,
  isLast = false,
  retry = false,
  retryFailedStep = () => void 0,
}) => {
  const responsive = useResponsive();
  return (
    <div className={clsx(styles['chain-step'], status === 'success' && styles['success'])}>
      {!responsive.md && !isLast ? <div className={styles['chain-step-tail']} /> : null}
      <ChainStepItemIcon step={step} percent={percent} status={status} />
      <ChainStepItemContent
        title={title}
        status={status}
        subTitle={subTitle}
        step={step}
        isLast={isLast}
        retry={retry}
        retryFailedStep={() => {
          retryFailedStep && retryFailedStep();
        }}
      />
    </div>
  );
};
const ProgressStep = ({
  percent = 0,
  title = '',
  subTitle = '',
  strokeColor = '#1B76E2',
  status = 'normal',
  retry = false,
  retryFailedStep,
}: IProgressStepProps) => {
  return (
    <div
      className={clsx(
        styles['progress-step'],
        status === 'success' && styles['success'],
        status === 'exception' && styles['exception'],
      )}>
      <Progress
        percent={percent}
        showInfo={false}
        strokeColor={status === 'exception' ? '#F5594F' : strokeColor}
        status={status}></Progress>
      <span className={styles['progress-step-title']}>{title}</span>
      {status === 'exception' && retry ? (
        <Button
          type="primary"
          size="small"
          className="!rounded-[4px]"
          onClick={() => {
            retryFailedStep && retryFailedStep();
          }}>
          Retry
        </Button>
      ) : (
        <span className={styles['progress-step-sub-title']}>{subTitle}</span>
      )}
    </div>
  );
};
const ProgressSteps = ({
  stepsData = [
    {
      percent: 0,
      status: '',
      title: '',
      subTitle: '',
      progressTips: '',
    },
    {
      percent: 0,
      status: '',
      title: '',
      subTitle: '',
      progressTips: '',
    },
  ],
  showProgress = false,
  retryFailedStep,
}: IProgressStepsProps) => {
  const responsive = useResponsive();
  return (
    <div className={styles['elf-steps-wrapper']}>
      {stepsData.map((stepItem, index) => {
        return (
          <div className={styles['elf-step-wrapper']} key={index}>
            <ChainStepItem
              step={index + 1}
              status={stepItem.status}
              title={stepItem.title}
              subTitle={stepItem.subTitle}
              percent={stepItem.percent}
              isLast={index + 1 === stepsData.length}
              retry={stepItem.retry}
              retryFailedStep={() => {
                retryFailedStep && retryFailedStep();
              }}
            />
            {showProgress && responsive.md ? (
              <ProgressStep
                percent={stepItem.percent}
                status={stepItem.status as unknown as ProgressProps['status']}
                title={`Step ${index + 1}`}
                subTitle={stepItem.progressTips}
                retry={stepItem.retry}
                retryFailedStep={() => {
                  retryFailedStep && retryFailedStep();
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export { ProgressSteps };
