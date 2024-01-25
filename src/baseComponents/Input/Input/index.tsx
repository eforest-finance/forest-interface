'use client';
// import { Input as AntdInput, InputProps as AntdInputProps, InputRef } from 'antd';
import { Input as AelfInput, IInputProps, AELFDProvider } from 'aelf-design';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { themeInputConfig } from './config';
import styles from './style.module.css';

function Input(props: IInputProps) {
  return (
    <AELFDProvider
      prefixCls="ant"
      theme={{
        components: {
          Input: themeInputConfig,
        },
      }}>
      <AelfInput {...props} size="middle" className={clsx(styles.input, props.className)} />
    </AELFDProvider>
  );
}
export default React.memo(forwardRef(Input));
