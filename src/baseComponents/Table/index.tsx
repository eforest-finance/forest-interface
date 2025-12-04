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
  adaptation?: boolean;
}

export function getEmptyText(emptyText?: string | ReactNode) {
  if (!emptyText) return <span>No Data</span>;
  if (typeof emptyText === 'string') {
    return (
      <p className="text-textDisable text-center w-full p-[24px] text-base font-medium">{emptyText || 'No Data'}</p>
    );
  } else {
    return emptyText;
  }
}

function Table({ pagination, emptyText, adaptation = false, ...params }: ITableProps<any>) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return (
    <div className={clsx(styles['forest-table'], isSmallScreen && styles['mobile-forest-table'])}>
      {isSmallScreen && adaptation ? (
        <div>
          {params?.dataSource?.map((item, index) => {
            return (
              <div className="p-[24px] border-0 border-solid border-b border-lineDividers last:border-b-0" key={index}>
                {params.columns?.map((column) => {
                  return column.key ? (
                    <div key={column.key} className="flex justify-between mb-[12px] last:mb-0">
                      <span className="text-base text-textSecondary">
                        {typeof column.title === 'function' ? column.title({}) : column.title}
                      </span>
                      <span>{column?.render ? column?.render(item[column.key], item, index) : item[column.key]}</span>
                    </div>
                  ) : null;
                })}
              </div>
            );
          })}
          {!params.dataSource?.length && getEmptyText(emptyText)}
        </div>
      ) : (
        <AntdTable
          pagination={false}
          locale={{
            emptyText: getEmptyText(emptyText),
          }}
          {...params}
        />
      )}

      {pagination && <EpPagination {...pagination} />}
    </div>
  );
}

export default memo(Table);
