import { Steps } from 'antd5/';
import styles from './style.module.css';

export function CreateStep({ currentStep }: { currentStep: number }) {
  return (
    <Steps
      direction="horizontal"
      className={styles['create-step']}
      responsive={false}
      current={currentStep}
      labelPlacement={'vertical'}
      items={[
        {
          title: 'AI Generation',
          status: currentStep > 0 ? 'finish' : 'wait',
        },
        {
          title: 'NFT Creation',
          status: currentStep > 1 ? 'finish' : 'wait',
        },
      ]}></Steps>
  );
}
