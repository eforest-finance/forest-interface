'use client';
import { InputNumber as AntdInputNumber, InputNumberProps as AntdInputNumberProps } from 'antd';
import clsx from 'clsx';
import styles from '../style.module.css';
import React from 'react';
import initializationStyle, { sizeStyle } from '../utils/initializationStyle';

interface InputNumberProps extends Omit<AntdInputNumberProps, 'size'> {
  size?: 'medium' | 'default';
}

function InputNumber(props: InputNumberProps) {
  return (
    <AntdInputNumber
      {...props}
      size="middle"
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
  );
}

export default React.memo(InputNumber);
