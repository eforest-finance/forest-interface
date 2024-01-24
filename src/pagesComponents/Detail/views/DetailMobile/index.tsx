'use client';
import { Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';

import DetailCard from 'pagesComponents/Detail/component/DetailCard';
import Listings from 'pagesComponents/Detail/component/Listings';
import PriceHistory from 'components/PriceHistory';
import RecommendList from 'components/RecommendList';

import styles from './style.module.css';
import Offers from '../../component/Offers';
import Picture from '../../component/Picture/Picture';
import Creator from '../../component/Creator';
import Title from '../../component/Title';
import Owner from '../../component/Owner';
import Activity from '../../component/Activity';
import { BidCardWrapper, BidList } from '../../component/BidCard';
import { useInitializationDetail } from 'pagesComponents/Detail/hooks/useInitializationDetail';
import ListingCard from 'pagesComponents/Detail/component/ListingCard';
import BigNumber from 'bignumber.js';
import { useIntersection } from 'react-use';
import clsx from 'clsx';
import useDetailGetState from 'store/state/detailGetState';
import { store } from 'store/store';
import { setCurrentTab } from 'store/reducer/detail/detailInfo';

export default function DetailMobile() {
  const { isFetching, elfRate, isERC721, tokenBalance, intervalDataForBid } = useInitializationDetail();

  const [showSticky, setShowSticky] = useState<boolean>(false);

  const bottom = Math.floor((window.innerHeight || document.documentElement.clientHeight) - 62);

  const tabsRef = useRef(null);
  const intersection = useIntersection(tabsRef, {
    root: document.body,
    rootMargin: `0px 0px -${bottom}px 0px`,
  });

  useEffect(() => {
    const onScroll = () => {
      if (!tabsRef?.current) return;
      const { top } = (tabsRef?.current as HTMLElement).getBoundingClientRect();
      setShowSticky(top < 63);
    };
    document.body.addEventListener('scroll', onScroll);
    return () => {
      document.body.removeEventListener('scroll', onScroll);
    }
  }, []);

  const {
    detailInfo: { currentTab },
  } = useDetailGetState();

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
        <div ref={tabsRef} className="mt-10">
          <Tabs
            activeKey={currentTab}
            onChange={(activeKey) => {
              store.dispatch(setCurrentTab(activeKey));
            }}
            className={clsx(styles['fixedTabs'], (intersection?.isIntersecting || showSticky) && styles['has-sticky'])}
            animated={false}>
            <Tabs.TabPane tab="Details" key="detail">
              <DetailCard />
            </Tabs.TabPane>
            <Tabs.TabPane
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
            <Tabs.TabPane tab="Activity" key="activity">
              <Activity />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <RecommendList />
      </>
    </div>
  );
}
