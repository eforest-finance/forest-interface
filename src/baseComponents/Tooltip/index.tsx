import { Tooltip as AntdTooltip, TooltipProps as AntdTooltipProps } from 'antd';
import React, { memo } from 'react';

export type TooltipProps = AntdTooltipProps;

function Tooltip({ children, ...params }: TooltipProps) {
  return <AntdTooltip {...params}>{children}</AntdTooltip>;
}

export default memo(Tooltip);
