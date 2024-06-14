import { Modal, Button } from 'antd5/';
import Link from 'next/link';
import styles from './style.module.css';
import Close from 'assets/images/icon/clear.svg';

export interface RetryModalProps {
  isModalOpen: boolean;
  onConfirm: () => void;
  onRetry: () => void;
}

const RetryModal = (props: RetryModalProps) => {
  const { isModalOpen, onConfirm, onRetry } = props;
  return (
    <Modal
      centered
      width={800}
      wrapClassName={styles.retryWrap}
      classNames={{
        body: 'rounded-[12px]',
      }}
      closeIcon={false}
      title={
        <div className="justify-between pt-[4px] mdl:pt-[44px] mdl:pl-[8px]  flex items-center font-semibold mdl:text-[24px] text-[20px] mdl:leading-[32px] leading-[28px]">
          Something Wrong
          <Close className="cursor-pointer" onClick={onConfirm} />
        </div>
      }
      footer={
        <div className="mt-[32px] mdl:mt-[56px] flex justify-center items-center mdl:mb-[32px] mb-[4px]">
          <Button
            onClick={onConfirm}
            className="!w-[225px] !h-[56px] !rounded-[12px] border-[1px] !border-[var(--brand-normal)] !text-[16px] font-semibold !text-brandNormal">
            Confirm
          </Button>
          <Button
            type="primary"
            onClick={onRetry}
            className="!ml-[32px] w-[225px] !h-[56px] !rounded-[12px] !text-[16px] !font-semibold !text-white">
            Retry
          </Button>
        </div>
      }
      open={isModalOpen}>
      <p className="mdl:mx-[32px] ml-0 mt-[24px] mdl:mt-[56px] text-[18px] font-semibold text-textPrimary leading-[26px]">
        An error occurred while creating the Al Generator. It is recommended to retry generating the image without
        paying for the retry. If you choose to ignore this error, you can find this order in"
        <Link href={''}>Ai generator - Failed orders</Link>" later and re-initiate the generation of the Ai image.
      </p>
    </Modal>
  );
};

export default RetryModal;
