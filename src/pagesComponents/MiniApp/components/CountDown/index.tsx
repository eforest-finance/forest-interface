import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';

const CountDown = (props: { remainingTime: any; className?: any; noDays?: boolean }) => {
  const { remainingTime, className, noDays } = props;
  // 当前时间
  const currentTime = moment();
  // 终止时间
  const endTime = useMemo(() => {
    return moment().add(remainingTime, noDays ? 's' : 'm');
  }, [remainingTime, noDays]);

  // 时间差 /倒计时时间
  const [diffTime, setDiffTime] = useState(endTime.diff(currentTime, 's'));

  console.log('remainingTimeremainingTimeremainingTime', remainingTime, diffTime);

  useEffect(() => {
    setDiffTime(endTime.diff(currentTime, 's'));

    const timer = setInterval(() => {
      setDiffTime((prevDiffTime) => {
        if (prevDiffTime <= 1) {
          clearInterval(timer); // 当倒计时结束时清除定时器
          return 0;
        }
        return prevDiffTime - 1;
      });
    }, 1000);

    // 在组件卸载时或变化时清除定时器
    return () => clearInterval(timer);
  }, [remainingTime, noDays]);

  // 将秒转成时分秒
  const convertSecToHHmmss = useCallback(
    (sec: moment.DurationInputArg1) => {
      const currentSec = moment.duration(sec, 'seconds');
      if (noDays) {
        return moment({
          m: currentSec.minutes(),
          s: currentSec.seconds(),
        }).format('mm:ss');
      } else {
        return moment({
          h: currentSec.hours(),
          m: currentSec.minutes(),
          s: currentSec.seconds(),
        }).format('HH:mm:ss');
      }
    },
    [diffTime, remainingTime, noDays],
  );

  return <span className={className}>{convertSecToHHmmss(diffTime)}</span>;
};

export default CountDown;
