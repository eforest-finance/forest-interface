import { useCallback } from 'react';
import { useEffectOnce } from 'react-use';

import styles from './CollectionList.module.css';
import { useSelector } from 'store/store';

import LoadingMore from 'components/Loading';
import { Item } from 'pagesComponents/Collections/Hooks/useCollections';
import NewCollectionCard from 'pagesComponents/Collections/components/CollectionCard/NewCollectionCard';

export default function CollectionList(options: {
  collectionList: Item[];
  onPageChange: () => void;
  parentId?: string;
  loading?: boolean;
  noMoreData?: boolean;
}) {
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  const { collectionList, onPageChange, parentId, noMoreData, loading } = options;

  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLElement;
      console.log('hancleColl', target.scrollHeight - target.scrollTop - target.clientHeight);
      if (target.scrollHeight - target.scrollTop - target.clientHeight <= 5) {
        onPageChange();
      }
    },
    [onPageChange],
  );

  useEffectOnce(() => {
    if (!parentId) return;
    document.querySelector(parentId)?.addEventListener('scroll', handleScroll);
  });

  return (
    <div
      id="protocol-infinite-list"
      className={`max-w-[1920px] mx-auto ${styles['protocol-list']} ${
        isSmallScreen ? styles['mobile-protocol-list'] : ''
      }`}>
      <div
        className={`${
          isSmallScreen ? 'pl-[16Px]' : 'pl-[24Px] lg:pl-[40Px]'
        } flex flex-wrap  gap-[16Px] pb-[100px] mt-[48px] ${
          collectionList.length < 4 ? 'ml-0' : 'mx-auto'
        } relative max-w-[1920px]`}>
        {collectionList?.map((item: Item) => {
          return <NewCollectionCard key={item?.id} options={item} />;
        })}

        {loading && !noMoreData ? <LoadingMore className="!h-auto absolute bottom-[20px]" /> : null}
        {noMoreData && collectionList?.length ? (
          <div className="absolute bottom-0 text-center text-[var(--color-disable)] font-medium text-[16px] leading-normal pb-[20px]">
            {/* No more data */}
          </div>
        ) : null}
      </div>
    </div>
  );
}
