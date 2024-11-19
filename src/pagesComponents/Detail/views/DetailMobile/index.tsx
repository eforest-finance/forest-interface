'use client';
import { Tabs } from 'antd';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

// import DetailCard from 'pagesComponents/Detail/component/DetailCard';
// // import { TraitsInfoCard } from 'pagesComponents/Detail/component/DetailCard/TraitsCard';
// import { GenerationInfoCard } from 'pagesComponents/Detail/component/DetailCard/GenerationInfoCard';

import Activity from '../../component/Activity';

// import clsx from 'clsx';

// import { store } from 'store/store';
// import { setCurrentTab } from 'store/reducer/detail/detailInfo';
// import { RarityInfoCard } from 'pagesComponents/Detail/component/DetailCard/RarityInfoCard';
import { BidCardWrapper, BidList } from '../../component/BidCard';

import TraitsInfoCard from 'pagesComponents/Detail/component/DetailCard/Traits';

import Listings from 'pagesComponents/Detail/component/Listings';
import PriceHistory from 'components/PriceHistory';
import RecommendList from 'components/RecommendList';
import styles from './style.module.css';
import Offers from '../../component/Offers/offer';
import Picture from '../../component/Picture/Picture';
import Creator from '../../component/Creator';
import Title from '../../component/Title';
import Owner from '../../component/Owner';
import { useInitializationDetail } from 'pagesComponents/Detail/hooks/useInitializationDetail';
import ListingCard from 'pagesComponents/Detail/component/ListingCard';
import BigNumber from 'bignumber.js';
import { useIntersection } from 'react-use';
import useDetailGetState from 'store/state/detailGetState';

import { DetailCard as InfoCard } from 'pagesComponents/Detail/component/InfoCard';

import Menu from 'assets/images/v2/menu.svg';
import Detail from 'assets/images/v2/detail.svg';
import Chart from 'assets/images/v2/chart.svg';
import EditIcon from 'assets/images/v2/edit_xs.svg';
import Biddings from 'assets/images/v2/biddings.svg';

export default function DetailMobile() {
  const { isFetching, elfRate, isERC721, tokenBalance, intervalDataForBid } = useInitializationDetail();

  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  const [key, setKey] = useState('0');

  const onChange = (key: string) => {
    setKey(key);
  };

  const items: any = useMemo(() => {
    let items = [
      {
        label: (
          <span className={`${styles.tableMenu} ${key == 'Offer' ? 'text-textPrimary' : 'text-textSecondary'}`}>
            <Menu fill={key == 'Offer' ? '#1A1A1A' : '#808080'} />
            Offer
          </span>
        ),
        key: 'Offer',
        children: <Offers rate={elfRate} />,
      },
      {
        label: (
          <span className={`${styles.tableMenu} ${key == 'Chart' ? 'text-textPrimary' : 'text-textSecondary'}`}>
            <Chart fill={key == 'Chart' ? '#1A1A1A' : '#808080'} />
            Chart
          </span>
        ),
        key: 'Chart',
        children: <PriceHistory />,
      },
      {
        label: (
          <span className={`${styles.tableMenu} ${key == 'Details' ? 'text-textPrimary' : 'text-textSecondary'}`}>
            <Detail fill={key == 'Details' ? '#1A1A1A' : '#808080'} />
            Details
          </span>
        ),
        key: 'Details',
        children: <InfoCard />,
      },
    ];

    if (!isERC721) {
      items = [
        {
          label: (
            <span className={`${styles.tableMenu} ${key == 'List' ? 'text-textPrimary' : 'text-textSecondary'}`}>
              <EditIcon fill={key == 'List' ? '#1A1A1A' : '#808080'} />
              List
            </span>
          ),
          key: 'List',
          children: <Listings rate={elfRate} />,
        },
        ...items,
      ];
    }
    if (intervalDataForBid?.isBidding) {
      items = [
        {
          label: (
            <span className={`${styles.tableMenu} ${key == 'Biddings' ? 'text-textPrimary' : 'text-textSecondary'}`}>
              <Biddings />
              <span>Biddings</span>
            </span>
          ),
          key: 'Biddings',
          children: <BidList bidInfos={intervalDataForBid.bidInfos} />,
        },
        {
          label: (
            <span className={`${styles.tableMenu} ${key == 'Details' ? 'text-textPrimary' : 'text-textSecondary'}`}>
              <Detail />
              <span>Details</span>
            </span>
          ),
          key: 'Details',
          children: <InfoCard />,
        },
      ];
    }

    return items;
  }, [key, isERC721, intervalDataForBid]);

  return (
    <div className={`${styles.detail} ${styles['mobile-detail']}`}>
      <>
        <Creator />
        <Title className="mt-[8px]" />
        <Owner className="mt-[8px]" isERC721={isERC721} />
        <Picture />
        {!isFetching && (
          <>
            {intervalDataForBid?.isBidding ? (
              <div className="mt-[40px]">
                <BidCardWrapper intervalDataForBid={intervalDataForBid} tokenBalance={new BigNumber(tokenBalance)} />
              </div>
            ) : (
              <>
                <ListingCard rate={elfRate} />
              </>
            )}
          </>
        )}
        <div className="mt-[40px]">
          <TraitsInfoCard />
        </div>

        {!isFetching && nftInfo && (
          <>
            <div className="mt-[40px]" />
            <Tabs items={items} onChange={onChange} />
          </>
        )}
        <div className="mt-[40px]">
          <Activity rate={elfRate} />
        </div>

        {/* <RecommendList /> */}
      </>
    </div>
  );
}
