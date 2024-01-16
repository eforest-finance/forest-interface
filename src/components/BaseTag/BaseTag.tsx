import { Tag } from 'antd';
import styles from './BaseTag.module.css';
import Close from 'assets/images/close.svg';
import React, { useCallback, useState } from 'react';

export default function BaseTag({
  tagClose,
  children,
}: {
  children?: React.ReactNode;
  tagClose: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const [isClose, setClose] = useState<boolean>(false);
  const onCloseHandler = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setClose(true);
      tagClose(e);
    },
    [tagClose],
  );
  return (
    <Tag
      className={`${styles['base-tag-wrapper']} ${!isClose ? '!flex justify-between items-center' : ''}`}
      closeIcon={<Close />}
      closable
      onClose={onCloseHandler}>
      <span>{children ?? null}</span>
    </Tag>
  );
}
