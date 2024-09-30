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

    return items;
  }, [key, isERC721]);

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

        {/* <RenderTable /> */}

        {/* <div ref={tabsRef} className="mt-10"> */}
        {/* <Tabs
            defaultActiveKey={Number(nftTraitInfos?.generation || '') > 0 ? 'rarityInfos' : 'detail'}
            onChange={(activeKey) => {
              store.dispatch(setCurrentTab(activeKey));
              resetScrollTopOnTabChange();
            }}
            className={clsx(styles['fixedTabs'], (intersection?.isIntersecting || showSticky) && styles['has-sticky'])}
            animated={false}> */}
        {/* {Number(nftTraitInfos?.generation || '') > 0 ? (
              <Tabs.TabPane tab="Rarity Information" key="rarityInfos">
                <GenerationInfoCard />
                <RarityInfoCard />
              </Tabs.TabPane>
            ) : null} */}
        {/* <Tabs.TabPane
              tab={intervalDataForBid?.isBidding ? 'Offers' : 'Listings & offers'}
              key="listingOffers"
              forceRender={true}>
              {!isFetching && (
                <>
                  {intervalDataForBid?.isBidding ? (
                    <div>
                      <BidList bidInfos={intervalDataForBid?.bidInfos} />
                    </div>
                  ) : (
                    <>
                      <Listings rate={elfRate} />
                      <Offers rate={elfRate} />
                    </>
                  )}
                </>
              )}
            </Tabs.TabPane>

            {!intervalDataForBid?.isBidding && (
              <Tabs.TabPane tab="Price History" key="priceHistory">
                <PriceHistory />
              </Tabs.TabPane>
            )}

            <Tabs.TabPane tab="Details" key="detail">
              <DetailCard />
              <GenerationInfoCard />
              <RarityInfoCard />
            </Tabs.TabPane> */}
        {/* {nftTraitInfos?.traitInfos?.length ? (
              <Tabs.TabPane tab="Traits" key="traits">
                <TraitsInfoCard />
              </Tabs.TabPane>
            ) : null} */}

        {/* <Tabs.TabPane tab="Activity" key="activity">
              <Activity />
            </Tabs.TabPane> */}
        {/* </Tabs> */}
        {/* </div> */}
        <div className="mt-[40px]">
          <Activity rate={elfRate} />
        </div>

        {/* <RecommendList /> */}
      </>
    </div>
  );
}
