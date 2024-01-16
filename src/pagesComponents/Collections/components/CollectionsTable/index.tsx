import { useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import {
  useSearchCollections,
  Item,
  requestSearchCollectionsParams,
} from 'pagesComponents/Collections/Hooks/useSearchCollections';
import { useEffectOnce } from 'react-use';
import getColumns, { ISortProps, SortTypeEnum } from './columnConfig';
import { getPageNumber } from 'utils/calculate';
import useResponsive from 'hooks/useResponsive';
import CollectionSearch from '../CollectionSearch';
import { useDebounceFn } from 'ahooks';
import ModalSearchTable from './mobileSearchTable';
import { InputRef } from 'antd';
import { useRouter } from 'next/navigation';
import Table from 'baseComponents/Table';
import TableEmpty from 'components/TableEmpty';
interface TableDataItem extends Item {
  index: number;
}
export default function CollectionTable() {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [TokenName, setTokenName] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  const [dataSource, setDataSource] = useState<TableDataItem[]>();
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
  const navigate = useRouter();
  const getData = async (params: requestSearchCollectionsParams) => {
    const res = await getList(params);
    setTotal(res.totalCount);
    setDataSource(
      res.items.map((item, index) => {
        navigate.prefetch(`/explore-items/${item.id}`);
        return {
          ...item,
          index: params.SkipCount + index + 1,
        };
      }),
    );
  };
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

  const TokenNameChange = (e: any) => {
    setTokenName(e.target.value);
    run(e.target.value);
  };

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

  const { isLG: isMobile } = useResponsive();
  const pageChange = (page: number) => {
    setCurrent(page);
    getData({
      ...params,
      SkipCount: getPageNumber(page, pageSize),
      MaxResultCount: pageSize,
    });
  };
  const pageSizeChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
    getData({
      ...params,
      SkipCount: getPageNumber(page, size),
      MaxResultCount: size,
    });
  };
  const columns = getColumns(isMobile, sort, sortChange);

  const [open, setOpen] = useState<boolean>(false);
  const searchRef = useRef<InputRef>(null);
  const searchFocus = () => {
    if (isMobile) {
      setOpen(true);
      searchRef.current?.blur();
    }
  };
  const cancel = () => {
    setOpen(false);
  };
  const clearFilter = () => {
    setTokenName('');
    run('');
  };

  return (
    <div className={styles['collections-table']}>
      <div className={styles.header}>
        <div className={styles.title}>Collections</div>
        <div className="search w-full mdl:w-auto">
          <CollectionSearch
            ref={searchRef}
            value={TokenName}
            onChange={TokenNameChange}
            onPressEnter={TokenNameChange}
            onFocus={searchFocus}
            className="mdl:!w-[632px] w-full flex-1"
          />
        </div>
      </div>
      <Table
        pagination={{
          current,
          pageSize,
          total,
          pageChange,
          pageSizeChange,
          hideOnSinglePage: true,
          options: [
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
            {
              label: 50,
              value: 50,
            },
            {
              label: 100,
              value: 100,
            },
          ],
        }}
        searchText={TokenName}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        columns={columns}
        locale={{
          emptyText: <TableEmpty searchText={TokenName || ''} clearFilter={clearFilter} />,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate.push(`/explore-items/${record.id}`);
            },
          };
        }}
      />
      <ModalSearchTable open={open} cancel={cancel} />
    </div>
  );
}
