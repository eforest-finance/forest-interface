import { Image, Tooltip, message } from 'antd';
import { IAuctionInfoResponse, IBidInfo, ITransactionFeeResponse } from 'api/types';
import { formatAmount, plusAmountByBigNumber, fix4NotInt } from 'utils/formatElf';
import defaultImage from './defautlmage';
import { fetchTransactionFee } from 'api/fetch';
import { memo, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { divDecimals, timesDecimals } from 'utils/calculate';
import useGetState from 'store/state/getState';
import Question from 'assets/images/question.svg';
import clsx from 'clsx';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import { GetAllowance } from 'contract/multiToken';
import { PlaceBid } from 'contract/auction';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useDetailGetState from 'store/state/detailGetState';
import { usePathname } from 'next/navigation';
import Balance from '../BuyNowModal/components/Balance';
import styles from './index.module.css';
import { getNFTNumber } from 'pagesComponents/Detail/utils/getNftNumber';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';
import ElfLogo from 'assets/images/explore/elf';
import { approve, openBatchApprovalEntrance } from 'utils/aelfUtils';

interface IBidModalProps {
  auctionInfo: IAuctionInfoResponse & Partial<IBidInfo>;
  onClose?: () => void;
  myBalance: BigNumber;
}
function BidModal({ onClose, auctionInfo, myBalance }: IBidModalProps) {
  const modal = useModal();
  const pathname = usePathname();

  const { infoState, walletInfo, aelfInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const [placeBidBtnLoading, setPlaceBidBtnLoading] = useState(false);
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { getAccountInfoSync } = useWalletSyncCompleted(aelfInfo?.curChain);

  const [priceData, setPriceData] = useState<ITransactionFeeResponse>({ transactionFee: 0, transactionFeeOfUsd: 0 });
  const totalPriceObj = {
    totalElf: plusAmountByBigNumber(
      formatAmount(auctionInfo?.priceAmount || auctionInfo?.currentELFPrice),
      auctionInfo?.minElfPriceMarkup,
      // formatAmount(1.4 * 10 ** 8),
      priceData?.transactionFee,
    ),
    totalUSD: plusAmountByBigNumber(
      auctionInfo?.priceUsdAmount || auctionInfo?.currentUSDPrice || 0,
      auctionInfo?.minDollarPriceMarkup,
      priceData?.transactionFeeOfUsd,
    ),
    bidElf: plusAmountByBigNumber(
      formatAmount(auctionInfo?.priceAmount || auctionInfo?.currentELFPrice),
      auctionInfo?.minElfPriceMarkup,
    ),
  };

  const isHaveNoMoney = divDecimals(myBalance?.valueOf(), 8).toNumber() < totalPriceObj.totalElf;

  const placeBidHandler = async (totalPrice: number) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) return;
    try {
      setPlaceBidBtnLoading(true);
      console.log('walletInfo.address', walletInfo.address);
      const allowance = await GetAllowance({
        symbol: 'ELF',
        owner: walletInfo.address,
        spender: aelfInfo?.auctionSideAddress,
      });

      if (allowance.error) {
        message.error(allowance.errorMessage?.message || allowance.error.toString());
        return;
      }

      const bigA = timesDecimals(totalPrice, 8);

      const allowanceBN = new BigNumber(allowance?.allowance || 0);

      if (allowanceBN.lt(bigA)) {
        await openBatchApprovalEntrance(false);
        const approveRes = await approve(
          aelfInfo?.auctionSideAddress,
          'ELF',
          String(timesDecimals(totalPrice, 8).toNumber()),
        );
        console.log('token approve finish', approveRes);
      }

      await PlaceBid({
        auctionId: auctionInfo?.id || '',
        amount: timesDecimals(totalPrice, 8).toNumber(),
      });
      getNFTNumber({ nftSymbol: nftInfo?.nftSymbol, chainId: infoState.sideChain, owner: walletInfo.address });
      message.success('success');
    } catch (e: any) {
      let msg = e?.errorMessage?.message;
      if (/Insufficient balance of ELF/.test(e.errorMessage?.message)) {
        msg = 'Insufficient funds';
      }
      console.log('PlaceBid finish error', e);
      message.error(msg);
    } finally {
      setPlaceBidBtnLoading(false);
      modal.hide();
    }
  };

  const onCancel = () => {
    if (onClose) {
      onClose();
    } else {
      modal.hide();
    }
  };

  useEffect(() => {
    modal.hide();
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
      if (!nftInfo) {
        return;
      }
      if (!modal.visible) {
        return;
      }
      const transactionFeeData = fetchTransactionFee();

      try {
        const transactionFee = await transactionFeeData;
        setPriceData(transactionFee);
      } catch (e) {
        console.log('error', e);
      }
    }
    fetchData();
  }, [nftInfo, modal.visible]);

  return (
    <Modal
      width={550}
      title="Place a Bid"
      className={`${styles['bid-modal-custom']} ${styles['bid-modal']}`}
      onCancel={() => onCancel()}
      open={modal.visible}
      footer={
        <Button
          type="primary"
          loading={placeBidBtnLoading}
          onClick={() => placeBidHandler(totalPriceObj.bidElf)}
          disabled={isHaveNoMoney || auctionInfo?.finishIdentifier === 2}
          isFull={true}
          size="ultra"
          className="!w-[256px]">
          Place a Bid
        </Button>
      }>
      <div className="mt-[24px] mdTW:mt-0 max-h-[464px]">
        <div className="flex flex-row items-center">
          <div className="relative">
            <Image
              src={nftInfo?.previewImage || ''}
              className="rounded-[12px]"
              rootClassName=" w-[72px] h-[72px] rounded-[8px] bg-[#8B60F7] flex items-center "
              preview={false}
              alt=""
              fallback={defaultImage}
            />
          </div>
          <div className="hidden flex-col ml-[16px] mdTW:flex">
            <span className="text-secondary font-medium text-[14px]">{auctionInfo?.collectionSymbol || '-'}</span>
            <span className="text-primary mt-[4px] text-[16px]">{nftInfo?.tokenName || '-'}</span>
          </div>
          <div className="flex flex-1 justify-end">
            <div className="flex flex-col items-end">
              <span className="text-secondary font-medium text-[14px]">Bid Price</span>
              <span className="mt-[4px] text-primary text-[16px]">
                {fix4NotInt(formatAmount(auctionInfo?.priceAmount || auctionInfo?.currentELFPrice))}&nbsp;ELF
              </span>
              <span className="mt-[4px] text-secondary text-[14px]">
                $&nbsp;{fix4NotInt(auctionInfo?.priceUsdAmount || auctionInfo?.currentUSDPrice || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col  mt-[8px] mdTW:hidden text-[16px]">
          <span className="text-secondary font-medium">{auctionInfo?.collectionSymbol || '-'}</span>
          <span className="text-primary md-[4px]">{nftInfo?.tokenName || '-'}</span>
        </div>

        <div className="flex flex-col gap-[24px] mdTW:gap-[32px] pb-[24px] mdTW:pb-[32px] mt-[32px] text-[16px]">
          <div className={clsx('flex flex-row justify-between items-start')}>
            <div className="flex items-center">
              <span className="pr-[4px] text-secondary">Minimum Bid Increment</span>
              <Tooltip
                title={`The minimum percentage that has to be added to the current top bid: ${new BigNumber(
                  auctionInfo.calculatorMinMarkup,
                )
                  .times(100)
                  .toNumber()}%`}>
                <span className="w-[20px] h-[20px] cursor-pointer flex">
                  <Question />
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-secondary">{fix4NotInt(auctionInfo?.minElfPriceMarkup)}&nbsp;ELF</span>
              <span className="text-secondary mt-[8px]">$&nbsp;{fix4NotInt(auctionInfo?.minDollarPriceMarkup)}</span>
            </div>
          </div>

          <div className={clsx('flex flex-row justify-between  items-start')}>
            <div className="text-secondary">Estimated Transaction Fee</div>
            <div className="flex flex-col items-end">
              <span className={clsx('text-secondary', isSmallScreen && '!pr-0')}>
                {fix4NotInt(priceData?.transactionFee)}&nbsp;ELF
              </span>
              <span className="text-secondary mt-[8px]">$&nbsp;{fix4NotInt(priceData?.transactionFeeOfUsd)}</span>
            </div>
          </div>

          <div className={clsx('flex flex-row justify-between font-medium items-start')}>
            <div className="text-primary text-[16px]">Total</div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <ElfLogo className="mr-[8px]" />
                <span className={clsx('text-primary text-[16px]', isSmallScreen && '!pr-0')}>
                  {fix4NotInt(totalPriceObj.totalElf)}&nbsp;ELF
                </span>
              </div>
              <span className="text-secondary mt-[8px] text-[14px]">$&nbsp;{fix4NotInt(totalPriceObj.totalUSD)}</span>
            </div>
          </div>
        </div>
        <div className="p-[24px] bg-[var(--fill-hover-bg)] text-secondary rounded-lg text-[14px]">
          <div>
            Once you&apos;ve placed your bid, the corresponding amount of tokens will be temporarily locked, and this
            hold will automatically be released if a higher bid appears. In the event that you win the bid, the tokens
            will be deducted from your account.
          </div>
          <div>Please be aware that bids cannot be canceled once they are placed.</div>
        </div>

        <div className="mt-[24px] mdTW:mt-[32px]">
          <Balance amount={fix4NotInt(divDecimals(myBalance?.valueOf(), 8).toNumber())} suffix="ELF" />
        </div>

        {isHaveNoMoney && (
          <div className={clsx('text-[#DD444D] font-medium pt-[24px] text-[14px]', isSmallScreen && 'text-[14px]')}>
            Insufficient balance
          </div>
        )}
        {auctionInfo?.finishIdentifier === 2 && (
          <div className={clsx('text-[#DD444D] font-medium pt-[24px] text-[14px]', isSmallScreen && 'text-[14px]')}>
            This SEED has expired and is not available now.
          </div>
        )}
      </div>
    </Modal>
  );
}
export default memo(NiceModal.create(BidModal));
