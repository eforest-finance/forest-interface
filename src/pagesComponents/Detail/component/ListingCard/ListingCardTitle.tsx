import moment from 'moment';
import { ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';

import styles from './style.module.css';
import React from 'react';
import {
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_ONE_HOUR,
  SECOND_PER_MINUTES,
  SECOND_PER_ONE_HOUR,
} from 'constants/time';
import Countdown, { CountdownStatus, CountdownType } from 'baseComponents/Countdown';
import Segmented from 'baseComponents/Segmented';
import { SegmentedValue } from 'antd/lib/segmented';
import { timeFormat } from 'pagesComponents/Detail/utils/timeFormat';

export enum ListingCardType {
  LISTING = 'listing',
  BID = 'bid',
}

interface IProps {
  currentRole?: SegmentedValue;
  onChangeCurrentRole?: (val: SegmentedValue) => void;
  showTime?: boolean;
  endTime?: string | number | null;
  timePrefix?: string;
  hasChange?: boolean;
  suffix?: ReactNode;
  type?: ListingCardType;
  isERC721?: boolean;
}

function ListingCardTitle(props: IProps) {
  const {
    currentRole,
    onChangeCurrentRole,
    showTime = true,
    endTime,
    hasChange = false,
    timePrefix = 'Sale ends on',
    suffix,
    type = ListingCardType.LISTING,
    isERC721,
  } = props;
  const [isCountdown, setIsCountdown] = useState<boolean>(false);
  const [countdownStatus, setCountdownStatus] = useState<CountdownStatus>(CountdownStatus.Normal);

  const isShowTimeCard = useMemo(() => {
    return (
      showTime &&
      endTime &&
      (currentRole === 'buy' || type === ListingCardType.BID || (isERC721 && currentRole === 'sell'))
    );
  }, [currentRole, endTime, isERC721, showTime, type]);

  useEffect(() => {
    if (endTime) {
      const now = moment(new Date()).valueOf();
      const endTimestamp = moment(endTime).valueOf();

      if (endTimestamp - now < MILLISECONDS_PER_ONE_HOUR) {
        setIsCountdown(true);
        setCountdownStatus(CountdownStatus.Danger);
        return;
      }
      if (endTimestamp - now < MILLISECONDS_PER_DAY) {
        setIsCountdown(true);
        setCountdownStatus(CountdownStatus.Normal);
        return;
      }
      setIsCountdown(false);
    }
  }, [endTime]);

  const ontimeupdate = (data: Record<CountdownType, number>) => {
    const seconds = data.Hour * SECOND_PER_ONE_HOUR + data.Minutes * SECOND_PER_MINUTES + data.Seconds;
    if (!seconds) return;
    if (seconds < SECOND_PER_ONE_HOUR) {
      setCountdownStatus(CountdownStatus.Danger);
    } else {
      setCountdownStatus(CountdownStatus.Normal);
    }
  };

  return (
    <div className={styles['listing-card-title']}>
      <div className="flex-1 flex flex-col justify-center">
        {isShowTimeCard ? (
          <>
            <span className={styles['time-panel-value']}>{`${timePrefix} ${timeFormat(endTime as string)}`}</span>
            {isCountdown && (
              <Countdown
                endTime={String(endTime)}
                className="mt-[16px]"
                status={countdownStatus}
                onChange={ontimeupdate}
              />
            )}
          </>
        ) : null}
      </div>
      {hasChange && (
        <div>
          <Segmented options={['buy', 'sell']} value={currentRole} onChange={onChangeCurrentRole} />
        </div>
      )}
      {suffix}
    </div>
  );
}

export default React.memo(forwardRef(ListingCardTitle));
