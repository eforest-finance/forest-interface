import { ColumnsType } from 'antd/lib/table';
import { Item } from 'pagesComponents/Collections/Hooks/useSearchCollections';
import styles from './styles.module.css';
import clsx from 'clsx';
import { unitConverter } from 'utils/unitConverter';
import SortDefault from 'assets/images/explore/sort-arrow-default.svg';
import SortDown from 'assets/images/explore/arrow-down.svg';
import SortUp from 'assets/images/explore/arrow-up.svg';
import { debounce } from 'lodash-es';
import { ImageEnhance } from 'components/ImgLoading';
import { formatNumber, formatTokenPrice } from 'utils/format';
export enum SortTypeEnum {
  asc,
  desc,
  default,
}

export type Sort = 'floorPrice' | 'itemTotal' | 'ownerTotal' | '';

export interface ISortProps {
  sort: Sort;
  sortType: SortTypeEnum;
}

export default function getColumns(
  isMobile: boolean,
  sort: ISortProps,
  sortChange: (params: ISortProps) => void,
): ColumnsType<Item> {
  const sortClick = debounce((sortItem: Sort) => {
    if (sort.sort === sortItem) {
      sortChange({
        sort: sortItem,
        sortType:
          sort.sortType === SortTypeEnum.asc
            ? SortTypeEnum.default
            : sort.sortType === SortTypeEnum.desc
            ? SortTypeEnum.asc
            : SortTypeEnum.desc,
      });
    } else {
      sortChange({
        sort: sortItem,
        sortType: SortTypeEnum.desc,
      });
    }
  }, 500);
  return isMobile
    ? [
        {
          title: '#',
          dataIndex: 'index',
          width: '32px',
          key: 'index',
          render: (text) => (
            <div className="flex items-center">
              <span className={clsx(styles['table-text'], 'font-semibold !text-[var(--table-header-text)]')}>
                {text}
              </span>
            </div>
          ),
        },
        {
          title: 'Collection',
          dataIndex: 'tokenName',
          ellipsis: true,
          key: 'tokenName',
          render: (text, record) => (
            <div className="flex items-center">
              <div className="mr-2">
                <ImageEnhance
                  src={record.logoImage}
                  className="shrink-0 !w-[40px] !h-[40px] !rounded-sm object-cover"
                />
              </div>
              <div className="flex flex-col text-ellipsis truncate items-left justify-center">
                <div
                  className={clsx(
                    styles['table-text'],
                    'font-semibold w-full text-ellipsis truncate !text-[14px] !leading-[22px]',
                  )}>
                  {text}
                </div>
                <div
                  className={clsx(
                    styles['table-text'],
                    'font-semibold !text-[12px] !leading-[20px] !text-[var(--table-header-text)]',
                  )}>
                  <span className="mr-[8px]">Items</span>
                  <span>{unitConverter(record.itemTotal, record.itemTotal >= 1000 ? 1 : 4)}</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: (
            <div
              className={clsx(styles['sort-header'], 'justify-end')}
              onClick={() => {
                sortClick('floorPrice');
              }}>
              <span className={styles['sort-header-title']}>Floor Price</span>
              {(sort.sort !== 'floorPrice' ||
                (sort.sort === 'floorPrice' && sort.sortType === SortTypeEnum.default)) && <SortDefault />}
              {sort.sort === 'floorPrice' && sort.sortType === SortTypeEnum.desc && <SortDown />}
              {sort.sort === 'floorPrice' && sort.sortType === SortTypeEnum.asc && <SortUp />}
            </div>
          ),
          dataIndex: 'floorPrice',
          key: 'floorPrice',
          render: (text, record) => (
            <div className="text-right">
              <span className={clsx(styles['table-text'], 'font-medium')}>
                {(text || text === 0) && text >= 0
                  ? formatTokenPrice(text) + ' ' + (record.floorPriceSymbol || 'ELF')
                  : '-'}
              </span>
            </div>
          ),
        },
      ]
    : [
        {
          title: '#',
          dataIndex: 'index',
          className: 'w-[80px]',
          fixed: true,
          key: 'index',
          render: (text) => (
            <div className="flex items-center">
              <span className={clsx(styles['table-text'], 'font-semibold !text-[var(--table-header-text)]')}>
                {text}
              </span>
            </div>
          ),
        },
        {
          title: (
            <div className={clsx(styles['sort-header'])}>
              <span className={styles['sort-header-title']}>Collection</span>
            </div>
          ),
          dataIndex: 'tokenName',
          className: 'w-[624px]',
          key: 'tokenName',
          render: (text, record) => (
            <div className="flex items-center">
              <div className="mr-[24px]">
                <ImageEnhance
                  src={record.logoImage}
                  className="shrink-0 !w-[70px] !h-[70px] !rounded-md object-cover "
                />
              </div>
              <span className={clsx(styles['table-text'], 'font-semibold')}>{text}</span>
            </div>
          ),
        },
        {
          title: (
            <div
              className={clsx(styles['sort-header'])}
              onClick={() => {
                sortClick('floorPrice');
              }}>
              <span className={styles['sort-header-title']}>Floor Price</span>
              {(sort.sort !== 'floorPrice' ||
                (sort.sort === 'floorPrice' && sort.sortType === SortTypeEnum.default)) && <SortDefault />}
              {sort.sort === 'floorPrice' && sort.sortType === SortTypeEnum.desc && <SortDown />}
              {sort.sort === 'floorPrice' && sort.sortType === SortTypeEnum.asc && <SortUp />}
            </div>
          ),
          dataIndex: 'floorPrice',
          className: 'w-[264px]',
          key: 'floorPrice',
          render: (text, record) => (
            <div className="flex items-center">
              <span className={clsx(styles['table-text'], 'font-medium')}>
                {(text || text === 0) && text >= 0
                  ? formatTokenPrice(text) + ' ' + (record.floorPriceSymbol || 'ELF')
                  : '-'}
              </span>
            </div>
          ),
        },
        {
          title: (
            <div
              className={clsx(styles['sort-header'])}
              onClick={() => {
                sortClick('itemTotal');
              }}>
              <span className={styles['sort-header-title']}>Items</span>
              {(sort.sort !== 'itemTotal' || (sort.sort === 'itemTotal' && sort.sortType === SortTypeEnum.default)) && (
                <SortDefault />
              )}
              {sort.sort === 'itemTotal' && sort.sortType === SortTypeEnum.desc && <SortDown />}
              {sort.sort === 'itemTotal' && sort.sortType === SortTypeEnum.asc && <SortUp />}
            </div>
          ),
          dataIndex: 'itemTotal',
          className: 'w-[184px]',
          key: 'itemTotal',
          render: (text) => (
            <div className="flex items-center">
              <span className={clsx(styles['table-text'], 'font-medium')}>{formatNumber(text)}</span>
            </div>
          ),
        },
        {
          title: (
            <div
              className={clsx(styles['sort-header'], 'justify-end')}
              onClick={() => {
                sortClick('ownerTotal');
              }}>
              <span className={styles['sort-header-title']}>Owners</span>
              {(sort.sort !== 'ownerTotal' ||
                (sort.sort === 'ownerTotal' && sort.sortType === SortTypeEnum.default)) && <SortDefault />}
              {sort.sort === 'ownerTotal' && sort.sortType === SortTypeEnum.desc && <SortDown />}
              {sort.sort === 'ownerTotal' && sort.sortType === SortTypeEnum.asc && <SortUp />}
            </div>
          ),
          dataIndex: 'ownerTotal',
          className: 'w-[128px]',
          align: 'right',
          key: 'ownerTotal',
          render: (text) => (
            <div className="text-right">
              <span className={clsx(styles['table-text'], 'font-medium')}>{formatNumber(text)}</span>
            </div>
          ),
        },
      ];
}
