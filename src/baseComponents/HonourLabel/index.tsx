import { useMemo } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import StarSvg from 'assets/images/v2/star.svg';
import DiamondCloseSvg from 'assets/images/v2/diamond-close.svg';

export enum HonourTypeEnum {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
  Emerald = 'Emerald',
  Diamond = 'Diamond',
}

export const stylesMap: Record<HonourTypeEnum, string> = {
  [HonourTypeEnum.Bronze]: styles.bronze,
  [HonourTypeEnum.Silver]: styles.silver,
  [HonourTypeEnum.Gold]: styles.gold,
  [HonourTypeEnum.Platinum]: styles.platinum,
  [HonourTypeEnum.Emerald]: styles.halcyon,
  [HonourTypeEnum.Diamond]: styles.diamond,
};

export default function HonourLabel({
  text,
  className,
  theme = 'black',
}: {
  text: string;
  className?: string;
  theme?: 'black' | 'white';
}) {
  const displayText = useMemo(() => {
    const strArr = text.split(',');
    if (strArr[0] === HonourTypeEnum.Diamond) {
      return (
        <div className="flex items-center">
          <span className="mr-1">{strArr[0]}</span>
          <StarSvg />
          <DiamondCloseSvg />
          <span>{strArr[1]}</span>
        </div>
      );
    } else {
      return `${strArr[0]} ${strArr[2]}`;
    }
  }, [text]);

  const style = useMemo(() => {
    for (const honourName in stylesMap) {
      if (text.includes(honourName)) {
        return stylesMap[honourName as HonourTypeEnum];
      }
    }
    return undefined;
  }, [text]);

  return (
    <div
      className={clsx(
        'px-1 py-[1px] rounded-sm bg-fillMask1 flex justify-center items-center text-xxs font-semibold border-[1px] border-solid w-fit',
        style,
        className,
        theme === 'white' ? styles.white : '',
      )}>
      {displayText}
    </div>
  );
}
