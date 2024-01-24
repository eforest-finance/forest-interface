import { List as AntdList, ListProps as AntdListProps } from 'antd';
import React, { ReactNode, memo } from 'react';
import InfiniteScrollList from './InfiniteScrollList';
import ListItem from './ListItem';
import { getEmptyText } from 'baseComponents/Table';

export interface ListProps<T> extends Omit<AntdListProps<T>, 'dataSource' | 'rowKey' | 'renderItem'> {
  dataSource?: T[];
  rowKey?: ((item: T) => React.Key) | keyof T;
  emptyText?: string | ReactNode;
  renderItem?: (item: T, index: number) => React.ReactNode;
}

function List<T>(props?: ListProps<T>) {
  return (
    <AntdList
      {...props}
      locale={{
        emptyText: props?.loading ? null : getEmptyText(props?.emptyText),
      }}
    />
  );
}

export default memo(List) as <T>(props?: ListProps<T>) => JSX.Element;
export { InfiniteScrollList, ListItem };
