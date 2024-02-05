import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Button from 'baseComponents/Button';
import Modal from 'baseComponents/Modal';
import BigNumber from 'bignumber.js';
import NftInfoListCard from 'components/NftInfoListCard';
import { formatInputNumber } from 'pagesComponents/Detail/utils/inputNumberUtils';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import InputQuantity from '../InputQuantity';
import Summary from 'components/Summary';
import { divDecimals } from 'utils/calculate';
import Balance from 'components/Balance';
import useTokenData from 'hooks/useTokenData';
import { getBalance } from 'pagesComponents/Detail/utils/getNftNumber';
import useGetState from 'store/state/getState';
import { SupportedELFChainId } from 'constants/chain';
import { WalletType, useWebLogin } from 'aelf-web-login';
import CrossChainTransferModal, { CrossChainTransferType } from 'components/CrossChainTransferModal';
import PromptModal from 'components/PromptModal';
import { useCheckLoginAndToken, useWalletSyncCompleted } from 'hooks/useWalletSync';
import { MintNftMessage } from 'constants/promptMessage';
import { getExploreLink, sleep } from 'utils';
import ResultModal from 'components/ResultModal';
import { updateDropQuota } from 'pagesComponents/DropsDetail/utils/getDropQuota';
import { DropState } from 'api/types';
import { useClaimDrop } from 'pagesComponents/DropsDetail/hooks/useClaimDrop';
import { useRouter } from 'next/navigation';
import { INftInfoList } from 'components/NftInfoList';
import { CHAIN_ID_TYPE } from 'constants/index';
import { getMintState } from 'pagesComponents/DropsDetail/utils/getMintState';
import { MintStateType } from '../DropsMint';
import { message } from 'antd';
import { DropMinted } from 'contract/formatErrorMsg';
import { updateDropDetail } from 'pagesComponents/DropsDetail/utils/getDropDetail';

interface IProps {
  initQuantity?: number;
}

