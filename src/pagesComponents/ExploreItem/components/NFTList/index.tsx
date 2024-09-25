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

import Multiply from 'assets/images/profile/multiply.svg';

import HonourLabel from 'baseComponents/HonourLabel';

interface INFTListProps {
  collapsed: boolean;
  sizes: BoxSizeEnum;
  className?: string;
  dataSource: INftInfo[];
  hasSearch?: boolean;
  clearFilter?: () => void;
  loading: boolean;
  ELFToDollarRate: number;
  type?: string;
}

interface ItemsCardProps {
  dataSource?: INftInfo;
  className?: string;
  priceClassName?: string;
  extraActions?: React.ReactNode;
  hiddenActions?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  type?: string;
}

export function ItemsCard({ dataSource, className, priceClassName, onClick, type }: ItemsCardProps) {
  const convertType = useMemo(() => {
    if (dataSource?.fileExtension === 'mp3') return 'audio';
    if (dataSource?.fileExtension === 'mp4') return 'video';
    return 'image';
  }, [dataSource?.fileExtension]);
  const price = dataSource?.profileInfo?.showPrice;
  const balance = dataSource?.profileInfo?.balance;

  return (
    <Link href={`/detail/buy/${dataSource?.id ?? ''}/${(dataSource?.chainIdStr || dataSource?.chainId) ?? ''}`}>
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
                className=" !rounded-t-lg w-full aspect-square object-contain"
                width={'100%'}
                src={dataSource?.previewImage || ''}
              />
              {dataSource?.describe ? (
                <div className="absolute top-3 right-3">
                  <HonourLabel text={dataSource?.describe} />
                </div>
              ) : null}
            </div>
          </>
        }>
        <div className={styles.card__content}>
          <div className="flex items-center justify-between">
            <div className={styles.nft__symbol}>{dataSource?.nftSymbol}</div>
            {balance && balance * 1 > 1 && (
              <div className="text-textNumber px-[4px] font-[500] mb-[4px] truncate">
                <Multiply />
                <span className="pl-[6px]">{formatTokenPrice(balance)}</span>
              </div>
            )}
          </div>
          <div className={styles.token__name}>{dataSource?.tokenName}</div>

          <div className={clsx(styles.token__price, priceClassName)}>
            {type ? (
              <span className={styles.token__label}>
                {dataSource?.profileInfo?.minListingPrice ? 'List Price' : 'Best Offer'}
              </span>
            ) : (
              <span className={styles.token__label}>{dataSource?.priceDescription || 'Price'}</span>
            )}

            <span className={styles.token__price__text}>
              {price && price * 1 >= 0 ? formatTokenPrice(price) + ' ELF' : '--'}
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
  type,
}: INFTListProps) {
  const column = useColumns(collapsed, sizes);

  if (sizes === BoxSizeEnum.details) {
    return <NFTListTable ELFToDollarRate={ELFToDollarRate} dataSource={dataSource || []} loading={loading} />;
  }

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
          <ItemsCard hiddenActions={false} key={item?.id} dataSource={item} type={type} />
        </List.Item>
      )}
    />
  );
}
