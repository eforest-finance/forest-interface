'use client';
import { Input as AntdInput, InputProps as AntdInputProps, InputRef } from 'antd';
import clsx from 'clsx';
import styles from '../style.module.css';
import React, { Ref, forwardRef } from 'react';
import initializationStyle, { sizeStyle } from '../utils/initializationStyle';
import { SizeType } from 'baseComponents/type';

export interface InputProps extends Omit<AntdInputProps, 'size'> {
  size?: SizeType;
}

function Input(props: InputProps, ref: Ref<InputRef> | undefined) {
  return (
    <AntdInput
      {...props}
      ref={ref}
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
export default React.memo(forwardRef(Input));
