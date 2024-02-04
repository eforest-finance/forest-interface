import { message } from 'antd';
import nftPreview from 'assets/images/nftPreview.jpg';
import useTransfer from 'pagesComponents/Detail/hooks/useTransfer';
import { ChangeEvent, ReactNode, memo, useEffect, useMemo, useState } from 'react';

import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import Image, { StaticImageData } from 'next/image';
import { addPrefixSuffix, getExploreLink } from 'utils';
import { decodeTransferAddress as aelfDecodeAddress } from 'utils/aelfUtils';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import { matchErrorMsg } from 'contract/formatErrorMsg';
import { WalletType, checkWalletSecurity, useWebLogin } from 'aelf-web-login';
import { debounce } from 'lodash-es';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import InputQuantity from '../BuyNowModal/components/InputQuantity';
import TransferToInput from './components/TransforToInput';
import BigNumber from 'bignumber.js';
import ResultModal from 'components/ResultModal';
import PromptModal from 'components/PromptModal';
import { TransferMessage } from 'constants/promptMessage';
import CrossChainTransferModal, { CrossChainTransferType } from 'components/CrossChainTransferModal';
import { isERC721 } from 'utils/isTokenIdReuse';
import { handlePlurality } from 'utils/handlePlurality';
import { formatTokenPrice } from 'utils/format';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import styles from './style.module.css';

