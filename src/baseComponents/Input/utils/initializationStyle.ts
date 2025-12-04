import { SizeType } from 'baseComponents/type';
import styles from '../style.module.css';

export const sizeStyle: Record<SizeType, string> = {
  medium: styles['forest-input-medium'],
  default: styles['forest-input-default'],
  large: styles['forest-input-large'],
};

const initializationStyle = (props: { disabled?: boolean; status?: string }) => {
  if (props.disabled) {
    return '';
  }
  switch (props.status) {
    case 'error':
      return 'border--err';
    case 'warning':
      return '';
    default:
      return 'hover-color';
  }
};

export default initializationStyle;
