import { Card, List } from 'antd';
import { INftInfo } from 'types/nftTypes';
import useColumns from 'hooks/useColumns';
import { NFTListTable } from '../NftListTable';
import TableEmpty, { emptyEnum } from 'components/TableEmpty';
import { useMemo } from 'react';
import Link from 'next/link';
import styles from './style.module.css';
import { ImageEnhance } from 'components/ImgLoading';
import { formatTokenPrice } from 'utils/format';
import clsx from 'clsx';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';

interface INFTListProps {
  collapsed: boolean;
  sizes: BoxSizeEnum;
  className?: string;
  dataSource: INftInfo[];
  hasSearch?: boolean;
  clearFilter?: () => void;
  loading: boolean;
  ELFToDollarRate: number;
}

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
            <div className="relative border-x-0 border-y-0 border-b-[1px] border-solid border-[var(--line-dividers)]">
              <ImageEnhance
                className=" !rounded-t-lg w-full aspect-square"
                width={'100%'}
                src={dataSource?.previewImage || ''}
              />
              {!dataSource?._rankStrForShow ? null : (
                <div className="absolute bottom-0 left-0 w-full py-1 text-center text-xxs text-white font-medium bg-fillMask1">
                  Rank: {dataSource?._rankStrForShow}
                </div>
              )}
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

export function NFTList({
  sizes,
  collapsed,
  dataSource,
  hasSearch,
  clearFilter,
  loading,
  ELFToDollarRate,
}: INFTListProps) {
  const column = useColumns(collapsed, sizes);

  if (sizes === BoxSizeEnum.details) {
    return <NFTListTable ELFToDollarRate={ELFToDollarRate} dataSource={dataSource || []} loading={loading} />;
  }

  console.log('sizes---', sizes);

  return (
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
      loading={loading}
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item>
          <ItemsCard hiddenActions={false} key={item?.id} dataSource={item} />
        </List.Item>
      )}
    />
  );
}
