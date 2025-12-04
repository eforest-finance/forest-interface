import { Segmented as AntdSegmented, SegmentedProps as AntdSegmentedProps } from 'antd';
import clsx from 'clsx';
import React, { forwardRef, memo } from 'react';
import styles from './index.module.css';

export type SegmentedProps = Omit<AntdSegmentedProps, 'ref'>;

function Segmented(props: SegmentedProps) {
  return <AntdSegmented {...props} className={clsx(styles['forest-segmented'], props.className)} />;
}

export default memo(forwardRef(Segmented));
