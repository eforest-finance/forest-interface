import { message } from 'antd';
import nftPreview from 'assets/images/nftPreview.jpg';
import useTransfer from 'pagesComponents/Detail/hooks/useTransfer';
import { memo, useEffect, useState } from 'react';

import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import Image, { StaticImageData } from 'next/image';
import { addPrefixSuffix } from 'utils';
import { decodeAddress as aelfDecodeAddress } from 'utils/aelfUtils';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import Input from 'baseComponents/Input';
import { matchErrorMsg } from 'contract/formatErrorMsg';
// import { checkWalletSecurity } from 'aelf-web-login';
import { debounce } from 'lodash-es';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';

function TransferModal(options: { quantity: number; onClose?: () => void }) {
  const modal = useModal();
  const pathname = usePathname();

  const { walletInfo, aelfInfo } = useGetState();

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const transfer = useTransfer(nftInfo?.chainId);
  const [amount, setAmount] = useState<number>();
  const [target, setTarget] = useState<string>('');
  const [error, setError] = useState(false);
  const [errorTip, setErrorTip] = useState('');
  const { quantity, onClose } = options;

  const [curImage, setCurImage] = useState<string | StaticImageData>(nftInfo?.previewImage || nftPreview);

  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);

  useEffect(() => {
    if (nftInfo?.previewImage) {
      setCurImage(nftInfo.previewImage);
    }
  }, [nftInfo?.previewImage]);

  const getWalletSecurity = async () => {
    // if (walletInfo.portkeyInfo && walletInfo.portkeyInfo?.caInfo?.caHash) {
    //   try {
    //     const walletSecurity = await checkWalletSecurity({
    //       originChainId: walletInfo.portkeyInfo.chainId,
    //       targetChainId: aelfInfo.curChain,
    //       caHash: walletInfo.portkeyInfo.caInfo.caHash,
    //     });
    //     if (walletSecurity.status === 'TransferSafe' || walletSecurity.status === 'OriginChainSafe') {
    //       return true;
    //     } else {
    //       message.error(matchErrorMsg(walletSecurity.message));
    //       return false;
    //     }
    //   } catch (error) {
    //     return true;
    //   }
    // } else {
    //   return true;
    // }
    return true;
  };

  const [loading, setLoading] = useState<boolean>(false);

  const onCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const toTransfer = debounce(async () => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }

    if (nftInfo) {
      setLoading(true);
      if (aelfDecodeAddress(target)) {
        setError(false);

        const security = await getWalletSecurity();

        if (!security) {
          setLoading(false);
          return;
        }
        const result = await transfer({
          symbol: nftInfo?.nftSymbol,
          spender: target,
          amount: amount || 1,
        });
        if (result) {
          setLoading(false);
          onCloseModal();
        }
      } else {
        message.error('Invalid address.');
        setLoading(false);
      }
    }
  }, 200);

  const onAmountChange = (value: string) => {
    const val = Number(value);
    setAmount(isNaN(val) ? 0 : val);
  };

  const decodeAddress = (value: string) => {
    if (value) {
      if (aelfDecodeAddress(value)) {
        setError(false);
        if (value === walletInfo.address || value === addPrefixSuffix(walletInfo.address)) {
          setErrorTip(`Can't transfer to the same address. Please use a different address.`);
          setError(true);
        }
      } else {
        setErrorTip('Invalid address.');
        setError(true);
      }
    }
  };

  const onAddressChange = (value: string) => {
    setTarget(value);
    decodeAddress(value);
  };

  const onAddressBlur = () => {
    decodeAddress(target);
  };

  const getTransferDisabled = () => {
    return !target || !quantity || (quantity > 1 ? (amount ? amount > quantity : true) : false) || error;
  };

  useEffect(() => {
    setTarget('');
    setAmount(undefined);
    setError(false);
  }, [modal.visible]);

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  return (
    <Modal
      className={`${styles['transfer-modal']} ${isSmallScreen && styles['mobile-transfer-modal']}`}
      title={'Transfer'}
      open={modal.visible}
      onCancel={onCloseModal}
      footer={
        <Button type="primary" size="ultra" onClick={toTransfer} loading={loading} disabled={getTransferDisabled()}>
          Transfer
        </Button>
      }>
      <div className={styles.content}>
        <Image
          src={curImage}
          width={240}
          height={240}
          alt="nft"
          onError={(e) => {
            setCurImage(nftPreview);
            (e.target as HTMLElement).className = 'broken';
          }}
        />
        <div className={styles['input-panel']}>
          <p className="text-[var(--color-primary)] text-[18px] leading-[27px] font-medium">Amount</p>
          <Input
            disabled={quantity <= 1}
            className={`${(amount ? amount > quantity : false) && styles.error}`}
            onChange={(e) => onAmountChange(e.target.value)}
            max={quantity}
            min={1}
            status={(amount ? amount > quantity : false) ? 'error' : undefined}
            value={quantity <= 1 ? quantity : amount}
            placeholder="Amount"
          />
        </div>
        <div className={styles['input-panel']}>
          <p className="text-[var(--color-primary)] text-[18px] leading-[27px] font-medium">Wallet address</p>
          <Input
            onChange={(e) => onAddressChange(e.target.value)}
            value={target}
            status={error ? 'error' : undefined}
            onBlur={onAddressBlur}
            placeholder={`ELF_2M9aqY......1K5zoPAL5Dw_${aelfInfo.curChain}`}
          />
          {error ? (
            <p className={`${styles['error-tip']} font-medium`}>{errorTip}</p>
          ) : (
            <p className={`${styles.tip} font-medium`}>“{nftInfo?.tokenName || ''}” will be transfer to ...</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(TransferModal));
