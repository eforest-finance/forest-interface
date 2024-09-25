'use client';
import { Col, Row } from 'antd';
// import DetailCard from 'pagesComponents/Detail/component/DetailCard';
import { DescriptionCard } from 'pagesComponents/Detail/component/DetailCard/DescriptionCard';
import { DetailCard as InfoCard } from 'pagesComponents/Detail/component/InfoCard';
import { InscriptionInfoCard } from 'pagesComponents/Detail/component/DetailCard/InscriptionInfoCard';
import { CreateTokenInfoCard } from 'pagesComponents/Detail/component/DetailCard/CreateTokenInfoCard';
// import { TraitsInfoCard } from 'pagesComponents/Detail/component/DetailCard/TraitsCard';
import TraitsInfoCard from 'pagesComponents/Detail/component/DetailCard/Traits';

import { GenerationInfoCard } from 'pagesComponents/Detail/component/DetailCard/GenerationInfoCard';
import { RarityInfoCard } from 'pagesComponents/Detail/component/DetailCard/RarityInfoCard';
import Listings from 'pagesComponents/Detail/component/Listings';
import PriceHistory from 'components/PriceHistory';
import RecommendList from 'components/RecommendList';

import styles from './style.module.css';
import Offers from '../../component/Offers/offer';
import Picture from '../../component/Picture/Picture';
import Creator from '../../component/Creator';
import Title from '../../component/Title';
import Owner from '../../component/Owner';
import Activity from '../../component/Activity';
import BidCardAndList from '../../component/BidCard';
import useDetailGetState from 'store/state/detailGetState';
import { useInitializationDetail } from 'pagesComponents/Detail/hooks/useInitializationDetail';
import ListingCard from 'pagesComponents/Detail/component/ListingCard';
import BigNumber from 'bignumber.js';
import React, { useEffect } from 'react';
import { store } from 'store/store';
import {
  initializationNftNumber,
  setListings,
  setNftInfo,
  setNftNumber,
  setNftTraitInfos,
  setOffers,
} from 'store/reducer/detail/detailInfo';
import Menu from 'assets/images/v2/menu.svg';
import Detail from 'assets/images/v2/detail.svg';
import Chart from 'assets/images/v2/chart.svg';

import { Tabs } from 'antd';

function DetailPc() {
  const { isFetching, elfRate, isERC721, tokenBalance, intervalDataForBid } = useInitializationDetail();

  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  useEffect(() => {
    return () => {
      store.dispatch(setNftInfo(null));
      store.dispatch(setListings(null));
      store.dispatch(setNftTraitInfos(null));
      store.dispatch(setNftNumber(initializationNftNumber));
      store.dispatch(setOffers(null));
    };
  }, []);

  return (
    <div className={`${styles.detail}`}>
      <>
        <div className={styles['top-panel']}>
          <div className={styles['left-wrap']}>
            <Picture />
            {/* <DescriptionCard /> */}
            <TraitsInfoCard />
            {/* <GenerationInfoCard /> */}
            {/* <RarityInfoCard /> */}
            {/* <DetailCardNew /> */}
            {/* <CreateTokenInfoCard /> */}
            {/* <InscriptionInfoCard /> */}
          </div>
          <div className={styles['right-wrap']}>
            <div className="min-h-[540px]">
              <Creator />
              <Title className={`${nftInfo?.nftCollection?.tokenName && 'mt-[12px]'} text-5xl`} />
              <Owner className="mt-[12px]" isERC721={isERC721} />
              {nftInfo?.description && (
                <div className="mt-[48px] text-[14px] text-textSecondary ">{nftInfo?.description}</div>
              )}

              {!isFetching && nftInfo && (
                <>
                  {intervalDataForBid?.isBidding ? (
                    <div className="mt-[48px]">
                      <BidCardAndList
                        intervalDataForBid={intervalDataForBid}
                        tokenBalance={new BigNumber(tokenBalance)}
                      />
                    </div>
                  ) : (
                    <>
                      <ListingCard rate={elfRate} />
                    </>
                  )}
                </>
              )}
            </div>

            {!isFetching && nftInfo && (
              <>
                <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      label: (
                        <span className={styles.tableMenu}>
                          <Menu />
                          Offer
                        </span>
                      ),
                      key: '1',
                      children: <Offers rate={elfRate} />,
                    },
                    {
                      label: (
                        <span className={styles.tableMenu}>
                          <Chart />
                          Chart
                        </span>
                      ),
                      key: '2',
                      children: <PriceHistory />,
                    },
                    {
                      label: (
                        <span className={styles.tableMenu}>
                          <Detail />
                          Details
                        </span>
                      ),
                      key: '3',

                      children: <InfoCard />,

                      //   children: <Listings rate={elfRate} />,
                    },
                  ]}
                />
                {/* <Row className="flex items-center justify-center flex-1 max-w-[100%]" gutter={[0, 16]}>
                  <Col span={24}>
                    <PriceHistory />
                  </Col>
                  <Col span={24}>
                    <Listings rate={elfRate} />
                  </Col>
                  <Col span={24}>
                    <Offers rate={elfRate} />
                  </Col>
                </Row> */}
              </>
            )}
          </div>
        </div>
        <div className="mdTW:mt-[16px]">
          <Activity rate={elfRate} />
        </div>
        {/* <div className="mdTW:mt-[16px]">
          <RecommendList />
        </div> */}
      </>
    </div>
  );
}

export default React.memo(DetailPc);
