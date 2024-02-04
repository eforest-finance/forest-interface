import { DropState } from 'api/types';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { useCountDown } from 'ahooks';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { dispatch } from 'store/store';
import { TDate } from 'ahooks/lib/useCountDown';

interface IProps {
  className?: string;
  value: TDate;
}

function EventLimitCountdownMobile(props: IProps) {
  const { className, value } = props;

  const onEnd = () => {
    const state = dropQuota?.state === DropState.Upcoming ? DropState.Live : DropState.End;
    dispatch(setDropQuota({ state }));
  };

  const [, formattedResult] = useCountDown({
    targetDate: value,
    onEnd,
  });
  const [countdownTime, setCountdownTime] = useState<number>();
  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  const { days, hours, minutes, seconds } = formattedResult;

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
  }, [dropDetailInfo?.expireTime, dropDetailInfo?.startTime, dropQuota?.state]);

  return (
    <div className={clsx('flex items-center', countdownTime ? 'justify-start' : 'justify-center', className)}>
      {countdownTime ? (
        <span className="text-base text-textPrimary font-semibold">{`${title} ${days} D ${hours}:${minutes}:${seconds}`}</span>
      ) : (
        <span className="text-base text-textSecondary font-medium">Event ended</span>
      )}
    </div>
  );
}

export default React.memo(EventLimitCountdownMobile);
