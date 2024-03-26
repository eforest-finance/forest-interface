import { Card, List, ListProps } from 'antd';
import ImgLoading from 'components/ImgLoading';
import { useCallback, useEffect, useMemo } from 'react';
import { INftInfo } from 'types/nftTypes';
import styles from './style.module.css';
import { COLLECTION_DEFAULT_IMG } from 'constants/FileConfig';
import useColumns from 'hooks/useColumns';
import { BoxSizeEnum } from '../CollectionItemsSearch';
import LoadingMore from 'components/Loading';
import { useDebounceFn } from 'ahooks';
import TableEmpty, { emptyEnum } from 'components/TableEmpty';
import Link from 'next/link';
import clsx from 'clsx';
import { formatTokenPrice } from 'utils/format';

interface ItemsCardProps {
  dataSource?: INftInfo;
  className?: string;
  priceClassName?: string;
  extraActions?: React.ReactNode;
  hiddenActions?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function ItemsCard({ dataSource, className, priceClassName, onClick }: ItemsCardProps) {
  const convertType = useMemo(() => {
    if (dataSource?.fileExtension === 'mp3') return 'audio';
    if (dataSource?.fileExtension === 'mp4') return 'video';
    return 'image';
  }, [dataSource?.fileExtension]);
  return (
    <Link href={`/detail/buy/${dataSource?.id ?? ''}/${dataSource?.chainIdStr ?? ''}`}>
      <Card
        className={`${styles['items-card-wrapper']} h-full ${className}`}
        onClick={onClick}
        cover={
          <>
            {convertType !== 'image' && (
              <div className={styles['mark']}>{dataSource?.fileExtension?.toUpperCase()}</div>
            )}
            <div className="border-x-0 border-y-0 border-b-[1px] border-solid border-[var(--line-dividers)]">
              <ImgLoading
                className="rounded-[12px]"
                src={dataSource?.previewImage || COLLECTION_DEFAULT_IMG}
                nextImageProps={{ className: '!object-contain' }}
              />
            </div>
          </>
        }>
        <div className={styles.card__content}>
          <div className={styles.nft__symbol}>{dataSource?.nftSymbol}</div>
          <div className={styles.token__name}>{dataSource?.tokenName}</div>
          <div className={clsx(styles.token__price, priceClassName)}>
            <span className={styles.token__label}>{dataSource?.priceDescription || 'Price'}</span>
            <span className={styles.token__price__text}>
              {(dataSource?.price || dataSource?.price === 0) && dataSource?.price >= 0
                ? formatTokenPrice(dataSource.price) + ' ELF'
                : '--'}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface IContentProps {
  collapsed: boolean;
  sizes: BoxSizeEnum;
  className?: string;
  InfiniteScrollProps: {
    hasMore: boolean;
    total: number;
    hasSearch?: boolean;
    loadingMore: boolean;
    loading: boolean;
    loadMore: () => void;
    clearFilter?: () => void;
  };
  ListProps: ListProps<INftInfo>;
}

function ScrollContent(props: IContentProps) {
  const { ListProps, InfiniteScrollProps } = props;
  const { loading, hasMore, loadingMore, loadMore, hasSearch, clearFilter } = InfiniteScrollProps;
  const { run } = useDebounceFn(loadMore, {
    wait: 100,
  });
  const column = useColumns(props.collapsed, props.sizes);
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
    <div className={clsx('item-card-wrapper', props.className)}>
      <List
        grid={{ gutter: 16, column: column }}
        locale={{
          emptyText: (
            <TableEmpty
              type={emptyEnum.nft}
              searchText={(hasSearch && 'search') || ''}
              clearFilter={clearFilter && clearFilter}
            />
          ),
        }}
        renderItem={(item) => (
          <List.Item>
            <ItemsCard hiddenActions={false} key={item?.id} dataSource={item} />
          </List.Item>
        )}
        {...ListProps}
      />
      {loading ? <LoadingMore className="absolute z-100 bottom-[20px]" /> : null}
      {!hasMore && loadingMore && ListProps?.dataSource?.length ? (
        <div className="text-center w-full text-textDisable font-medium text-base pb-[20px]">No more data</div>
      ) : null}
    </div>
  );
}

export default ScrollContent;
