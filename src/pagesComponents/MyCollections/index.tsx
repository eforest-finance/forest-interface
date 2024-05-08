'use client';
import CollectionList from 'components/CollectionList';
import { Item, useCollections } from 'pagesComponents/Collections/Hooks/useCollections';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'store/store';
import styles from './style.module.css';
import { PAGE_SIZE } from 'constants/common';
import { useMount } from 'react-use';
import Button from 'baseComponents/Button';
import { useLogoutListener } from 'hooks/useLogoutListener';

export default function MyCollections() {
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);
  const nav = useRouter();

  useLogoutListener();

  const [page, setPage] = useState<number>(0);
  const [collectionList, setCollectionList] = useState<Item[]>([]);
  const loading = useRef<boolean>(true);
  const [noMoreStatus, setNoMoreStatus] = useState(false);
  const [, forceUpdate] = useState({});

  const getList = useCollections('address', true);

  const handlePageChange = () => {
    if (loading.current) return;
    loading.current = true;
    setPage((v) => ++v);
  };
  useMount(() => {
    document.body.scrollTop = 0;
  });

  useEffect(() => {
    if (page < 0) {
      loading.current = false;
      return;
    }
    if (!getList) return;
    if (page && collectionList.length < PAGE_SIZE * page) {
      loading.current = false;
      setNoMoreStatus(true);
      return;
    }
    loading.current = true;
    getList('all', page, PAGE_SIZE, (res: Item[]) => {
      loading.current = false;
      setCollectionList((v) => (page ? v.concat(res) : res));
      setNoMoreStatus(res.length < PAGE_SIZE);
    }).finally(() => {
      loading.current = false;
      forceUpdate({});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, getList]);

  return (
    <div
      id="my-protocols"
      className={`${styles['my-protocols']} ${isSmallScreen ? styles['mobile-my-protocols'] : ''}`}>
      <div className={styles['top-panel']}>
        <h1 className={styles['main-title']}>My Collections</h1>
        <p className={styles['description']}>
          Create, curate, and manage collections of unique NFTs to share and sell.
        </p>
        <div className={styles['btn-panel']}>
          <Button
            className={styles['create-btn']}
            size="ultra"
            type="primary"
            onClick={() => nav.push('/create-collection')}>
            Create a Collection
          </Button>
        </div>
      </div>
      <CollectionList
        collectionList={collectionList}
        onPageChange={handlePageChange}
        parentId="#my-protocols"
        noMoreData={noMoreStatus}
        loading={loading.current}
      />
    </div>
  );
}
