import useGetState from 'store/state/getState';
import styles from './style.module.css';
import React from 'react';
import CollapseForPC from 'components/Collapse';
import { IBidInfo, IAuctionInfoResponse } from 'api/types';
import Question from 'assets/images/question.svg';
import { formatAmount } from 'utils/formatElf';
import { OmittedType, getOmittedStr, getOriginalAddress } from 'utils';
import Link from 'next/link';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';
import { useModal } from '@ebay/nice-modal-react';
import BidModal from '../BidModal';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import BigNumber from 'bignumber.js';
import Tooltip from 'baseComponents/Tooltip';
import ListingCardTitle, { ListingCardType } from '../ListingCard/ListingCardTitle';
import PriceCard from '../PriceCard';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import clsx from 'clsx';
import { divDecimals } from 'utils/calculate';
import moment from 'moment';
import useResponsive from 'hooks/useResponsive';
import Copy from 'components/Copy';

import Pencil from 'assets/images/v2/pencil.svg';

interface IBidCardAndListProps {
  intervalDataForBid: {
    auctionInfo: IAuctionInfoResponse & Partial<IBidInfo>;
    bidInfos: IBidInfo[];
  };
  tokenBalance: BigNumber;
}

interface IBidCard {
  isSmallScreen: boolean | undefined;
  auctionInfo: IAuctionInfoResponse & Partial<IBidInfo>;
  placeBid: () => void;
}

const BidCard = ({ isSmallScreen, auctionInfo, placeBid }: IBidCard) => {
  const { isMin } = useResponsive();
  const tooltipOverlayClass = isMin ? `!max-w-full` : '!max-w-[435px]';

  const title = () => {
    return (
      <div className="flex items-center">
        <Pencil className="mr-[4px]" />
        <span>Current Bid</span>
      </div>
    );
  };

  return (
    <div className={`${styles['bid-card']} ${isSmallScreen && styles['mobile-bid-card']}`}>
      <div className="flex flex-col gap-[24px] lg:gap-[48px]">
        <div
          className={`w-full mdTW:w-auto mdTW:pt-0 mdTW:pb-[24px] px-0 pb-0 lgTW:p-0 ${
            isSmallScreen ? 'flex flex-col w-[100%]' : 'flex'
          }`}>
          <PriceCard
            title={title()}
            price={formatTokenPrice(divDecimals(auctionInfo?.priceAmount || auctionInfo?.currentELFPrice, 8))}
            priceSymbol={auctionInfo?.priceSymbol || 'ELF'}
            usdPrice={formatUSDPrice(auctionInfo?.priceUsdAmount || auctionInfo?.currentUSDPrice || 0)}
          />
        </div>
        <div className="flex lg:w-[208px] h-[48px] w-full">
          <Button
            disabled={auctionInfo?.finishIdentifier === 2}
            type="primary"
            className={`!w-full`}
            onClick={placeBid}>
            <div className="pr-[40px]">Place a Bid</div>
            <div
              className={`absolute top-0 right-0 w-[48px] h-[48px] rounded-r-lg overflow-hidden bg-[#3183E5] flex items-center justify-center ${styles.money}`}></div>
          </Button>
        </div>
      </div>
      {(auctionInfo?.endTime >= 0 || true) && (
        <ListingCardTitle
          showTime={!!auctionInfo.endTime}
          timePrefix="Auction ends on"
          type={ListingCardType.BID}
          endTime={auctionInfo.endTime * 1000}
          // endTime={1731571687 * 1000}
          suffix={
            <Tooltip
              overlayClassName={tooltipOverlayClass}
              overlayInnerStyle={
                isMin
                  ? { margin: '0 10px', padding: '8px 16px', borderRadius: '6px' }
                  : { padding: '8px 16px', borderRadius: '6px' }
              }
              placement="topRight"
              arrowPointAtCenter={true}
              title={
                <div className="text-left">
                  <div className="text-center">Auction Extension</div>
                  <div>
                    A new highest bid placed with less than 10 minutes remaining will trigger an auction extension,
                    adding an extra 10 minutes to the bidding period, with the potential for a maximum extension of up
                    to 7 additional days.
                  </div>
                </div>
              }>
              <span className="w-[20px] h-[20px] cursor-pointer flex ml-[2px]">
                <Question />
              </span>
            </Tooltip>
          }
        />
      )}
    </div>
  );
};

