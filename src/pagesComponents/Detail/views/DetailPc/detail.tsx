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
import BidCardAndList, { BidList } from '../../component/BidCard';
import useDetailGetState from 'store/state/detailGetState';
import { useInitializationDetail } from 'pagesComponents/Detail/hooks/useInitializationDetail';
import ListingCard from 'pagesComponents/Detail/component/ListingCard';
import BigNumber from 'bignumber.js';
import React, { useEffect, useMemo, useState } from 'react';
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
import EditIcon from 'assets/images/v2/edit_xs.svg';

import Biddings from 'assets/images/v2/biddings.svg';

import { Tabs, Skeleton } from 'antd';

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

  const getDefaultTab = () => {
    const { listingPrice, maxOfferPrice } = nftInfo || {};

    if (isERC721) {
      if (Number(maxOfferPrice) > 0) {
        return 'Offer';
      }
    } else {
      if (Number(listingPrice) > 0) {
        return 'List';
      }

      if (Number(maxOfferPrice) > 0) {
        return 'Offer';
      }
      return 'Details';
    }
    return 'Details';
  };

  const [key, setKey] = useState('0');

  const onChange = (key: string) => {
    setKey(key);
  };

  const items: any = useMemo(() => {
    let items = [
      {
        label: (
          <span className={styles.tableMenu}>
            <Menu />
            <span>Offer</span>
          </span>
        ),
        key: 'Offer',
        children: <Offers rate={elfRate} />,
      },
      {
        label: (
          <span className={styles.tableMenu}>
            <Chart />
            <span>Chart</span>
          </span>
        ),
        key: 'Chart',
        children: <PriceHistory />,
      },
      {
        label: (
          <span className={styles.tableMenu}>
            <Detail />
            <span>Details</span>
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
            <span className={styles.tableMenu}>
              <EditIcon />
              <span>List</span>
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
            <span className={styles.tableMenu}>
              <Biddings />
              <span>Biddings</span>
            </span>
          ),
          key: 'Biddings',
          children: <BidList bidInfos={intervalDataForBid.bidInfos} />,
        },
        {
          label: (
            <span className={styles.tableMenu}>
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
    <div className={`${styles.detail}`}>
      <>
        <div className={styles['top-panel']}>
          <div className={styles['left-wrap']}>
            <Picture />
            <div className="h-[40px]" />
            {!isFetching && <TraitsInfoCard />}
          </div>
          <div className={styles['right-wrap']}>
            <div className="min-h-[536px]">
              {isFetching ? (
                <div>
                  <Skeleton active paragraph={{ rows: 2 }} title />
                  <Skeleton className="mt-[48px]" active paragraph={{ rows: 2 }} title />
                  <Skeleton className="mt-[48px]" active paragraph={{ rows: 2 }} title />
                </div>
              ) : (
                <>
                  <Creator />
                  <Title className={`${nftInfo?.nftCollection?.tokenName && 'mt-[12px]'} text-5xl`} />
                  <Owner className="mt-[12px]" isERC721={isERC721} />
                  {nftInfo?.description && (
                    <div className="mt-[48px] text-[14px] text-textSecondary leading-[24px]  break-words ">
                      {nftInfo?.description}
                    </div>
                  )}

                  {!isFetching && nftInfo && (
                    <>
                      {intervalDataForBid?.isBidding ? (
                        <div className="mt-[96px]">
                          <BidCardAndList
                            intervalDataForBid={intervalDataForBid}
                            tokenBalance={new BigNumber(tokenBalance)}
                          />
                        </div>
                      ) : (
                        <div className={`${nftInfo?.description ? 'mdTW:mt-[48px]' : 'mdTW:mt-[98px]'}`}>
                          <ListingCard rate={elfRate} />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            {!isFetching && nftInfo && (
              <>
                <div className="mt-[40px]" />
                <Tabs items={items} onChange={onChange} />
              </>
            )}
          </div>
        </div>
        <div id="activity-ref" className="mdTW:mt-[48px]">
          {nftInfo && <Activity rate={elfRate} />}
        </div>
      </>
    </div>
  );
}

export default React.memo(DetailPc);
