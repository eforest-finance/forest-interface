import styles from './styles.module.css';
import { Table, TablePaginationConfig, TableProps } from 'antd';
import React, { memo } from 'react';
import EpPagination, { IEpPaginationProps } from 'components/Pagination';
import clsx from 'clsx';
import useResponsive from 'hooks/useResponsive';
import TableEmpty from 'components/TableEmpty';
export interface ITableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  pagination?: IEpPaginationProps;
  antdPagination?: false | TablePaginationConfig | undefined;
  searchText?: string;
  clearFilter?: () => void;
}

function TSMTable({ pagination, ...params }: ITableProps<any>) {
  const { searchText, clearFilter, antdPagination = false } = params;
  const { isLG: isMobile } = useResponsive();
  return (
    <div className={clsx(styles.TSMTable, isMobile && styles['mobile-TSMTable'])}>
      <Table
        pagination={antdPagination}
        locale={{
          emptyText: <TableEmpty searchText={searchText || ''} clearFilter={clearFilter && clearFilter} />,
        }}
        {...params}
      />
      {pagination && <EpPagination {...pagination} />}
    </div>
  );
}

export default memo(TSMTable);
