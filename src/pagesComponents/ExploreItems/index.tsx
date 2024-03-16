'use client';
import useIsMinter from 'hooks/useIsMinter';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import CollectionsTabs from './components/CollectionsTabs';
import styles from './styles.module.css';
import ExploreItems from './ExploreItems';
import CollectionsInfo from './components/CollectionsInfo';
import Link from 'next/link';
import Button from 'baseComponents/Button';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

export default function ExploreItemsIndex() {
  const { address: nftCollectionId } = useParams();
  const { isMinter, collectionsInfo } = useIsMinter(nftCollectionId as string);
  const { isSmallScreen } = useSelector(selectInfo);
  const [total, setTotal] = useState<number>(0);
  const tabItems = useMemo(() => {
    return [
      {
        label: (
          <div className={styles.tab__item}>
            <span className={styles.tab__item__label}>Items</span>
            <span className={styles.tab__item__total}>({total})</span>
          </div>
        ),
        key: `${nftCollectionId}`,
        children: (
          <ExploreItems
            nftCollectionId={nftCollectionId as string}
            totalChange={(value: number) => {
              setTotal(value);
            }}
          />
        ),
      },
    ];
  }, [collectionsInfo, total, nftCollectionId]);

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
        <CollectionsTabs items={tabItems} />
      </div>
    </div>

    // {
    //   /* <ItemsLayout showAdd={isMinter && isSmallScreen} tabNav={tabName} /> */
    // }
  );
}
