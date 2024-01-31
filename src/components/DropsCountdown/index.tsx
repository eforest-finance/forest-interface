import { DropState } from 'api/types';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import useDropDetailGetState from 'store/state/dropDetailGetState';

interface IProps {
  className?: string;
}

function DropsCountdown(props: IProps) {
  const { className } = props;

  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  const [countdownTime, setCountdownTime] = useState<number>();

  const countdown = [
    {
      label: 'D',
      time: 2,
    },
    {
      label: 'H',
      time: 12,
    },
    {
      label: 'M',
      time: 22,
    },
    {
      label: 'S',
      time: 32,
    },
  ];

  const title = useMemo(() => {
    switch (dropQuota?.state) {
      case DropState.Upcoming:
        setCountdownTime(dropDetailInfo?.startTime);
        return 'Event starts in';
      case DropState.Live:
        setCountdownTime(dropDetailInfo?.expireTime);
        return 'Event ends in';
      default:
        setCountdownTime(undefined);
        return '';
    }
  }, [dropQuota?.state]);

  return (
    <div className={clsx('p-[24px] border-0 border-solid border-lineBorder', className)}>
      {countdownTime ? (
        <>
          {title && <h3 className="text-lg text-textPrimary font-medium">{title}</h3>}
          <div className="mt-[16px] flex items-center">
            {countdown.map((item) => {
              return (
                <div key={item.label} className="flex items-center justify-center">
                  <span className="flex justify-center items-center w-[48px] h-[48px] bg-fillHoverBg rounded-md text-2xl text-textPrimary font-semibold">
                    {item.time}
                  </span>
                  <span className="px-[12.5px] text-xs text-textSecondary font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <span className="text-lg text-textSecondary font-medium">Event ended</span>
      )}
    </div>
  );
}

export default React.memo(DropsCountdown);
