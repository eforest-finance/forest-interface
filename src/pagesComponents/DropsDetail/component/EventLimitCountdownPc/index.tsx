import { DropState } from 'api/types';
import clsx from 'clsx';
import { CountDown } from 'components/CountDown';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { dispatch } from 'store/store';

interface IProps {
  className?: string;
}

function EventLimitCountdownPc(props: IProps) {
  const { className } = props;

  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  const [countdownTime, setCountdownTime] = useState<number>();

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

  const onEnd = () => {
    console.log('onEnd');
    const state = dropQuota?.state === DropState.Upcoming ? DropState.Live : DropState.End;
    dispatch(setDropQuota({ state }));
  };

  return (
    <div className={clsx('p-[24px] border-0 border-solid border-lineBorder', className)}>
      {countdownTime ? (
        <>
          <CountDown
            onEnd={onEnd}
            title={title}
            value={dropQuota?.state === DropState.Live ? dropDetailInfo?.expireTime : dropDetailInfo?.startTime}
          />
        </>
      ) : (
        <span className="text-lg text-textSecondary font-medium">Event ended</span>
      )}
    </div>
  );
}

export default React.memo(EventLimitCountdownPc);
