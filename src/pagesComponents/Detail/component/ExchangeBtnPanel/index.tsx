'use client';
import { useRouter, useParams } from 'next/navigation';
import { MouseEventHandler, useMemo, useState } from 'react';
import useGetState from 'store/state/getState';

import styles from './style.module.css';
import Button from 'baseComponents/Button';
import { PortkeyAssetProvider } from 'aelf-web-login';
import getMaxNftQuantityOfSell from 'utils/getMaxNftQuantityOfSell';
import useDetailGetState from 'store/state/detailGetState';
import { message } from 'antd';
import { cancelListingMessage } from 'contract/formatErrorMsg';
import isTokenIdReuse from 'utils/isTokenIdReuse';

export default function ExchangeBtnPanel(options: {
  className?: string | undefined;
  nftBalance: number;
  onClickTransfer: MouseEventHandler;
}) {
  const navigator = useRouter();
  const { id, chainId } = useParams();
  const { className, nftBalance, onClickTransfer } = options;
  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { isSmallScreen } = infoState;
  const [sellLoading, setSellLoading] = useState<boolean>(false);

  const TransferButton = useMemo(
    () => (
      <Button
        className={`mdTW:mr-0 mr-[16px] mb-2 lgTW:mb-0 lgTW:mr-[16px] lgTW:w-auto lgTW:min-w-[140px] w-full ${
          isSmallScreen && 'mr-0'
        }`}
        disabled={!nftBalance}
        onClick={onClickTransfer}
        type="default"
        size="ultra">
        Transfer
      </Button>
    ),
    [isSmallScreen, nftBalance, onClickTransfer],
  );

  const sell = async () => {
    try {
      if (!nftInfo) return;
      if (!isTokenIdReuse(nftInfo)) {
        navigator.push(`/sale-info/${id}/${chainId}`);
        return;
      }
      setSellLoading(true);
      const res = await getMaxNftQuantityOfSell(chainId as Chain, nftInfo, walletInfo.address);

      if (res && res.max) {
        navigator.push(`/sale-info/${id}/${chainId}`);
      } else {
        message.error(cancelListingMessage);
      }
    } catch (error) {
      navigator.push(`/sale-info/${id}/${chainId}`);
    }
    setSellLoading(false);
  };

  return (
    <div className={`${styles['exchange-btn-panel']} mt-[16px] lgTW:mt-[32px] ${className}`}>
      <Button
        disabled={!nftBalance}
        loading={sellLoading}
        type="primary"
        className={`mdTW:mr-0 mr-[16px] mb-2 lgTW:mb-0 lgTW:mr-[16px] lgTW:w-auto lgTW:min-w-[140px] w-full ${
          isSmallScreen && 'mr-0'
        }`}
        size="ultra"
        onClick={sell}>
        Sell
      </Button>
      {walletInfo.portkeyInfo ? (
        <PortkeyAssetProvider originChainId={walletInfo.portkeyInfo.chainId} pin={walletInfo.portkeyInfo.pin}>
          {TransferButton}
        </PortkeyAssetProvider>
      ) : (
        TransferButton
      )}
    </div>
  );
}
