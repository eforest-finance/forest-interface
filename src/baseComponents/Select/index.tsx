import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd';
import styles from './style.module.css';
import clsx from 'clsx';
import Arrow from 'assets/images/icon/arrow.svg';
import { OptionProps } from 'antd/lib/select';
import { SizeType } from 'baseComponents/type';

const { Option: AntdOption } = AntdSelect;

export interface SelectProps extends Omit<AntdSelectProps, 'size'> {
  size?: SizeType;
}

export function Option(props: OptionProps) {
  const { children } = props;

  return <AntdOption {...props}>{children}</AntdOption>;
}

export function Select(props: SelectProps) {
  const { className, suffixIcon, popupClassName, children, disabled, ...params } = props;

  const sizeStyle: Record<SizeType, string> = {
    medium: styles['forest-select-medium'],
    default: styles['forest-select-default'],
    large: styles['forest-select-large'],
  };

  return (
    <AntdSelect
      {...params}
      size="middle"
      className={clsx(
        styles['custom-select'],
        sizeStyle[props.size || 'default'],
        props.status === 'error' && !props.disabled && styles['select-status-error'],
        className,
      )}
      disabled={disabled}
      suffixIcon={suffixIcon || <Arrow />}
      popupClassName={clsx(styles['custom-popup'], popupClassName)}>
      {children}
    </AntdSelect>
  );
}
