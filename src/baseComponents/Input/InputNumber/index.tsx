'use client';
import { InputNumber as AntdInputNumber, InputNumberProps as AntdInputNumberProps, ConfigProvider } from 'antd';
import clsx from 'clsx';
import styles from '../style.module.css';
import React from 'react';
import initializationStyle, { sizeStyle } from '../utils/initializationStyle';
import { themeInputNumberConfig } from './config';

interface InputNumberProps extends Omit<AntdInputNumberProps, 'size'> {
  size?: 'medium' | 'default';
}

function InputNumber(props: InputNumberProps) {
  return (
    <ConfigProvider
      prefixCls="ant"
      theme={{
        components: {
          InputNumber: themeInputNumberConfig,
        },
      }}>
      <AntdInputNumber
        {...props}
        size="middle"
        controls={false}
        className={clsx(
          initializationStyle({
            disabled: props.disabled,
            status: props.status,
          }),
          styles.input,
          sizeStyle[props.size || 'default'],
          props.className,
        )}
      />
    </ConfigProvider>
  );
}

export default React.memo(InputNumber);
