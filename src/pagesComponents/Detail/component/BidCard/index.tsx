import { Tooltip } from 'antd';
import Clock from 'assets/images/clock.svg';
import useGetState from 'store/state/getState';
import styles from './style.module.css';
import React from 'react';
import CollapseForPC from 'components/Collapse';
import { IBidInfo, IAuctionInfoResponse } from 'api/types';
import moment from 'moment';
import Question from 'assets/images/question.svg';
import { formatAmount, fix4NotInt } from 'utils/formatElf';
import { OmittedType, getOmittedStr, getOriginalAddress } from 'utils';
import Link from 'next/link';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';

interface IBidCardAndListProps {
  placeBid: () => void;
  intervalDataForBid: {
    auctionInfo: IAuctionInfoResponse & Partial<IBidInfo>;
    bidInfos: IBidInfo[];
  };
}

interface IBidCard {
  isSmallScreen: boolean | undefined;
  auctionInfo: IAuctionInfoResponse & Partial<IBidInfo>;
  placeBid: () => void;
}

const BidCard = ({ isSmallScreen, auctionInfo, placeBid }: IBidCard) => {
  return (
    <div className={`${styles['bid-card']} ${isSmallScreen && styles['mobile-bid-card']}`}>
      {auctionInfo?.endTime > 0 && (
        <div className={styles['time-panel']}>
          <div className="flex flex-row items-center min-w-0">
            <div
              className={`${styles['time-icon']} flex items-center justify-center ${
                isSmallScreen ? 'w-[16px] h-[16px]' : 'w-[24px] h-[24px]'
              } mr-[12px]`}>
              <Clock />
            </div>
            <span
              className={`text-[var(--table-tbody-text)] leading-[24px] break-all ${
                isSmallScreen ? 'text-[14px]' : 'text-[18px]'
              }`}>
              Sale ends {moment.unix(auctionInfo?.endTime).format('DD MMM YYYY')} at&nbsp;
              {moment.unix(auctionInfo?.endTime).format('HH:mma')}(UTC)
            </span>
          </div>
          <div>
            <Tooltip
              placement="topRight"
              title={
                <div className="text-center py-[8px]">
                  <div>Auction Extension</div>
                  <div>
                    A new highest bid placed with less than 10 minutes remaining will trigger an auction extension,
                    adding an extra 10 minutes to the bidding period, with the potential for a maximum extension of up
                    to 7 additional days.
                  </div>
                </div>
              }>
              <span className="w-[20px] h-[20px] cursor-pointer flex">
                <Question />
              </span>
            </Tooltip>
          </div>
        </div>
      )}
      <div className={styles['price-panel']}>
        <div
          className={`${styles['left-part']} ${
            isSmallScreen ? 'flex flex-col w-[100%] gap-[11.429px]' : 'flex gap-[40px]'
          }`}>
          <div>
            <p className={`${styles['current-price']} text-textSecondary text-[18px] font-medium`}>Current Bid</p>
            <div className={`${styles['price-number']} flex`}>
              <span className={`${styles['price-margin']} text-textPrimary font-semibold`}>
                {fix4NotInt(formatAmount(auctionInfo?.priceAmount || auctionInfo?.currentELFPrice))}
                &nbsp;
                {auctionInfo?.priceSymbol || 'ELF'}
              </span>
              <span className="text-textSecondary text-[16px] hidden xl:block">
                {'$'}&nbsp;
                {fix4NotInt(auctionInfo?.priceUsdAmount || auctionInfo?.currentUSDPrice || 0)}
              </span>
            </div>
            <span className="text-textSecondary text-[16px] xl:hidden">
              {'$'}&nbsp;
              {fix4NotInt(auctionInfo?.priceUsdAmount || auctionInfo?.currentUSDPrice || 0)}
            </span>
          </div>
        </div>
        <p className={styles['btn-panel']}>
          <Button
            disabled={auctionInfo?.finishIdentifier === 2}
            className={`${styles['bid-btn']} mdTW:!mb-[24px] w-full`}
            type="primary"
            size="ultra"
            onClick={placeBid}>
            Place a Bid
          </Button>
        </p>
      </div>
    </div>
  );
};

const BidList = ({ bidInfos }: { bidInfos: IBidInfo[] }) => {
  const columns = [
    {
      title: 'Price',
      dataIndex: 'priceAmount',
      key: 'priceAmount',
      render: (text: number) => {
        return `${fix4NotInt(formatAmount(text))} ELF`;
      },
    },
    {
      title: 'USD Price',
      dataIndex: 'priceUsdAmount',
      key: 'priceUsdAmount',
      render: (text: number) => {
        return `$ ${fix4NotInt(text)}`;
      },
    },
    {
      title: 'From',
      dataIndex: 'bidder',
      key: 'bidder',
      render: (text: string) => {
        return (
          <Link className="text-[var(--brand-base)] cursor-pointer" href={`/account/${getOriginalAddress(text)}`}>
            {getOmittedStr(text, OmittedType.CUSTOM, { prevLen: 6, endLen: 7, limitLen: 13 }) || ''}
          </Link>
        );
      },
    },
  ];

  const items = [
    {
      key: 'biddings',
      header: (
        <div className="text-[var(--color-primary)] text-[18px] font-medium leading-[26px] p-[16px] lg:p-[24px]">
          Offers
        </div>
      ),
      children: (
        <div className="border-0 border-t !border-solid border-lineBorder">
          {bidInfos?.length > 0 ? (
            <Table rowKey="id" className="forest-table" columns={columns} dataSource={bidInfos} scroll={{ y: 300 }} />
          ) : (
            <div className="text-[var(--color-disable)] text-center w-full p-[24px] text-[16px] leading-[24px] font-medium;">
              No offers yet
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="mt-[16px]">
      <CollapseForPC items={items} defaultActiveKey={['biddings']} />
    </div>
  );
};

function BidCardAndList({ placeBid, intervalDataForBid }: IBidCardAndListProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <>
      <BidCard isSmallScreen={isSmallScreen} auctionInfo={intervalDataForBid?.auctionInfo} placeBid={placeBid} />
      <BidList bidInfos={intervalDataForBid?.bidInfos} />
    </>
  );
}

export default React.memo(BidCardAndList);
