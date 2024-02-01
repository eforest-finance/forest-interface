import { SelectType } from '../SelectType';
import { List } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { EventItem } from '../EventItem';
import LoadingMore from 'components/Loading';
import { useUpdateEffect } from 'react-use';
import { useInViewport, useRequest, useSize } from 'ahooks';
import Button from 'baseComponents/Button';
import { fetchDropList } from 'api/eventApi';
import { IActionDetail } from 'api/types';

export function EventList() {
  const [data, setData] = useState<IActionDetail[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [hasMore, setHasMore] = useState(true);
  const listWrapperRef = useRef(null);
  const loadingMoreRef = useRef(null);

  const loadingDataRef = useRef<boolean>(false);
  const [firstLoaded, setFirstLoaded] = useState<boolean>(false);

  const listingDomSize = useSize(listWrapperRef);
  const [isInViewPort] = useInViewport(loadingMoreRef, { threshold: 0.25 });

  const [selectTypeState, setSelectTypeState] = useState<number>(0);

  const { run, params } = useRequest(fetchDropList, {
    manual: true,
    debounceWait: 1000,
    debounceLeading: true,
    onSuccess(result) {
      if (params[0]?.state !== selectTypeState || pageIndex !== params[0]?.pageIndex) {
        return;
      }
      setData((data) => data.concat(result.items));
      setTotalCount(result.totalCount);
      setPageIndex((pageIndex) => ++pageIndex);
    },
    onFinally() {
      if (params[0]?.state !== selectTypeState || pageIndex !== params[0]?.pageIndex) {
        return;
      }
      loadingDataRef.current = false;
      setFirstLoaded(true);
    },
  });

  const fetchData = (isInit?: boolean) => {
    if (isInit) {
      setFirstLoaded(false);
      setPageIndex(1);
      setData([]);
    }

    if (!isInit && loadingDataRef?.current) {
      return;
    }

    loadingDataRef.current = true;

    run({
      pageIndex: isInit ? 1 : pageIndex,
      pageSize,
      state: selectTypeState,
    });
  };

  useUpdateEffect(() => {
    if (!firstLoaded) return;
    const hasMore = data.length < totalCount;
    setHasMore(hasMore);
  }, [data, totalCount, firstLoaded]);

  useEffect(() => {
    if (isInViewPort && hasMore) {
      fetchData();
    }
  }, [listingDomSize?.height, isInViewPort]);

  useUpdateEffect(() => {
    fetchData(true);
  }, [selectTypeState]);

  const loadMore = (
    <div ref={loadingMoreRef}>{hasMore ? <LoadingMore className="!h-24" imgStyle="h-12 w-12" /> : null}</div>
  );

  const localeEmpty = {
    emptyText: (
      <div className="flex flex-col -m-4 items-center h-[344px] justify-center border border-solid border-lineBorder rounded-lg">
        <span className="text-base text-textPrimary font-medium">No event found</span>
        <Button type="primary" size="ultra" className="text-textPrimary w-[207px] mt-6">
          Back to all events
        </Button>
      </div>
    ),
  };

  return (
    <>
      <div className="mt-[60px] mb-12">
        <div className="flex justify-between items-center">
          <span className="text-textPrimary text-xl sml:text-4xl font-semibold">Events & Airdrops</span>
          <SelectType onSelect={setSelectTypeState} value={selectTypeState} />
        </div>
      </div>
      <div ref={listWrapperRef}>
        <List
          loadMore={loadMore}
          grid={{ gutter: 16, column: 4, xs: 2 }}
          dataSource={data}
          locale={firstLoaded ? localeEmpty : { emptyText: ' ' }}
          renderItem={(item) => {
            return (
              <List.Item>
                <EventItem {...item} />
              </List.Item>
            );
          }}></List>
      </div>
    </>
  );
}
