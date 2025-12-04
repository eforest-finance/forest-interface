import React, { MouseEvent } from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import styles from './index.module.css';
import { SizeType as AntdSizeType } from 'antd/lib/config-provider/SizeContext';
import { useThrottleFn } from 'ahooks';

type ExtSizeType = 'ultra' | 'mini';
type SizeType = AntdSizeType | ExtSizeType;

interface ButtonProps extends Omit<AntdButtonProps, 'size'> {
  size?: SizeType;
  isFull?: boolean;
  millisecondOfThrottle?: number;
}

function Button(props: ButtonProps) {
  const { children, size = 'large', isFull, millisecondOfThrottle = 0 } = props;
  const extSizeType = ['ultra', 'mini'];

  const sizeStyle: Record<ExtSizeType, string> = {
    ultra: styles['forest-btn-ultra'],
    mini: styles['forest-btn-mini'],
  };

  const isExtSize = size && extSizeType.includes(size);

  const { run: buttonClickHandler } = useThrottleFn(
    (e: MouseEvent<HTMLElement>) => {
      props.onClick && props.onClick(e);
    },
    { wait: millisecondOfThrottle },
  );

  return (
    <AntdButton
      {...props}
      size={isExtSize ? 'middle' : (size as AntdSizeType)}
      onClick={buttonClickHandler}
      className={`${styles.button} ${isExtSize ? sizeStyle[size as ExtSizeType] : ''} ${
        isFull && styles['button-full']
      } ${props.className}`}>
      {children}
    </AntdButton>
  );
}

export default React.memo(Button);