function TransferModal(options: { quantity: number; onClose?: () => void }) {
  const modal = useModal();
  const resultModal = useModal(ResultModal);
  const promptModal = useModal(PromptModal);
  const pathname = usePathname();

  const { walletInfo, aelfInfo } = useGetState();

  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const { detailInfo } = useDetailGetState();
  const { nftInfo, nftNumber } = detailInfo;
  const transfer = useTransfer(nftInfo?.chainId);
  const [addressError, setAddressError] = useState(false);
  const [addressErrorTip, setAddressErrorTip] = useState<ReactNode>('');
  const [quantityError, setQuantityError] = useState('');
  const { quantity, onClose } = options;

  const { walletType } = useWebLogin();
  const isPortkeyConnected = walletType === WalletType.portkey;

  const [curImage, setCurImage] = useState<string | StaticImageData>(nftInfo?.previewImage || nftPreview);

  const { getAccountInfoSync } = useWalletSyncCompleted(nftInfo?.chainId);

  useEffect(() => {
    if (nftInfo?.previewImage) {
      setCurImage(nftInfo.previewImage);
    }
  }, [nftInfo?.previewImage]);

  const getWalletSecurity = async () => {
    if (walletInfo.portkeyInfo && walletInfo.portkeyInfo?.caInfo?.caHash) {
      try {
        const walletSecurity = await checkWalletSecurity({
          originChainId: walletInfo.portkeyInfo.chainId,
          targetChainId: aelfInfo.curChain,
          caHash: walletInfo.portkeyInfo.caInfo.caHash,
        });
        if (walletSecurity.status === 'TransferSafe' || walletSecurity.status === 'OriginChainSafe') {
          return true;
        } else {
          message.error(matchErrorMsg(walletSecurity.message));
          return false;
        }
      } catch (error) {
        return true;
      }
    } else {
      return true;
    }
  };

  const [loading, setLoading] = useState<boolean>(false);

  const onCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  const onTransfer = async () => {
    if (nftInfo) {
      try {
        setLoading(true);
        if (aelfDecodeAddress(inputAddress)) {
          setAddressError(false);
          const security = await getWalletSecurity();

          if (!security) {
            setLoading(false);
            return Promise.reject();
          }
          const result = await transfer({
            symbol: nftInfo?.nftSymbol,
            spender: inputAddress,
            amount: Number(inputQuantity) || 1,
          });
          if (result && result.TransactionId) {
            onCloseModal();
            promptModal.hide();
            const explorerUrl = getExploreLink(result.TransactionId, 'transaction', nftInfo?.chainId);
            resultModal.show({
              previewImage: nftInfo?.previewImage || '',
              title: 'Transfer Successfully Completed!',
              description: `You have transferred the ${nftInfo.tokenName} NFT in the ${nftInfo.nftCollection?.tokenName} Collection.`,
              hideButton: true,
              info: {
                logoImage: nftInfo.nftCollection?.logoImage || '',
                subTitle: nftInfo.nftCollection?.tokenName,
                title: nftInfo.tokenName,
                extra: isERC721(nftInfo) ? undefined : handlePlurality(Number(inputQuantity), 'item'),
              },
              jumpInfo: {
                url: explorerUrl,
              },
            });
          }
        } else {
          message.error('Invalid address.');
        }
      } catch (error) {
        setLoading(false);
        return Promise.reject(error);
      }
      setLoading(false);
    }
  };

  const toTransfer = debounce(async () => {
    modal.hide();
    promptModal.show({
      nftInfo: {
        image: nftInfo?.previewImage || '',
        collectionName: nftInfo?.nftCollection?.tokenName,
        nftName: nftInfo?.tokenName,
        item: isERC721(nftInfo!) ? undefined : handlePlurality(Number(inputQuantity) || 1, 'item'),
      },
      title: TransferMessage.title,
      content: {
        title: walletInfo.portkeyInfo ? TransferMessage.portkey.title : TransferMessage.default.title,
        content: walletInfo.portkeyInfo ? TransferMessage.portkey.message : TransferMessage.default.message,
      },
      initialization: onTransfer,
      onClose: () => {
        promptModal.hide();
      },
    });
  }, 200);

  const transferModal = useModal(CrossChainTransferModal);
  const handleTransferShow = () => {
    modal.hide();
    transferModal.show({
      type: CrossChainTransferType.nft,
      onClose: () => {
        transferModal.hide();
        modal.show();
      },
    });
  };

  const decodeAddress = (value: string) => {
    if (value) {
      if (aelfDecodeAddress(value)) {
        setAddressError(false);
        setAddressErrorTip('');
        if (value === walletInfo.address || value === addPrefixSuffix(walletInfo.address)) {
          setAddressErrorTip(`Can't transfer to the same address. Please use a different address.`);
          setAddressError(true);
          return;
        }
        if (value.includes('_AELF')) {
          setAddressErrorTip(
            <div>
              <span className={`${isPortkeyConnected && 'text-[var(--text-primary)]'}`}>
                Currently, Forest only supports NFT transfers between SideChain addresses.You can{' '}
              </span>
              {isPortkeyConnected ? (
                <span className="cursor-pointer text-[var(--functional-link)]" onClick={handleTransferShow}>
                  manually transfer NFTs from SideChain to your MainChain address.
                </span>
              ) : (
                'manually transfer NFTs from SideChain to your MainChain address.'
              )}
            </div>,
          );
          setAddressError(true);
          return;
        }
        setAddressErrorTip('');
        setAddressError(false);
      } else {
        setAddressErrorTip('Invalid address.');
        setAddressError(true);
      }
    }
  };

  const onAddressBlur = () => {
    decodeAddress(inputAddress);
  };

  const getTransferDisabled = () => {
    return (
      !inputAddress ||
      !inputQuantity ||
      (quantity > 1 ? (inputQuantity ? Number(inputQuantity) > Number(nftNumber.nftBalance) : true) : false) ||
      !!quantityError ||
      addressError
    );
  };

  useEffect(() => {
    setInputAddress('');
    setAddressError(false);
    setAddressErrorTip('');
    setQuantityError('');
  }, [modal.visible]);

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  const [inputQuantity, setInputQuantity] = useState<number | string>('');
  const [inputAddress, setInputAddress] = useState('');

  useEffect(() => {
    if (nftNumber.nftTotalSupply === '1') {
      setInputQuantity('1');
      return;
    }
    setInputQuantity('');
  }, [nftNumber.nftTotalSupply]);

  const inputQuantityDisabled = useMemo(() => {
    return nftNumber.nftTotalSupply === '1';
  }, [nftNumber.nftTotalSupply]);

  const onChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value || BigNumber(e.target.value).isZero()) {
      setInputQuantity('');
      setQuantityError('');
      return;
    }
    const bigValue = BigNumber(Number(formatInputNumber(e.target.value)));
    setInputQuantity(bigValue.toNumber());
    if (bigValue.gt(nftNumber.nftBalance)) {
      setQuantityError('The value exceeds the quantity you own.');
      return;
    }
    setQuantityError('');
  };

  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputAddress(e.target.value);
    decodeAddress(value);
  };

  return (
    <Modal
      title={'Transfer'}
      open={modal.visible}
      onCancel={onCloseModal}
      afterClose={modal.remove}
      className={styles['transfer-modal-custom']}
      footer={
        <Button
          type="primary"
          size="ultra"
          onClick={toTransfer}
          loading={loading}
          disabled={getTransferDisabled()}
          className="mdTW:w-[256px]">
          Transfer
        </Button>
      }>
      <div className="content mdTW:pt-0  pt-[24px]">
        <div className="flex flex-col mdTW:items-center items-start">
          <Image
            className="rounded-lg object-contain w-full mdTW:w-[128px] mdTW:h-[128px] border-[1px] border-[var(--line-border)] border-none mdTW:border-solid"
            src={curImage}
            width={isSmallScreen ? 343 : 128}
            height={isSmallScreen ? 343 : 128}
            alt="nft"
            onError={(e) => {
              setCurImage(nftPreview);
              (e.target as HTMLElement).className = 'broken';
            }}
          />
          <div className="mt-[8px] mdTW:mt-[16px] text-[16px] leading-[24px] font-medium text-textSecondary flex items-center justify-center">
            {nftInfo?.nftCollection?.logoImage && !isSmallScreen && (
              <Image
                className="rounded-[4px] mr-[4px] object-cover"
                width={24}
                height={24}
                src={nftInfo?.nftCollection?.logoImage}
                alt="collection"
              />
            )}
            <span>{nftInfo?.nftCollection?.tokenName}</span>
          </div>
          <div className="mt-[8px] mdTW:mt-[4px] font-semibold text-primary mdTW:text-[16px] mdTW:leading-[24px]">
            {nftInfo?.tokenName}
          </div>
        </div>
        <div className="mt-[24px] mdTW:mt-[48px]">
          <InputQuantity
            availableMount={nftNumber.nftBalance}
            allowClear
            disabled={inputQuantityDisabled}
            onChange={onChangeQuantity}
            value={Number(inputQuantity) === 0 ? '' : formatTokenPrice(inputQuantity)}
            errorTip={quantityError}
            max={nftNumber.nftBalance}
          />
        </div>
        <div className="mt-[52px]">
          <TransferToInput
            onBlur={onAddressBlur}
            value={inputAddress}
            onChange={onAddressChange}
            errorTip={addressErrorTip}
          />
        </div>
      </div>
    </Modal>
  );
}

export default memo(NiceModal.create(TransferModal));