function MintModal(props?: IProps) {
  const { initQuantity } = props || {};
  const nav = useRouter();
  const modal = useModal();
  const elfRate = useTokenData();
  const { walletType } = useWebLogin();
  const isPortkeyConnected = walletType === WalletType.portkey;

  const { infoState, walletInfo, aelfInfo } = useGetState();

  const transferModal = useModal(CrossChainTransferModal);
  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const { claimDrop } = useClaimDrop(aelfInfo?.curChain);

  const { login, isLogin } = useCheckLoginAndToken();
  const { getAccountInfoSync } = useWalletSyncCompleted(aelfInfo?.curChain);

  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(initQuantity || 0);
  const [quantityErrorTip, setQuantityErrorTip] = useState('');
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [mainTokenBalance, setMainTokenBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);

  const { dropDetailInfo } = useDropDetailGetState();

  const totalPrice = useMemo(() => {
    if (quantity && dropDetailInfo?.mintPrice) {
      return BigNumber(dropDetailInfo?.mintPrice).multipliedBy(quantity);
    }
    return 0;
  }, [dropDetailInfo?.mintPrice, quantity]);

  const usdTotalPrice = useMemo(() => {
    if (elfRate) {
      return BigNumber(totalPrice).multipliedBy(elfRate);
    }
    return 0;
  }, [totalPrice, elfRate]);

  const mintPrice = useMemo(() => {
    return dropDetailInfo?.mintPrice ? `${formatTokenPrice(dropDetailInfo?.mintPrice)} ELF` : 'Free';
  }, [dropDetailInfo?.mintPrice]);

  const maxQuantity = useMemo(() => {
    const max = dropDetailInfo?.addressClaimLimit || 0;
    if (BigNumber(max).isEqualTo(1)) {
      setQuantity(1);
    }
    return max;
  }, [dropDetailInfo?.addressClaimLimit]);

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value || BigNumber(e.target.value).isZero()) {
      setQuantity(0);
      return;
    }
    const inputNumber = Number(formatInputNumber(e.target.value));
    if (BigNumber(inputNumber).gt(maxQuantity)) {
      setQuantityErrorTip('Maximum quantity exceeded. Please enter a correct quantity.');
    } else {
      setQuantityErrorTip('');
    }
    setQuantity(inputNumber);
  };

  const handleTransferShow = () => {
    modal.hide();
    transferModal.show({
      type: CrossChainTransferType.token,
      onClose: () => {
        transferModal.hide();
        modal.show({
          initQuantity: quantity,
        });
      },
    });
  };

  const isAllChainsBalanceInsufficient = useMemo(() => {
    return BigNumber(mainTokenBalance).plus(BigNumber(tokenBalance)).lt(BigNumber(totalPrice));
  }, [mainTokenBalance, tokenBalance, totalPrice]);

  const isSideChainBalanceInsufficient = useMemo(() => {
    return BigNumber(tokenBalance).lt(BigNumber(totalPrice));
  }, [tokenBalance, totalPrice]);

  const insufficientTip = useMemo(() => {
    if (isSideChainBalanceInsufficient) {
      if (isAllChainsBalanceInsufficient) {
        return (
          <div className="text-[12px] leading-[20px] font-normal text-functionalDanger">Insufficient balance.</div>
        );
      } else {
        return (
          <div className="text-[12px] leading-[20px] font-normal  text-functionalDanger">
            <span className={isPortkeyConnected ? '!text-[var(--text-primary)]' : ''}>Insufficient balance.</span>
            <>
              <span className={isPortkeyConnected ? '!text-[var(--text-primary)]' : ''}>You can</span>{' '}
              {isPortkeyConnected ? (
                <span className="cursor-pointer !text-[var(--functional-link)]" onClick={handleTransferShow}>
                  {`manually transfer tokens from MainChain to your SideChain address.`}
                </span>
              ) : (
                'manually transfer tokens from MainChain to your SideChain address.'
              )}
            </>
          </div>
        );
      }
    }
    return null;
  }, [isAllChainsBalanceInsufficient, isPortkeyConnected, isSideChainBalanceInsufficient]);

  const tryAgain = async () => {
    if (!dropDetailInfo?.dropId) return;
    const res = await updateDropQuota({
      dropId: dropDetailInfo.dropId,
      address: walletInfo.address,
    });
    const state = res.state;
    const mintState = getMintState(res.dropQuota, dropDetailInfo?.mintPrice);

    switch (state) {
      case DropState.Canceled:
        return;
      case DropState.End:
        resultModal.hide();
        return;
      default:
        resultModal.hide();
        if (mintState === MintStateType.Mint || mintState === MintStateType.MintFree) {
          modal.show();
        } else {
          message.error(DropMinted);
        }
        return;
    }
  };

  const showResultModal = async (params: {
    TransactionId?: string;
    list?: INftInfoList[];
    status: 'all' | 'partially' | 'failed';
  }) => {
    const { TransactionId, list, status } = params;
    const explorerUrl = TransactionId ? getExploreLink(TransactionId, 'transaction') : '';
    const title = {
      all: MintNftMessage.successMessage.title,
      partially: MintNftMessage.partiallyMessage.title,
      failed: MintNftMessage.errorMessage.title,
    };
    resultModal.show({
      previewImage: dropDetailInfo?.collectionLogo,
      title: title[status],
      hideButton: status === 'all' ? true : false,
      info: {
        title: dropDetailInfo?.collectionName,
      },
      jumpInfo: explorerUrl
        ? {
            url: explorerUrl,
          }
        : undefined,
      buttonInfo: {
        btnText: 'Try Again',
        openLoading: true,
        onConfirm: tryAgain,
      },
      error:
        status === 'failed'
          ? {
              title: `Minting of ${BigNumber(quantity).gt(1) ? 'NFTs' : 'NFT'} failed`,
              description: MintNftMessage.errorMessage.description,
            }
          : {
              title: (
                <span className="text-textPrimary">{`${
                  list?.length && list?.length > 1 ? 'NFTs' : 'NFT'
                } Minted`}</span>
              ),
              description: status === 'all' ? '' : MintNftMessage.errorMessage.description,
              list,
            },
    });
  };

  const onMint = async () => {
    try {
      if (!dropDetailInfo?.dropId) return;
      const claimDropRes = await claimDrop({
        dropId: dropDetailInfo?.dropId,
        claimAmount: quantity,
        price: dropDetailInfo.mintPrice,
      });
      if (claimDropRes === 'failed') {
        promptModal.hide();
        return;
      } else if (claimDropRes === 'error') {
        promptModal.hide();
        showResultModal({
          status: 'failed',
        });
        return;
      }
      if (claimDropRes) {
        let status: 'all' | 'partially' = 'all';

        if (BigNumber(claimDropRes.currentAmount).lt(quantity)) {
          status = 'partially';
        }
        const list = claimDropRes.claimDetailList?.value.map((item) => {
          return {
            image: item.image,
            collectionName: dropDetailInfo?.collectionName,
            nftName: item.name,
            item: `Quantity: ${item.amount}`,
            priceTitle: 'Price Each',
            price: dropDetailInfo?.mintPrice ? `${formatTokenPrice(dropDetailInfo?.mintPrice)} ELF` : 'Free',
            usdPrice: formatUSDPrice(dropDetailInfo?.mintPriceUsd || 0),
            onClick: () => {
              const nftId = `${CHAIN_ID_TYPE[String(item.chainId)]}-${item.symbol}`;
              resultModal.hide();
              nav.push(`/detail/buy/${nftId ?? ''}/${aelfInfo.curChain}`);
            },
          };
        });

        promptModal.hide();
        showResultModal({
          TransactionId: claimDropRes.TransactionId,
          status,
          list,
        });
        updateDropDetail({
          dropId: dropDetailInfo.dropId,
          address: walletInfo.address,
        });
      }
    } catch (error) {
      /* empty */
      return Promise.reject(error);
    }
  };

  const onConfirm = async () => {
    if (isLogin) {
      setLoading(true);
      const mainAddress = await getAccountInfoSync();
      if (!mainAddress) {
        setLoading(false);
        return;
      }

      modal.hide();

      promptModal.show({
        nftInfo: {
          image: dropDetailInfo?.collectionLogo,
          nftName: dropDetailInfo?.collectionName,
          priceTitle: 'Total Price',
          price: `${formatTokenPrice(totalPrice)} ELF`,
          usdPrice: formatUSDPrice(usdTotalPrice),
          item: `Quantity: ${formatTokenPrice(quantity)}`,
        },
        title: MintNftMessage.title,
        content: {
          title: walletInfo.portkeyInfo ? MintNftMessage.portkey.title : MintNftMessage.default.title,
          content: walletInfo.portkeyInfo ? MintNftMessage.portkey.message : MintNftMessage.default.message,
        },
        initialization: onMint,
        onClose: () => {
          promptModal.hide();
        },
      });
    } else {
      login();
    }
  };

  const initialization = async () => {
    try {
      if (!walletInfo.address) return;
      setBalanceLoading(true);
      const res = await getBalance(
        {
          owner: walletInfo.address,
          symbol: 'ELF',
        },
        infoState.sideChain,
      );
      const balance = divDecimals(Number(res), 8).toNumber();
      setTokenBalance(balance);
      setBalanceLoading(false);
      const mainRes = await getBalance(
        {
          owner: walletInfo.aelfChainAddress || '',
          symbol: 'ELF',
        },
        SupportedELFChainId.MAIN_NET,
      );

      const mainBalance = divDecimals(Number(mainRes), 8).toNumber();

      setMainTokenBalance(mainBalance || 0);
    } catch (error) {
      setBalanceLoading(false);
    }
  };

  const disabled = useMemo(() => {
    if (quantity === 0 || quantityErrorTip || insufficientTip || balanceLoading) {
      return true;
    }
    return false;
  }, [insufficientTip, quantity, quantityErrorTip, balanceLoading]);

  useEffect(() => {
    if (modal.visible) {
      initialization();
    }
  }, [modal.visible]);

  return (
    <Modal
      open={modal.visible}
      onCancel={modal.hide}
      afterClose={modal.remove}
      title="Mint NFT"
      footer={
        <Button
          disabled={disabled}
          loading={loading}
          type="primary"
          size="ultra"
          className="!w-[256px]"
          millisecondOfThrottle={300}
          onClick={onConfirm}>
          Mint
        </Button>
      }>
      <NftInfoListCard
        image={dropDetailInfo?.collectionLogo}
        nftName={dropDetailInfo?.collectionName}
        priceTitle="Price"
        item={`Quantity: ${quantity}`}
        price={`${formatTokenPrice(quantityErrorTip ? 0 : totalPrice)} ELF`}
        usdPrice={`${formatUSDPrice(usdTotalPrice)}`}
        imageSizeType="cover"
      />
      {maxQuantity > 1 ? (
        <InputQuantity
          maxQuantity={formatTokenPrice(maxQuantity)}
          value={quantity === 0 ? '' : formatTokenPrice(quantity)}
          onChange={handleQuantityChange}
          errorTip={insufficientTip || quantityErrorTip}
        />
      ) : null}
      <div className="mt-[52px] mdTW:mt-[60px]">
        <Summary
          preSummaryListList={[
            {
              title: 'Mint Price',
              content: [mintPrice, formatUSDPrice(dropDetailInfo?.mintPriceUsd || 0)],
            },
          ]}
        />
      </div>
      <div className="mt-[24px] mdTW:mt-[32px]">
        <Balance loading={balanceLoading} amount={tokenBalance} suffix="ELF" />
      </div>
    </Modal>
  );
}

export default React.memo(NiceModal.create(MintModal));
