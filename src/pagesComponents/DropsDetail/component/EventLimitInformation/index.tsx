import React from 'react';
import TipsIcon from 'assets/images/icons/tips.svg';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
import { Tooltip } from 'antd';

interface IProps {
  className?: string;
  title?: string;
  content?: {
    label: string;
    value?: string | number;
  }[];
  tips?: {
    title: string;
    tooltip: string;
  };
}

function EventLimitInformation(props: IProps) {
  const { className, title, content, tips } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <div className={clsx('p-[24px] border-0 border-solid border-lineBorder', className)}>
      {title && (
        <p className=" flex justify-between items-center">
          <span className="text-lg font-medium text-textPrimary">{title}</span>
          {tips && (
            <Tooltip title={tips.tooltip}>
              {isSmallScreen ? (
                <div className="flex items-center cursor-pointer">
                  <TipsIcon />
                </div>
              ) : (
                <div className="flex items-center border border-solid border-lineDividers bg-fillHoverBg p-[8px] rounded-[8px] cursor-pointer">
                  <span className="mr-[10px]">{tips.title}</span>
                  <TipsIcon />
                </div>
              )}
            </Tooltip>
          )}
        </p>
      )}
      {content?.length ? (
        <div className="mt-[23px] flex flex-col">
          {content.map((item, index) => {
            return (
              <span
                key={index}
                className="text-textSecondary text-base font-medium mb-[16px] last:mb-0 flex justify-between items-center">
                <span className="text-textSecondary text-base font-medium">{item.label}</span>
                <span className="text-textPrimary text-base font-medium">{item.value}</span>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(EventLimitInformation);
