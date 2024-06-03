import { Modal, Spin } from 'antd5/';
import Warn from 'assets/images/v2/message_filled.svg';

export interface ProgressingModalProps {
  isModalOpen: boolean;
}

const ProgressingModal = (props: ProgressingModalProps) => {
  const { isModalOpen } = props;
  return (
    <Modal
      centered
      width={800}
      closeIcon={false}
      title={
        <div className="pt-[44px] px-[24px] flex items-center font-semibold text-[24px] leading-[32px]">
          <Warn className="mr-[16px]" />
          Generate Images
        </div>
      }
      footer={
        <div className="mt-[64px] flex justify-center items-center mb-[16px]">
          <p className="text-[16px]  text-textSecondary mr-[8px]">Generating the image using AI</p>
          <Spin className="w-[24px] h-[24px]" />
        </div>
      }
      open={isModalOpen}>
      <p className="ml-[72px] mt-[16px] text-[16px] text-textSecondary">
        {" Please don't post close this window until the generation is complete."}
      </p>
    </Modal>
  );
};

export default ProgressingModal;
