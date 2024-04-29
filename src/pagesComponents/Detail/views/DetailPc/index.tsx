'use client';
import { Col, Row, Skeleton } from 'antd';
// import DetailCard from 'pagesComponents/Detail/component/DetailCard';
import { DescriptionCard } from 'pagesComponents/Detail/component/DetailCard/DescriptionCard';
import { DetailCard as DetailCardNew } from 'pagesComponents/Detail/component/DetailCard/DetailsCard';
import { InscriptionInfoCard } from 'pagesComponents/Detail/component/DetailCard/InscriptionInfoCard';
import { CreateTokenInfoCard } from 'pagesComponents/Detail/component/DetailCard/CreateTokenInfoCard';
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
import { RankingInfoCard } from 'pagesComponents/Detail/component/DetailCard/RankingInfoCard';

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
            <DescriptionCard />
            <TraitsInfoCard />
            <GenerationInfoCard />
            <RankingInfoCard />
            <DetailCardNew />
            <CreateTokenInfoCard />
            <InscriptionInfoCard />
          </div>

          <div className={styles['right-wrap']}>
            <Creator />
            <Title className={`${nftInfo?.nftCollection?.tokenName && 'mt-[12px]'} text-5xl`} />
            <Owner className="mt-[12px]" isERC721={isERC721} />

            <Skeleton
              loading={isFetching}
              active
              paragraph={{
                rows: 15,
              }}
              title>
              <>
                {nftInfo && (
                  <>
                    {intervalDataForBid?.isBidding ? (
                      <div className="mt-[40px]">
                        <BidCardAndList
                          intervalDataForBid={intervalDataForBid}
                          tokenBalance={new BigNumber(tokenBalance)}
                        />
                      </div>
                    ) : (
                      <>
                        <ListingCard rate={elfRate} />
                        <Row className="flex items-center justify-center flex-1 max-w-[100%]" gutter={[0, 16]}>
                          <Col span={24}>
                            <PriceHistory />
                          </Col>
                          <Col span={24}>
                            <Listings rate={elfRate} />
                          </Col>
                          <Col span={24}>
                            <Offers rate={elfRate} />
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                )}
              </>
            </Skeleton>
          </div>
        </div>
        <div className="mdTW:mt-[16px]">
          <Activity />
        </div>
        <div className="mdTW:mt-[16px]">
          <RecommendList />
        </div>
      </>
    </div>
  );
}

export default React.memo(DetailPc);
