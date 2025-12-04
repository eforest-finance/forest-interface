import React, { ReactNode, memo } from 'react';
import InfiniteScroll, { Props } from 'react-infinite-scroll-component';
import List, { ListProps } from '..';
import Loading from 'components/Loading';

export interface IInfiniteScroll extends Omit<Props, 'loader' | 'children'> {
  scrollableTarget?: string;
  loader?: ReactNode;
  children?: ReactNode;
  height?: number;
}

function InfiniteScrollList<T>(props: { listProps?: ListProps<T>; infiniteScrollProps: IInfiniteScroll }) {
  const { listProps = {}, infiniteScrollProps } = props;
  const { hasMore, next, dataLength, children, height, loader, endMessage } = infiniteScrollProps;

  return (
    <InfiniteScroll
      {...infiniteScrollProps}
      dataLength={dataLength}
      next={next}
      height={height || 600}
      hasMore={hasMore}
      loader={
        loader || (
          <div className="w-full pt-[12px] pb-[12px] mdTW:pb-0">
            <Loading className="!h-[30px]" imgStyle="!h-[30px] !w-[30px]" />
          </div>
        )
      }
      endMessage={
        dataLength ? (
          typeof endMessage === 'string' || !endMessage ? (
            <div className="text-textSecondary text-base font-medium pt-[28px] pb-[28px] mdTW:pb-0 text-center">
              {endMessage || 'No more yet~'}
            </div>
          ) : (
            endMessage
          )
        ) : null
      }>
      {children ? children : <List {...listProps} />}
    </InfiniteScroll>
  );
}

export default memo(InfiniteScrollList) as <T>(props: {
  listProps?: ListProps<T>;
  infiniteScrollProps: IInfiniteScroll;
}) => JSX.Element;
