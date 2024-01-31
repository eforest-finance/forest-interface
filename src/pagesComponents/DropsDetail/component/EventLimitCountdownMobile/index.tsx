import clsx from 'clsx';
import React, { useState } from 'react';

interface IProps {
  className?: string;
}

function EventLimitCountdownMobile(props: IProps) {
  const { className } = props;

  const [hasCountdown, sethasCountdown] = useState<boolean>(false);

  return (
    <div className={clsx('flex items-center', hasCountdown ? 'justify-start' : 'justify-center', className)}>
      {hasCountdown ? (
        <span className="text-base text-textPrimary font-semibold">{`Event ends in ${2} D 20:16:45`}</span>
      ) : (
        <span className="text-base text-textSecondary font-medium">Event ended</span>
      )}
    </div>
  );
}

export default React.memo(EventLimitCountdownMobile);
