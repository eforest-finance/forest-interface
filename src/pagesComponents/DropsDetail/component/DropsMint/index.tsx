import Button from 'baseComponents/Button';
import React, { useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import EventLimitCountdownMobile from '../EventLimitCountdownMobile';
import clsx from 'clsx';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { DropState } from 'api/types';
import BigNumber from 'bignumber.js';
import { useModal } from '@ebay/nice-modal-react';
import MintModal from '../MintModal';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { getDropQuota } from 'pagesComponents/DropsDetail/utils/getDropQuota';
import { dispatch } from 'store/store';
import { setDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';
import { message } from 'antd';
import { sleep } from 'utils';
import { useRouter } from 'next/navigation';

interface IProps {
  className?: string;
}

enum MintStateType {
  'MintFree',
  'Mint',
  'SoldOut',
  'Upcoming',
  'Minted',
}

const MintButtonInfo: Record<
  MintStateType,
  {
    text: string;
  }
> = {
  [MintStateType.Mint]: {
    text: 'Mint',
  },
  [MintStateType.MintFree]: {
    text: 'Mint for Free',
  },
  [MintStateType.Minted]: {
    text: 'Minted',
  },
  [MintStateType.Upcoming]: {
    text: 'Upcoming',
  },
  [MintStateType.SoldOut]: {
    text: 'Sold Out',
  },
};

function DropsMint(props: IProps) {
  const { className } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const mintModal = useModal(MintModal);
  const { login, isLogin } = useCheckLoginAndToken();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const nav = useRouter();

  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  const mintState = useMemo(() => {
    const limitBig = new BigNumber(dropQuota?.addressClaimLimit || 0);
    const amountBig = new BigNumber(dropQuota?.addressClaimAmount || 0);
    const claimAmountBig = new BigNumber(dropQuota?.claimAmount || 0);
    const totalAmountBig = new BigNumber(dropQuota?.totalAmount || 0);
    const mintPrice = new BigNumber(dropDetailInfo?.mintPrice || 0);
    switch (dropQuota?.state) {
      case DropState.Upcoming:
        return MintStateType.Upcoming;
      case DropState.Live:
        if (claimAmountBig.isEqualTo(totalAmountBig)) {
          return MintStateType.SoldOut;
        } else {
          if (amountBig.isEqualTo(limitBig)) {
            return MintStateType.Minted;
          } else {
            if (mintPrice.isEqualTo(0)) {
              return MintStateType.MintFree;
            } else {
              return MintStateType.Mint;
            }
          }
        }
      case DropState.End:
        return MintStateType.SoldOut;
      default:
        return MintStateType.SoldOut;
    }
  }, [dropDetailInfo?.mintPrice, dropQuota]);

  const disabled = useMemo(() => {
    return isCancel || !(mintState === MintStateType.Mint || mintState === MintStateType.MintFree);
  }, [mintState, isCancel]);

  const onMint = async () => {
    if (isLogin) {
      try {
        setMintLoading(true);
        const res = await getDropQuota();
        if (res.state === DropState.Canceled) {
          setIsCancel(true);
          setMintLoading(false);
          message.error("The event has ended. You'll be automatically redirected to the Drops page.", 3000);
          await sleep(3000);
          // nav.back();
        } else {
          setIsCancel(false);
          setMintLoading(false);
          dispatch(setDropQuota({ ...res }));
          if (res.state === DropState.End) {
            message.error('The event has ended.');
            return;
          }
          mintModal.show();
        }
      } catch (error) {
        /* empty */
      }
    } else {
      login();
    }
  };

  return (
    <div
      className={clsx(
        isSmallScreen &&
          'fixed bottom-0 left-0 w-full border-0 border-t border-solid border-t-lineBorder bg-fillPageBg p-[16px] z-40',
        className,
      )}>
      {isSmallScreen && <EventLimitCountdownMobile />}
      <Button
        loading={mintLoading}
        disabled={disabled}
        type="primary"
        className="!w-full mt-[16px] mdTW:mt-[32px]"
        size="ultra"
        onClick={onMint}>
        {MintButtonInfo[mintState].text}
      </Button>
    </div>
  );
}

export default React.memo(DropsMint);
