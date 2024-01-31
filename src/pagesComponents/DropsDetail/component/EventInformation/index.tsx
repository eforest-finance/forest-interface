import React, { useMemo } from 'react';
import EventLimitCard from '../EventLimitCard';
import clsx from 'clsx';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import BigNumber from 'bignumber.js';
import { DropState } from 'api/types';
import { DropStateTag } from '../BasicInformation';
import { formatTokenPrice } from 'utils/format';

interface IProps {
  className?: string;
}

function EventInformation(props: IProps) {
  const { className } = props;
  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  const percentage = useMemo(() => {
    if (dropQuota?.state === DropState.End && dropDetailInfo?.burn) {
      return '100';
    }
    const claimAmountBig = new BigNumber(dropQuota?.claimAmount || 0);
    const totalAmountBig = new BigNumber(dropQuota?.totalAmount || 0);
    return claimAmountBig.div(totalAmountBig).multipliedBy(100).toFixed(2, BigNumber.ROUND_DOWN);
  }, [dropDetailInfo?.burn, dropQuota?.claimAmount, dropQuota?.state, dropQuota?.totalAmount]);

  const amount = useMemo(() => {
    if (dropQuota?.state === DropState.End && dropDetailInfo?.burn) {
      return `${formatTokenPrice(dropQuota?.claimAmount || 0)}/${formatTokenPrice(dropQuota?.claimAmount || 0)}`;
    }
    return `${formatTokenPrice(dropQuota?.claimAmount || 0)}/${formatTokenPrice(dropQuota?.totalAmount || 0)}`;
  }, [dropDetailInfo?.burn, dropQuota?.claimAmount, dropQuota?.state, dropQuota?.totalAmount]);

  return (
    <div className={clsx('w-full', className)}>
      <h1 className="text-xl mdTW:text-2xl text-textPrimary font-semibold">Event Information</h1>
      <div className="mt-[16px]">
        <div className="flex justify-between items-center text-base text-textSecondary font-medium">
          {dropQuota?.state === DropState.Live ? (
            <span>{`${percentage}% minted`}</span>
          ) : (
            <span>{dropQuota?.state !== undefined && DropStateTag[dropQuota.state].text}</span>
          )}

          <span>{amount}</span>
        </div>

        <div className="w-full h-[8px] rounded-[20px] bg-lineDividers mt-[16px] overflow-hidden">
          <div
            className="h-full rounded-[20px] bg-brandNormal"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
      <EventLimitCard className="mt-[32px]" />
    </div>
  );
}

export default React.memo(EventInformation);
