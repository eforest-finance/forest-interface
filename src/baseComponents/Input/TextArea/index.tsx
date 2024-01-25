'use client';
import { Input as AntdInput, ConfigProvider } from 'antd';
import clsx from 'clsx';
import styles from '../style.module.css';
import { TextAreaProps as AntdTextAreaProps } from 'antd/lib/input';
import React from 'react';
import initializationStyle from '../utils/initializationStyle';
import { SizeType } from 'baseComponents/type';
import { themeTextAreaConfig } from './config';

const { TextArea: AntdTextArea } = AntdInput;

export interface TextAreaProps extends Omit<AntdTextAreaProps, 'size' | 'count'> {
  size?: 'medium' | 'default';
}

function TextArea(props: TextAreaProps) {
  const sizeStyle: Record<SizeType, string> = {
    medium: styles['forest-area-medium'],
    default: styles['forest-area-default'],
    large: styles['forest-area-default'],
  };

  return (
    <ConfigProvider
      prefixCls="ant"
      theme={{
        components: {
          Input: themeTextAreaConfig,
        },
      }}>
      <AntdTextArea
        count={undefined}
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
    </ConfigProvider>
  );
}

export default React.memo(TextArea);
