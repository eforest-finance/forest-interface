'use client';
import useIsMinter from 'hooks/useIsMinter';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CollectionsTabs from './components/CollectionsTabs';
import styles from './styles.module.css';
import ExploreItems from './ExploreItems';
import CollectionsInfo from './components/CollectionsInfo';
import Link from 'next/link';
import Button from 'baseComponents/Button';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import ActivityItems from './ActivityItems';
import useTokenData from 'hooks/useTokenData';
import clsx from 'clsx';

export default function ExploreItemsIndex() {
  const {
    address: [nftCollectionId, activeTab],
  } = useParams();
  const { isMinter, collectionsInfo } = useIsMinter(nftCollectionId as string);
  const { isSmallScreen } = useSelector(selectInfo);
  const elfRate = useTokenData();
  const nav = useRouter();
  const tabItems = useMemo(() => {
    return [
      {
        label: (
          <div className={styles.tab__item}>
            <span className={clsx(styles.tab__item__label, activeTab !== 'activity' && '!text-textPrimary')}>
              Items
            </span>
          </div>
        ),
        key: 'items',
        children: <ExploreItems elfRate={elfRate} nftCollectionId={nftCollectionId as string} />,
      },
      {
        label: (
          <div className={styles.tab__item}>
            <span className={clsx(styles.tab__item__label, activeTab === 'activity' && '!text-textPrimary')}>
              Activity
            </span>
          </div>
        ),
        key: 'activity',
        children: <ActivityItems nftCollectionId={nftCollectionId as string} />,
      },
    ];
  }, [nftCollectionId]);

  return (
    <div className={styles.explore__banner}>
      <div
        id="explore__container"
        className={`${styles.explore__container} ${isSmallScreen && styles.explore__container__mobile}`}>
        <CollectionsInfo collectionsInfo={collectionsInfo} />
        {isMinter && (
          <div className={styles['explore-item-header']}>
            <Button type="primary" className="!w-[140px]" size="large">
              <Link
                href={{
                  pathname: '/create-item',
                  query: { collectionId: nftCollectionId },
                }}>
                Add item
              </Link>
            </Button>
          </div>
        )}
        <CollectionsTabs
          items={tabItems}
          destroyInactiveTabPane={true}
          defaultActiveKey={activeTab || 'items'}
          onChange={(key) => {
            nav.replace(`/explore-items/${nftCollectionId}/${key}`);
          }}
        />
      </div>
    </div>
  );
}
