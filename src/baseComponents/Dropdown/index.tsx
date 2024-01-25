import React from 'react';
// import { Dropdown as AntdDropdown, DropdownProps as AntdDropdownProps } from 'antd';
import { Dropdown as AelfDropdown, IDropdownProps, AELFDProvider } from 'aelf-design';
import styles from './index.module.css';
import clsx from 'clsx';

// interface ButtonProps extends Omit<AntdDropdownProps, 'size'> {
interface DropdownProps extends IDropdownProps {
  ext?: any;
}

function Dropdown(props: DropdownProps) {
  const { children, className, overlayClassName } = props;
  return (
    <AELFDProvider prefixCls="ant">
      <AelfDropdown
        {...props}
        overlayClassName={clsx(styles['forest-dropdown'], overlayClassName)}
        className={className}>
        {children}
      </AelfDropdown>
    </AELFDProvider>
  );
}

export default React.memo(Dropdown);
