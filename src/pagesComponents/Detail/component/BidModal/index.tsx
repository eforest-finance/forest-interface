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
import BalanceWallet from 'assets/images/balanceWallet.svg';
import clsx from 'clsx';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import styles from './index.module.css';
import { Approve, GetAllowance } from 'contract/multiToken';
import { PlaceBid } from 'contract/auction';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import useDetailGetState from 'store/state/detailGetState';
import { usePathname } from 'next/navigation';
import { getNFTNumber } from 'pagesComponents/Detail/utils/getNftNumber';

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
        const approveRes = await Approve({
          spender: aelfInfo?.auctionSideAddress,
          symbol: 'ELF',
          amount: timesDecimals(totalPrice, 8).toNumber(),
          // amount: timesDecimals(10000, 8).toString(),
        });
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
      width={800}
      title="Place a Bid"
      className={styles['bid-modal-custom']}
      onCancel={() => onCancel()}
      open={modal.visible}
      footer={
        <Button
          type="primary"
          loading={placeBidBtnLoading}
          onClick={() => placeBidHandler(totalPriceObj.bidElf)}
          disabled={isHaveNoMoney || auctionInfo?.finishIdentifier === 2}
          isFull={true}>
          Place a Bid
        </Button>
      }>
      <div className={clsx(isSmallScreen ? 'text-[14px]' : 'text-[16px]')}>
        <div className="flex flex-row items-center">
          <div className="relative">
            <Image
              src={nftInfo?.previewImage || ''}
              className="rounded-[12px]"
              rootClassName=" w-[64px] h-[64px] rounded-[12px] bg-[#8B60F7] flex items-center "
              preview={false}
              alt=""
              fallback={defaultImage}
            />
          </div>
          <div className="ml-[16px] flex-1">
            <div
              className={clsx(
                'flex justify-between pb-[4px] font-bold',
                isSmallScreen ? 'text-[16px] leading-[24px]' : 'text-[20px] leading-[28px]',
              )}>
              <span>{nftInfo?.tokenName || '-'}</span>
              <span>{fix4NotInt(formatAmount(auctionInfo?.priceAmount || auctionInfo?.currentELFPrice))}&nbsp;ELF</span>
            </div>
            <div className="flex justify-between">
              <span>{auctionInfo?.collectionSymbol || '-'}</span>
              <span>$&nbsp;{fix4NotInt(auctionInfo?.priceUsdAmount || auctionInfo?.currentUSDPrice || 0)}</span>
            </div>
          </div>
        </div>
        <div className="px-[16px] py-[20px] my-[24px] flex flex-row justify-between rounded-[6px] bg-[#F5F7F7] dark:bg-[#202423] font-medium text-[16px]">
          <div className="flex items-center">
            <span className="w-[20px] h-[20px] flex">
              <BalanceWallet />
            </span>
            <span className="pl-[8px]">Balance</span>
          </div>
          <div>{fix4NotInt(divDecimals(myBalance?.valueOf(), 8).toNumber())}&nbsp;ELF</div>
        </div>

        <div className="flex flex-col gap-[12px] pb-[24px]">
          <div
            className={clsx(
              'flex flex-row justify-between text-[var(--text-detail-bid-modal-secondary)]',
              isSmallScreen ? 'items-start' : 'items-center',
            )}>
            <div className="flex items-center">
              <span className="pr-[4px]">Minimum Bid Increment</span>
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
            <div className={clsx(isSmallScreen && 'flex flex-col items-end')}>
              <span className={clsx('pr-[12px] text-[16px]', isSmallScreen && '!pr-0')}>
                {fix4NotInt(auctionInfo?.minElfPriceMarkup)}&nbsp;ELF
              </span>
              <span className="text-[14px]">$&nbsp;{fix4NotInt(auctionInfo?.minDollarPriceMarkup)}</span>
            </div>
          </div>

          <div
            className={clsx(
              'flex flex-row justify-between text-[var(--text-detail-bid-modal-secondary)]',
              isSmallScreen ? 'items-start' : 'items-center',
            )}>
            <div>Estimated Transaction Fee</div>
            <div className={clsx(isSmallScreen && 'flex flex-col items-end')}>
              <span className={clsx('pr-[12px] text-[16px]', isSmallScreen && '!pr-0')}>
                {fix4NotInt(priceData?.transactionFee)}&nbsp;ELF
              </span>
              <span className="text-[14px]">$&nbsp;{fix4NotInt(priceData?.transactionFeeOfUsd)}</span>
            </div>
          </div>

          <div
            className={clsx(
              'flex flex-row justify-between font-medium',
              isSmallScreen ? 'items-start' : 'items-center',
            )}>
            <div>Total</div>
            <div className={clsx(isSmallScreen && 'flex flex-col items-end')}>
              <span className={clsx('pr-[12px] text-[16px]', isSmallScreen && '!pr-0')}>
                {fix4NotInt(totalPriceObj.totalElf)}&nbsp;ELF
              </span>
              <span className="text-[14px]">$&nbsp;{fix4NotInt(totalPriceObj.totalUSD)}</span>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'text-[var(--text11)] border-0 border-t border-dashed border-[#E6E7E9] dark:border-[#383D3D] pt-[24px]',
            isSmallScreen && 'text-[14px]',
          )}>
          <div>
            Once you&apos;ve placed your bid, the corresponding amount of tokens will be temporarily locked, and this
            hold will automatically be released if a higher bid appears. In the event that you win the bid, the tokens
            will be deducted from your account.
          </div>
          <div>Please be aware that bids cannot be canceled once they are placed.</div>
        </div>

        {isHaveNoMoney && (
          <div className={clsx('text-[#DD444D] font-medium pt-[24px]', isSmallScreen && 'text-[14px]')}>
            Insufficient balance
          </div>
        )}
        {auctionInfo?.finishIdentifier === 2 && (
          <div className={clsx('text-[#DD444D] font-medium pt-[24px]', isSmallScreen && 'text-[14px]')}>
            This SEED has expired and is not available now.
          </div>
        )}
      </div>
    </Modal>
  );
}
export default memo(NiceModal.create(BidModal));
