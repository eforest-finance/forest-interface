import styles from './index.module.css';
import CloseIcon from 'assets/images/close.svg';

type SizeType = 'small' | 'xs' | 'xl';

export default function Close({ size = 'xl', onClose }: { size?: SizeType; onClose?: () => void }) {
  const rectSize = {
    small: '',
    xs: '',
    xl: 'w-[24px] h-[24px] ml-[16px]',
  };
  return <CloseIcon className={`${styles.close} ${rectSize[size]}`} onClick={onClose} />;
}
