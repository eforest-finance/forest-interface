import { ReactNode, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import {
  useSearchCollections,
  Item,
  requestSearchCollectionsParams,
} from 'pagesComponents/Collections/Hooks/useSearchCollections';
import { useEffectOnce } from 'react-use';
import useGetState from 'store/state/getState';

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
import { Select } from 'baseComponents/Select';
import clsx from 'clsx';

export interface ICollectionProps {
  title?: ReactNode;
  showSearchBar?: boolean;
  showPagination?: boolean;
  columnKeys?: string[];
  className?: string;
  pageSize?: number;
}

interface TableDataItem extends Item {
  index: number;
}

export default function CollectionTable(props: ICollectionProps) {
  const {
    title,
    showSearchBar = true,
    columnKeys,
    className,
    showPagination = true,
    pageSize: defaultPageSize = 10,
  } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [TokenName, setTokenName] = useState<string>('');
  const [dateRangeType, setDateRangeType] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [dataSource, setDataSource] = useState<TableDataItem[]>();
  const [sort, setSort] = useState<ISortProps>({
    sort: 'volumeTotal',
    sortType: SortTypeEnum.desc,
  });

  const params = useMemo(() => {
    return {
      SkipCount: getPageNumber(current, pageSize),
      DateRangeType: dateRangeType,
      MaxResultCount: pageSize,
      TokenName: TokenName,
      Sort: sort.sortType === SortTypeEnum.default ? null : sort.sort,
      SortType: sort.sortType === SortTypeEnum.default ? null : sort.sortType,
    };
  }, [current, pageSize, TokenName, sort, dateRangeType]);
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
    ({ value, DateRangeType = 0 }) => {
      setCurrent(1);
      getData({
        ...params,
        SkipCount: getPageNumber(1, pageSize),
        TokenName: value,
        DateRangeType,
      });
    },
    {
      wait: 500,
    },
  );

  const dateTypeChange = (value: any) => {
    setDateRangeType(value);
    run({
      value: TokenName,
      DateRangeType: value,
    });
  };

  const TokenNameChange = (e: any) => {
    setTokenName(e.target.value);
    run({ value: e.target.value, DateRangeType: dateRangeType });
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
  const columns = getColumns(isMobile, sort, sortChange, columnKeys);

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
    run({
      value: '',
      DateRangeType: dateRangeType,
    });
  };

  return (
    <div className={`${styles['collections-table']} ${className}`}>
      <div className={styles.header}>
        {title ? (
          <>{title}</>
        ) : (
          <>
            <div className={styles.title}>{title ? title : 'Collections'}</div>

            {showSearchBar && (
              <div className="search w-full flex mdl:w-auto">
                <Select
                  value={dateRangeType}
                  onChange={dateTypeChange}
                  className={clsx(isMobile ? 'w-[86px]' : 'w-[146px]', 'mr-6')}
                  options={[
                    {
                      value: 0,
                      label: '24H',
                    },
                    {
                      value: 1,
                      label: '7D',
                    },
                  ]}></Select>
                <CollectionSearch
                  ref={searchRef}
                  value={TokenName}
                  onChange={TokenNameChange}
                  onPressEnter={TokenNameChange}
                  onFocus={searchFocus}
                  className="mdl:!w-[632px] w-full flex-1"
                />
              </div>
            )}
          </>
        )}
      </div>
      <Table
        pagination={
          showPagination
            ? {
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
              }
            : false
        }
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
        scroll={{ x: columns.reduce((pre, cur) => pre + Number(cur.width || 50), 0) }}
        className={isMobile ? styles['mobile-table'] : ''}
        sticky={{
          offsetHeader: isSmallScreen ? 62 : 80,
        }}
      />
      <ModalSearchTable open={open} cancel={cancel} />
    </div>
  );
}
