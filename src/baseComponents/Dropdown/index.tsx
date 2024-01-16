import React from 'react';
import { Dropdown as AntdDropdown, DropdownProps as AntdDropdownProps } from 'antd';
import styles from './index.module.css';
import clsx from 'clsx';

// interface ButtonProps extends Omit<AntdDropdownProps, 'size'> {
interface DropdownProps extends AntdDropdownProps {
  ext?: any;
}

function Dropdown(props: DropdownProps) {
  const { children, className, overlayClassName } = props;
  return (
    <AntdDropdown {...props} overlayClassName={clsx(styles['forest-dropdown'], overlayClassName)} className={className}>
      {children}
    </AntdDropdown>
  );
}

export default React.memo(Dropdown);
