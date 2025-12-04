import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
const MILLISECOND_CONVERT_SECOND = 1000;
const SECOND_CONVERT_HOUR = 60 * 60;

export default function useCountdown(endTime: string | number) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const interval = useRef<number | null>(null);

  useEffect(() => {
    if (interval.current) {
      window.clearInterval(interval.current);
    }
    interval.current = window.setInterval(() => {
      const { hours, minutes, seconds } = getCountDown(endTime);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    return () => {
      interval.current && window.clearInterval(interval.current);
    };
  }, [endTime]);

  return {
    hours,
    minutes,
    seconds,
  };
}

function getCountDown(endTime: string | number) {
  const now = moment(new Date()).valueOf();

  const endTimestamp = Number(endTime);

  const timeDiff = endTimestamp - now;

  if (timeDiff < 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const seconds = Math.floor(timeDiff / MILLISECOND_CONVERT_SECOND);

  let hours = Math.floor(seconds / SECOND_CONVERT_HOUR);

  const minutes = Math.floor((seconds % SECOND_CONVERT_HOUR) / 60);
  const remainingSeconds = seconds % 60;

  if (hours >= 24) {
    hours -= 24;
  }

  return {
    hours: hours,
    minutes: minutes,
    seconds: remainingSeconds,
  };
}

export function convertToUtcTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60 * MILLISECOND_CONVERT_SECOND;

  const utcTimestamp = timestamp + offset;
  return utcTimestamp;
}
