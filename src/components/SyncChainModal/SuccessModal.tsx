import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMount } from 'react-use';
import styles from './style.module.css';
import useGetState from 'store/state/getState';
import Modal, { ModalProps } from 'baseComponents/Modal';
import Button from 'baseComponents/Button';

interface ISuccessModalProps extends ModalProps {
  logoImage?: string;
  visible: boolean;
  tokenName: string;
  successUrl: string;
  title?: string;
}

export function SuccessModal(props: ISuccessModalProps) {
  const { logoImage, visible, tokenName } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const nav = useRouter();
  useMount(() => {
    nav.prefetch(props.successUrl);
  });

  const onConfirmCreate = () => {
    console.log('todo');
    nav.push(props.successUrl);
  };
  return (
    <Modal
      {...props}
      open={visible}
      footer={null}
      closable={false}
      maskClosable={false}
      className={`${styles['sync-chain-modal']} ${isSmallScreen && styles['sync-chain-modal-mobile']}`}>
      <div className="flex flex-col items-center">
        <div className="w-[128Px] h-[128Px] rounded-md overflow-hidden">
          {logoImage ? (
            <Image src={logoImage} alt="token icon" width={128} height={128} className="w-[128px] object-cover"></Image>
          ) : null}
        </div>
        <span className="text-[16px] mt-[16px] mb-[16px]">{tokenName}</span>
        <span className="text-[20px] text-[var(--text-item)] mb-[72px] font-semibold">Created Successfully</span>
      </div>
      <div className="flex justify-center">
        <Button type="primary" size="ultra" className="!w-[225Px]" onClick={onConfirmCreate}>
          OK
        </Button>
      </div>
    </Modal>
  );
}
