import Button from 'baseComponents/Button';
import React, { useMemo, useState } from 'react';
import useGetState from 'store/state/getState';
import EventLimitCountdownMobile from '../EventLimitCountdownMobile';
import clsx from 'clsx';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { DropState } from 'api/types';
import { useModal } from '@ebay/nice-modal-react';
import MintModal from '../MintModal';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { updateDropQuota } from 'pagesComponents/DropsDetail/utils/getDropQuota';
import { getMintState } from 'pagesComponents/DropsDetail/utils/getMintState';
import { message } from 'antd';
import { DropMinted } from 'contract/formatErrorMsg';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { TSignatureParams, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

interface IProps {
  className?: string;
}

export enum MintStateType {
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
  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const mintModal = useModal(MintModal);
  const { login, isLogin } = useCheckLoginAndToken();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  // const { wallet } = useWebLogin();
  const { walletInfo: wallet } = useConnectWallet();

  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

  const mintState = useMemo(() => {
    const state = getMintState(dropQuota, dropDetailInfo?.mintPrice);
    return state;
  }, [dropDetailInfo?.mintPrice, dropQuota]);

  const disabled = useMemo(() => {
    return isCancel || !(mintState === MintStateType.Mint || mintState === MintStateType.MintFree);
  }, [mintState, isCancel]);

  const onMint = async () => {
    if (isLogin) {
      if (!dropDetailInfo?.dropId) return;

      const userWalletAddress = walletInfo.address || wallet.address;
      if (!userWalletAddress) {
        return;
      }

      try {
        setMintLoading(true);
        const res = await updateDropQuota({
          dropId: dropDetailInfo?.dropId,
          address: userWalletAddress,
        });
        const state = res.state;
        const mintState = getMintState(res.dropQuota, dropDetailInfo?.mintPrice);
        setMintLoading(false);
        switch (state) {
          case DropState.Canceled:
            setIsCancel(true);
            return;
          case DropState.End:
            setIsCancel(false);
            return;
          default:
            setIsCancel(false);
            if (mintState === MintStateType.Mint || mintState === MintStateType.MintFree) {
              mintModal.show();
            } else {
              message.error(DropMinted);
            }
            return;
        }
      } catch (error) {
        setMintLoading(false);
      }
    } else {
      login();
    }
  };

  return (
    <div
      className={clsx(
        isSmallScreen &&
          'fixed bottom-0 left-0 w-full border-0 border-t border-solid border-t-lineBorder bg-fillPageBg p-[16px] z-[999]',
        className,
      )}>
      {isSmallScreen && (
        <EventLimitCountdownMobile
          value={dropQuota?.state === DropState.Live ? dropDetailInfo?.expireTime : dropDetailInfo?.startTime}
        />
      )}
      <Button
        loading={mintLoading}
        disabled={disabled}
        type="primary"
        className="!w-full mt-[16px] mdTW:mt-[32px]"
        size="ultra"
        millisecondOfThrottle={300}
        onClick={onMint}>
        {MintButtonInfo[mintState].text}
      </Button>
    </div>
  );
}

export default React.memo(DropsMint);
