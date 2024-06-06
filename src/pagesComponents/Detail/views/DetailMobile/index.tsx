'use client';
import { Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';

import DetailCard from 'pagesComponents/Detail/component/DetailCard';
import { TraitsInfoCard } from 'pagesComponents/Detail/component/DetailCard/TraitsCard';
import { GenerationInfoCard } from 'pagesComponents/Detail/component/DetailCard/GenerationInfoCard';

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
import { RarityInfoCard } from 'pagesComponents/Detail/component/DetailCard/RarityInfoCard';

export default function DetailMobile() {
  const { isFetching, elfRate, isERC721, tokenBalance, intervalDataForBid } = useInitializationDetail();

  const [showSticky, setShowSticky] = useState<boolean>(false);
  const scrollTopWhenStickyRef = useRef<number>(0);

  const bottom = Math.floor((window.innerHeight || document.documentElement.clientHeight) - 62);

  const tabsRef = useRef(null);
  const intersection = useIntersection(tabsRef, {
    root: document.body,
    rootMargin: `0px 0px -${bottom}px 0px`,
  });

  const resetScrollTopOnTabChange = () => {
    if (scrollTopWhenStickyRef.current < 1) return;
    if (document.body.scrollTop < scrollTopWhenStickyRef.current) return;
    document.body.scrollTo(0, scrollTopWhenStickyRef.current);
  };

  useEffect(() => {
    const onScroll = () => {
      if (!tabsRef?.current) return;
      const { top } = (tabsRef?.current as HTMLElement).getBoundingClientRect();
      setShowSticky(top < 63);
      if (top < 63 && !scrollTopWhenStickyRef.current) {
        scrollTopWhenStickyRef.current = document.body.scrollTop;
      }
    };
    document.body.addEventListener('scroll', onScroll);
    return () => {
      document.body.removeEventListener('scroll', onScroll);
    };
  }, []);

  const {
    detailInfo: { currentTab, nftTraitInfos },
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
            defaultActiveKey={Number(nftTraitInfos?.generation || '') > 0 ? 'rarityInfos' : 'detail'}
            onChange={(activeKey) => {
              store.dispatch(setCurrentTab(activeKey));
              resetScrollTopOnTabChange();
            }}
            className={clsx(styles['fixedTabs'], (intersection?.isIntersecting || showSticky) && styles['has-sticky'])}
            animated={false}>
            {Number(nftTraitInfos?.generation || '') > 0 ? (
              <Tabs.TabPane tab="Rarity Information" key="rarityInfos">
                <GenerationInfoCard />
                <RarityInfoCard />
              </Tabs.TabPane>
            ) : null}

            <Tabs.TabPane tab="Details" key="detail">
              <DetailCard />
              <GenerationInfoCard />
              <RarityInfoCard />
            </Tabs.TabPane>
            {nftTraitInfos?.traitInfos?.length ? (
              <Tabs.TabPane tab="Traits" key="traits">
                <TraitsInfoCard />
              </Tabs.TabPane>
            ) : null}
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
