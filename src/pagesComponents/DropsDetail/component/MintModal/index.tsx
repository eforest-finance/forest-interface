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
import Balance from 'pagesComponents/Detail/component/BuyNowModal/components/Balance';
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

interface IProps {
  initQuantity?: number;
}

function MintModal(props?: IProps) {
  const { initQuantity } = props || {};
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

  const { dropDetailInfo, dropQuota } = useDropDetailGetState();

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
    const dropNftBalance = new BigNumber(dropQuota?.totalAmount || 0)
      .minus(new BigNumber(dropQuota?.claimAmount || 0))
      .toNumber();
    const dropCurrentNftBalance = new BigNumber(dropQuota?.addressClaimLimit || 0)
      .minus(new BigNumber(dropQuota?.addressClaimAmount || 0))
      .toNumber();
    return Math.min(dropNftBalance, dropCurrentNftBalance);
  }, [dropQuota?.addressClaimAmount, dropQuota?.addressClaimLimit, dropQuota?.claimAmount, dropQuota?.totalAmount]);

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

  const onMint = async () => {
    try {
      if (!dropDetailInfo?.dropId) return;
      const claimDropRes = await claimDrop({
        dropId: dropDetailInfo?.dropId,
        claimAmount: quantity,
      });
      if (claimDropRes && claimDropRes !== 'failed') {
        let status: 'all' | 'partially' = 'all';
        const explorerUrl = getExploreLink(claimDropRes.TransactionId, 'transaction');

        if (BigNumber(claimDropRes.currentAmount).lt(quantity)) {
          status = 'partially';
        }

        const list = claimDropRes.claimDetailRecord?.value.map((item) => {
          return {
            image: dropDetailInfo?.logoUrl,
            collectionName: dropDetailInfo?.collectionName,
            nftName: item.tokenName,
            item: `Quantity: ${item.amount}`,
            priceTitle: 'Price Each',
            price: dropDetailInfo?.mintPrice ? `${formatTokenPrice(dropDetailInfo?.mintPrice)} 'ELF'` : 'Free',
            usdPrice: formatUSDPrice(dropDetailInfo?.mintPriceUsd || 0),
          };
        });

        promptModal.hide();

        resultModal.show({
          previewImage: dropDetailInfo?.logoUrl,
          title: status === 'all' ? MintNftMessage.successMessage.title : MintNftMessage.partiallyMessage.title,
          hideButton: status === 'all' ? true : false,
          info: {
            title: dropDetailInfo?.collectionName,
          },
          jumpInfo: {
            url: explorerUrl,
          },
          buttonInfo: {
            btnText: 'Try Again',
            openLoading: true,
            onConfirm: async () => {
              const res = await updateDropQuota({
                dropId: dropDetailInfo?.dropId,
                address: walletInfo.address,
              });
              switch (res) {
                case DropState.Canceled:
                  await sleep(3000);
                  // nav.back();
                  return;
                case DropState.End:
                  resultModal.hide();
                  return;
                default:
                  resultModal.hide();
                  modal.show();
                  return;
              }
            },
          },
          error: {
            title: <span className="text-textPrimary">NFT(s) Minted</span>,
            description: status === 'all' ? '' : MintNftMessage.errorMessage.description,
            list,
          },
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
          image: dropDetailInfo?.logoUrl,
          nftName: dropDetailInfo?.collectionName,
          priceTitle: 'Total Price',
          price: `${formatTokenPrice(totalPrice)} ELF`,
          usdPrice: formatUSDPrice(usdTotalPrice),
          item: formatTokenPrice(quantity),
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
      const res = await getBalance(
        {
          owner: walletInfo.address,
          symbol: 'ELF',
        },
        infoState.sideChain,
      );
      const balance = divDecimals(Number(res), 8).toNumber();
      setTokenBalance(balance);
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
      /* empty */
    }
  };

  const disabled = useMemo(() => {
    if (quantity === 0 || quantityErrorTip || insufficientTip) {
      return true;
    }
    return false;
  }, [quantity, quantityErrorTip]);

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
        <Balance amount={tokenBalance} suffix="ELF" />
      </div>
    </Modal>
  );
}

export default React.memo(NiceModal.create(MintModal));