const BidList = ({ bidInfos }: { bidInfos: IBidInfo[] }) => {
  console.log('bidInfos', bidInfos);
  const columns = [
    {
      title: 'Price',
      dataIndex: 'priceAmount',
      key: 'priceAmount',
      with: 200,
      render: (text: number, record: { priceUsdAmount: string | number | BigNumber }) => {
        return (
          <div>
            <div className="text-[14px] font-medium">{formatTokenPrice(formatAmount(text))} ELF</div>
            <div className="text-[12px] text-textSecondary">(${formatTokenPrice(record.priceUsdAmount)})</div>
          </div>
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'bidTime',
      key: 'bidTime',
      with: 200,
      render: (text: string) => {
        return (
          <div className="text-[14px] text-textSecondary">
            {moment.unix(Number(text)).format('YYYY.MM.DD HH:mm:ss')}
          </div>
        );
      },
    },
    {
      title: 'From',
      dataIndex: 'bidder',
      key: 'bidder',
      with: 200,
      render: (text: string) => {
        return (
          <div className="flex items-center gap-1 text-[14px]">
            <Link
              className="text-[var(--brand-base)] cursor-pointer"
              href={`/account/${getOriginalAddress(text)}#Collected`}>
              <span className="text-[14px]">
                {getOmittedStr(text, OmittedType.CUSTOM, { prevLen: 6, endLen: 7, limitLen: 13 }) || ''}
              </span>
            </Link>
            <Copy className="fill-brandNormal" toCopy={text} />
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      className={styles['table-custom']}
      columns={columns}
      dataSource={bidInfos}
      emptyText="No offers yet."
      // scroll={{ y: 300, x: 792 }}
    />
  );

  // const items = [
  //   {
  //     key: 'biddings',
  //     header: (
  //       <div className="text-[var(--color-primary)] text-[18px] font-medium leading-[26px] p-[16px] lg:p-[24px]">
  //         Offers
  //       </div>
  //     ),
  //     children: (
  //       <div className="border-0 border-t !border-solid border-lineBorder">
  //         <Table
  //           rowKey="id"
  //           className="forest-table"
  //           columns={columns}
  //           dataSource={bidInfos}
  //           emptyText="No offers yet."
  //           scroll={{ y: 300, x: 792 }}
  //         />
  //       </div>
  //     ),
  //   },
  // ];
  // return (
  //   <div className="mt-[16px]">
  //     <CollapseForPC items={items} defaultActiveKey={['biddings']} />
  //   </div>
  // );
};

function BidCardAndList({ intervalDataForBid, tokenBalance }: IBidCardAndListProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const bidModal = useModal(BidModal);
  const { login, isLogin } = useCheckLoginAndToken();

  const placeBid = () => {
    const bidModalParams = {
      auctionInfo: intervalDataForBid.auctionInfo,
      myBalance: tokenBalance,
    };
    console.log('placeBid', bidModalParams);

    isLogin ? bidModal.show(bidModalParams) : login();
  };

  return (
    <>
      <BidCard isSmallScreen={isSmallScreen} auctionInfo={intervalDataForBid?.auctionInfo} placeBid={placeBid} />
      {/* <BidList bidInfos={intervalDataForBid?.bidInfos} /> */}
    </>
  );
}

function BidCardWrapper({ intervalDataForBid, tokenBalance }: IBidCardAndListProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const bidModal = useModal(BidModal);
  const { login, isLogin } = useCheckLoginAndToken();

  const placeBid = () => {
    const bidModalParams = {
      auctionInfo: intervalDataForBid.auctionInfo,
      myBalance: tokenBalance,
    };
    console.log('placeBid', bidModalParams);
    isLogin ? bidModal.show(bidModalParams) : login();
  };

  return (
    <>
      <BidCard isSmallScreen={isSmallScreen} auctionInfo={intervalDataForBid?.auctionInfo} placeBid={placeBid} />
    </>
  );
}

export default React.memo(BidCardAndList);
export { BidCardWrapper, BidList };
