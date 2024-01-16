import { useState, useEffect } from 'react';
import { useRafInterval, useUnmount } from 'ahooks';

const PROGRESS_TIME = 75 * 1000;

export function useProgress() {
  const [percent, setPercent] = useState(0);

  const [accumulativeTime, setAccumulativeTime] = useState(0);

  const [progressing, setProgressing] = useState(false);

  const [progressingForFinish, setProgressingForFinish] = useState(false);
  const [stepTimeForFinish, setStepTimeForFinish] = useState(16);

  const clearProgressing = useRafInterval(() => {
    if (!progressing) return;
    setAccumulativeTime((time) => time + 16);
  }, 16);

  const clearFinishProgressing = useRafInterval(() => {
    if (!progressingForFinish) return;
    setAccumulativeTime((time) => time + stepTimeForFinish);
  }, 16);

  useEffect(() => {
    // perhaps 15 Multiple
    const progress = ((1 - Math.exp(-accumulativeTime / PROGRESS_TIME)) * 100).toFixed(4).slice(0, 5);
    setPercent(Number(progress));

    if (progress === '99.99') {
      setProgressing(false);
      return;
    }
    if (progress === '100.0') {
      setProgressingForFinish(false);
      return;
    }
  }, [accumulativeTime]);

  useUnmount(() => {
    clearFinishProgressing();
    clearProgressing();
  });

  const start = () => {
    setProgressing(true);
  };

  const pause = () => {
    setProgressing(false);
  };

  const reStart = () => {
    setAccumulativeTime(0);
    setProgressing(true);
  };

  const finish = () => {
    setProgressing(false);
    setStepTimeForFinish((15 * PROGRESS_TIME - accumulativeTime) / 30);
    setProgressingForFinish(true);
  };

  return {
    percent,
    finish,
    pause,
    start,
    reStart,
  };
}
