import React from 'react';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
import EventLimitInformation from '../EventLimitInformation';
import DropsCountdown from 'components/DropsCountdown';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import BigNumber from 'bignumber.js';
import { DropState } from 'api/types';

interface IProps {
  className?: string;
}

function EventLimitCard(props: IProps) {
  const { className } = props;

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  return (
    <div className={clsx('w-full bg-fillPageBg border border-solid border-lineBorder rounded-lg', className)}>
      {!isSmallScreen && <DropsCountdown className="border-b" />}
      <EventLimitInformation
        className="border-b"
        title="Limit"
        content={[
          {
            label: 'Limit per user:',
            value: formatTokenPrice(dropDetailInfo?.addressClaimLimit || 0),
          },
          {
            label: 'Total supply:',
            value: formatTokenPrice(dropDetailInfo?.totalAmount || 0),
          },
        ]}
        tips={
          dropQuota?.state === DropState.Live && dropDetailInfo?.burn
            ? {
                title: 'Limited-Time Event',
                tooltip:
                  "Limited-Time Event: NFTs can only be minted during the event, and any NFTs not minted will be burned upon the event's conclusion.",
              }
            : undefined
        }
      />
      <EventLimitInformation
        title="Price"
        content={[
          {
            label: 'price',
            value: new BigNumber(dropDetailInfo?.mintPrice || 0).isEqualTo(0)
              ? ['Free']
              : [
                  `${formatTokenPrice(dropDetailInfo?.mintPrice || 0)} ELF`,
                  formatUSDPrice(dropDetailInfo?.mintPriceUsd || 0),
                ],
          },
        ]}
      />
    </div>
  );
}

export default React.memo(EventLimitCard);
