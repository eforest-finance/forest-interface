import React, { useMemo } from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import styles from './index.module.css';
import { SizeType as AntdSizeType } from 'antd/lib/config-provider/SizeContext';

type ExtSizeType = 'ultra' | 'mini';
type SizeType = AntdSizeType | ExtSizeType;

interface ButtonProps extends Omit<AntdButtonProps, 'size'> {
  size?: SizeType;
  isFull?: boolean;
}

function Button(props: ButtonProps) {
  const { children, size = 'large', isFull } = props;
  const extSizeType = ['ultra', 'mini'];

  const sizeStyle: Record<ExtSizeType, string> = {
    ultra: styles['forest-btn-ultra'],
    mini: styles['forest-btn-mini'],
  };

  const isExtSize = useMemo(() => size && extSizeType.includes(size), [size]);

  return (
    <AntdButton
      {...props}
      size={isExtSize ? 'middle' : (size as AntdSizeType)}
      className={`${styles.button} ${isExtSize ? sizeStyle[size as ExtSizeType] : ''} ${
        isFull && styles['button-full']
      } ${props.className}`}>
      {children}
    </AntdButton>
  );
}

export default React.memo(Button);
