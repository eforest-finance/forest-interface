import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { PointsDetail } from 'api/types';

const NumberAdd = (props: { item: PointsDetail; frequency?: any }) => {
  const { item, frequency } = props;

  // const [currentAmount, setCurrentAmount] = useState(0);
  // 当前时间
  const currentTime = moment();
  // 终止时间
  const endTime = useMemo(() => {
    return moment().add(item.remainingTime, 'm');
  }, [item]);

  // 时间差 /倒计时时间
  const [diffTime, setDiffTime] = useState(endTime.diff(currentTime, 's'));

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
  }, [item.remainingTime]);

  if (item.remainingTime == 0) {
    return <span>{item.amount}</span>;
  }

  const moveAmount = Number(item.amount) - Math.floor(diffTime * (Number(item.amount) / (frequency * 60)));

  return <span>{moveAmount}</span>;
};

export default NumberAdd;
