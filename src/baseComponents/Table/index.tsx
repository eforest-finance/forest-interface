import styles from './styles.module.css';
import { Table as AntdTable, TableProps } from 'antd';
import React, { ReactNode, memo } from 'react';
import EpPagination, { IEpPaginationProps } from 'components/Pagination';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
export interface ITableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  pagination?: IEpPaginationProps | false;
  emptyText?: string | ReactNode;
  searchText?: string;
}

function Table({ pagination, emptyText, ...params }: ITableProps<any>) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const EmptyText =
    typeof emptyText === 'string' ? (
      <p className="text-textDisable text-center w-full p-[24px] text-base font-medium">{emptyText || 'No Data'}</p>
    ) : (
      emptyText
    );

  return (
    <div className={clsx(styles['forest-table'], isSmallScreen && styles['mobile-forest-table'])}>
      <AntdTable
        pagination={false}
        locale={{
          emptyText: EmptyText,
        }}
        {...params}
      />
      {pagination && <EpPagination {...pagination} />}
    </div>
  );
}

export default memo(Table);
