import { InputRef, ModalProps, Spin } from 'antd';
import styles from './modal.module.css';
import CollectionSearch from '../CollectionSearch';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import InfiniteScroll from 'react-infinite-scroller';
import { getPageNumber } from 'utils/calculate';
import getColumns, { ISortProps, SortTypeEnum } from './columnConfig';
import {
  Item,
  requestSearchCollectionsParams,
  useSearchCollections,
} from 'pagesComponents/Collections/Hooks/useSearchCollections';
import Table from '../Table';
import { useEffectOnce } from 'react-use';
import { useRouter } from 'next/navigation';
import Modal from 'baseComponents/Modal';
interface TableDataItem extends Item {
  index: number;
}
interface ISearchModalProps extends ModalProps {
  cancel: () => void;
}
export default function ModalSearchTable(modalProps: ISearchModalProps) {
  const [TokenName, setTokenName] = useState<string>('');
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;
  const [dataSource, setDataSource] = useState<TableDataItem[]>([]);
  const [sort, setSort] = useState<ISortProps>({
    sort: '',
    sortType: SortTypeEnum.default,
  });
  const params = useMemo(() => {
    return {
      SkipCount: getPageNumber(current, pageSize),
      MaxResultCount: pageSize,
      TokenName: TokenName,
      Sort: sort.sortType === SortTypeEnum.default ? null : sort.sort,
      SortType: sort.sortType === SortTypeEnum.default ? null : sort.sortType,
    };
  }, [current, pageSize, TokenName, sort]);
  const { loading, getList } = useSearchCollections();
  const isLoadingMore = useRef<boolean>(false);
  const navigate = useRouter();
  const getData = async (params: requestSearchCollectionsParams) => {
    const res = await getList(params);
    setTotal(res.totalCount);
    const data = res.items.map((item, index) => {
      navigate.prefetch(`/explore-items/${item.id}`);
      return {
        ...item,
        index: params.SkipCount + index + 1,
      };
    });
    if (isLoadingMore.current) {
      const result = [...dataSource, ...data];
      setDataSource(result);
    } else {
      setDataSource(data);
    }
  };

  const hasMore = useMemo(() => {
    if (!total) {
      return false;
    }
    return total > dataSource.length;
  }, [dataSource, total]);

  useEffectOnce(() => {
    getData({ ...params });
  });

  const { run } = useDebounceFn(
    (value) => {
      setCurrent(1);
      getData({
        ...params,
        SkipCount: getPageNumber(1, pageSize),
        TokenName: value,
      });
    },
    {
      wait: 500,
    },
  );
  const sortChange = (sort: ISortProps) => {
    setCurrent(1);
    setSort(sort);
    getData({
      ...params,
      SkipCount: getPageNumber(1, pageSize),
      Sort: sort.sortType === SortTypeEnum.default ? null : sort.sort,
      SortType: sort.sortType === SortTypeEnum.default ? null : sort.sortType,
    });
  };
  const TokenNameChange = (e: any) => {
    setTokenName(e.target.value);
    run(e.target.value);
  };
  const clearFilter = () => {
    setTokenName('');
    run('');
  };

  const columns = getColumns(true, sort, sortChange);
  const loadMore = async () => {
    if (loading || !hasMore) {
      return;
    }

    isLoadingMore.current = true;
    setCurrent(current + 1);
    await getData({ ...params, SkipCount: getPageNumber(current + 1, pageSize) });
    isLoadingMore.current = false;
  };

  const searchRef = useRef<InputRef>(null);

  useEffect(() => {
    if (modalProps.open) {
      setTimeout(() => {
        searchRef?.current?.focus();
      }, 300);
    }
  }, [modalProps.open]);

  return (
    <Modal className={styles.modal__search} transitionName="" closable={false} footer={null} title="" {...modalProps}>
      <div className={styles.modal__content}>
        <div className={styles.modal__header}>
          <CollectionSearch
            ref={searchRef}
            value={TokenName}
            onChange={TokenNameChange}
            onPressEnter={TokenNameChange}
          />
          <span className={styles.modal__header__cancel} onClick={modalProps.cancel}>
            Cancel
          </span>
        </div>
        <div className={styles.modal__scroll__container}>
          <InfiniteScroll
            pageStart={0}
            useWindow={false}
            threshold={70}
            hasMore={hasMore}
            loadMore={loadMore}
            loader={
              <div className="w-full flex items-center justify-center">
                <Spin size="small" />
              </div>
            }>
            <Table
              searchText={TokenName}
              dataSource={dataSource}
              loading={loading && !isLoadingMore.current}
              rowKey="id"
              columns={columns}
              clearFilter={clearFilter}
              scroll={{ x: 1280 }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate.push(`/explore-items/${record.id}`);
                  },
                };
              }}
            />
            {(!hasMore && dataSource.length && (
              <div className="text-center text-[var(--color-disable)] font-medium text-[16px] leading-normal pb-[20px]">
                No more data
              </div>
            )) ||
              ''}
          </InfiniteScroll>
        </div>
      </div>
    </Modal>
  );
}
