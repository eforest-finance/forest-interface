import { Button, Modal } from 'antd';
import useGetState from 'store/state/getState';

export default function RankFailed({
  getContainer,
  confirm,
  visible,
}: {
  getContainer?: () => HTMLElement;
  confirm?: () => void;
  visible?: boolean;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  return (
    <Modal
      zIndex={1000000}
      closable={false}
      className={`forest-marketplace forest-sale-warning-modal forest-sale-modal-footer ${
        isSmallScreen && `forest-sale-modal-mobile forest-sale-modal-footer-mobile`
      }`}
      getContainer={getContainer}
      open={visible}
      title="Rank failed"
      footer={
        <Button className="text-[16px]" onClick={confirm}>
          OK
        </Button>
      }>
      <p
        className={`text-[var(--color-primary)] font-medium text-center ${
          isSmallScreen ? 'text-[16px] pb-[56px]' : 'text-[20px] pb-[22px]'
        }`}>
        &nbsp; &nbsp;The rank already exists.
      </p>
    </Modal>
  );
}
