import { useCountDown } from 'ahooks';
import { TDate } from 'ahooks/lib/useCountDown';

import st from './style.module.css';

interface ICountDownProps {
  title?: string;
  value: TDate;
  onEnd?: () => void;
}

export function CountDown({ value, onEnd, title = 'Ends in' }: ICountDownProps) {
  const [, formattedResult] = useCountDown({
    targetDate: value,
    onEnd,
  });
  const { days, hours, minutes, seconds } = formattedResult;

  return (
    <div className={st['count-down-wrapper']}>
      <span className={st['count-down-title']}>{title}</span>
      <div className={st['count-down-content']}>
        <span className={st['count-down-value']}>{days}</span>
        <span className={st['count-down-value-unit']}>D</span>
        <span className={st['count-down-value']}>{hours}</span>
        <span className={st['count-down-value-unit']}>H</span>
        <span className={st['count-down-value']}>{minutes}</span>
        <span className={st['count-down-value-unit']}>M</span>
        <span className={st['count-down-value']}>{seconds}</span>
        <span className={st['count-down-value-unit']}>S</span>
      </div>
    </div>
  );
}
