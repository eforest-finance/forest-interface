import clsx from 'clsx';
import React, { useRef } from 'react';
import Share from 'assets/images/icons/share.svg';
import Calendar from 'assets/images/icons/calendar.svg';
import styles from './index.module.css';
import useGetState from 'store/state/getState';
import ShareModal from '../ShareModal';
import { useModal } from '@ebay/nice-modal-react';
import { DropState } from 'api/types';
import moment from 'moment';
import { useIntersection } from 'react-use';

interface IProps {
  name?: string;
  startTime?: number;
  expireTime?: number;
  status?: DropState;
  className?: string;
}

export const DropStateTag: Record<
  DropState,
  {
    text: string;
    background: string;
    color: string;
  }
> = {
  [DropState.Live]: {
    text: 'Live',
    background: 'bg-functionalLinkBg',
    color: 'text-brandNormal',
  },
  [DropState.Canceled]: {
    text: '',
    background: '',
    color: '',
  },
  [DropState.End]: {
    text: 'Ended',
    background: 'bg-lineDividers',
    color: 'text-textSecondary',
  },
  [DropState.Upcoming]: {
    text: 'Upcoming',
    background: 'bg-functionalWarningBg',
    color: 'text-functionalWarning',
  },
};

function BasicInformation(props: IProps) {
  const { name, startTime, expireTime, status, className } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const shareModal = useModal(ShareModal);

  const formatTime = (time: number) => {
    return moment(time).format('MM/DD/YYYY');
  };

  const bottom = Math.floor((window.innerHeight || document.documentElement.clientHeight) - 62);

  const basiInformationRef = useRef(null);
  const intersection = useIntersection(basiInformationRef, {
    root: document.body,
    rootMargin: `0px 0px -${bottom}px 0px`,
  });

  return (
    <div
      ref={basiInformationRef}
      className={clsx(
        styles['basic-information'],
        isSmallScreen && 'sticky z-[999] top-[61px] left-0 border-0 border-solid border-lineBorder',
        isSmallScreen && intersection?.isIntersecting && 'border-b',
        className,
      )}>
      <div className="text-xl overflow-hidden whitespace-nowrap text-ellipsis mdTW:text-4xl text-textPrimary font-semibold text-center">
        {name}
      </div>
      <div className="mt-[16px] flex justify-between items-center">
        <div className={clsx(styles['basic-information-time'], 'flex items-center')}>
          {!isSmallScreen && <Calendar />}
          {startTime && expireTime && (
            <span className="ml-0 mdTW:ml-[8px] text-sm mdTW:text-base text-textSecondary font-medium">
              {`${formatTime(startTime)} ~ ${formatTime(expireTime)}`}
            </span>
          )}

          {status !== undefined && DropStateTag[status] ? (
            <span
              className={clsx(
                'flex h-[24px] ml-[16px] justify-center items-center rounded-[4px] text-sm font-medium px-[8px]',
                DropStateTag[status].background,
                DropStateTag[status].color,
              )}>
              {DropStateTag[status].text}
            </span>
          ) : null}
        </div>
        <div className={styles['share-icon']} onClick={() => shareModal.show()}>
          <Share />
        </div>
      </div>
    </div>
  );
}

export default React.memo(BasicInformation);
