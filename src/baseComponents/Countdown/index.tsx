import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';
import styles from './index.module.css';
import useCountdown from 'hooks/useCountDown';
import { timeFillDigits } from 'utils/format';

export enum CountdownStatus {
  Danger = 'danger',
  Normal = 'normal',
}

interface ICountdownProps {
  className?: any;
  endTime: string | number;
  status?: CountdownStatus;
  onChange?: (data: Record<CountdownType, number>) => void;
}

export enum CountdownType {
  Hour = 'Hour',
  Minutes = 'Minutes',
  Seconds = 'Seconds',
}

function Countdown({ className, endTime, status = CountdownStatus.Normal, onChange }: ICountdownProps) {
  const { hours, minutes, seconds } = useCountdown(endTime);

  const countdownValue: Record<CountdownType, string> = {
    Hour: timeFillDigits(hours),
    Minutes: timeFillDigits(minutes),
    Seconds: timeFillDigits(seconds),
  };

  const timeColor = {
    [CountdownStatus.Normal]: 'text-textPrimary',
    [CountdownStatus.Danger]: 'text-functionalDanger',
  };

  const countdownType: CountdownType[] = [CountdownType.Hour, CountdownType.Minutes, CountdownType.Seconds];

  useEffect(() => {
    onChange &&
      onChange({
        Hour: hours,
        Minutes: minutes,
        Seconds: seconds,
      });
  }, [hours, minutes, seconds, onChange]);

  return (
    <div className={clsx(styles.countdown, className)}>
      {countdownType.map((item) => {
        return (
          <div key={item} className={styles['countdown-card']}>
            <div className={clsx(styles['countdown-card-time'], timeColor[status])}>{countdownValue[item]}</div>
            <div className={styles['countdown-card-title']}>{item}</div>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(Countdown);
