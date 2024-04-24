import { ListProps } from 'antd';
import { useCallback, useEffect } from 'react';
import LoadingMore from 'components/Loading';
import { useDebounceFn } from 'ahooks';
import { ActivityListTable } from '../ActivityListTable';
import { IActivitiesItem } from 'api/types';
import useResponsive from 'hooks/useResponsive';

interface IContentProps {
  collapsed: boolean;
  className?: string;
  InfiniteScrollProps: {
    hasMore: boolean;
    total: number;
    hasSearch?: boolean;
    loadingMore: boolean;
    loading: boolean;
    loadMore: () => void;
    clearFilter?: () => void;
    stickeyOffsetHeight: number;
  };
  ListProps: ListProps<IActivitiesItem>;
}

function ScrollContent(props: IContentProps) {
  const { ListProps, InfiniteScrollProps } = props;
  const { isLG } = useResponsive();
  const { loading, hasMore, loadingMore, loadMore, hasSearch, clearFilter, stickeyOffsetHeight } = InfiniteScrollProps;
  const { run } = useDebounceFn(loadMore, {
    wait: 100,
  });
  const handleScroll = useCallback(
    async (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.scrollHeight - target.scrollTop - target.clientHeight <= 75) {
        run();
      }
    },
    [run],
  );
  useEffect(() => {
    document.querySelector('#explore__container')?.addEventListener('scroll', handleScroll);
    return () => {
      document.querySelector('#explore__container')?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <ActivityListTable
        dataSource={ListProps.dataSource || []}
        loading={false}
        stickeyOffsetHeight={stickeyOffsetHeight}
      />
      {loading ? <LoadingMore className="absolute z-100 bottom-[20px]" /> : null}
      {!hasMore && loadingMore && ListProps?.dataSource?.length ? (
        <div className="text-center w-full text-textDisable font-medium text-base pb-[20px]">No more data</div>
      ) : null}
    </>
  );
}

export default ScrollContent;
