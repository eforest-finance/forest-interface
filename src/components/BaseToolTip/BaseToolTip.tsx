import { Tooltip, TooltipProps } from 'antd';
import Icon from 'assets/images/icons/hover.svg';
import styles from './index.module.css';
export default function BaseToolTip(
  props: TooltipProps & {
    onClick?: () => void;
  },
) {
  return (
    <Tooltip {...props} className={styles['base-tooltip-wrapper']}>
      {props.children ? props.children : <Icon />}
    </Tooltip>
  );
}
