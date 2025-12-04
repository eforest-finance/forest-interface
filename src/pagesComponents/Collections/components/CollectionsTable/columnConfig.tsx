import { ColumnsType } from 'antd/lib/table';
import { Typography } from 'antd';
import { Item } from 'pagesComponents/Collections/Hooks/useSearchCollections';
import styles from './styles.module.css';
import clsx from 'clsx';
import SortDefault from 'assets/images/explore/sort-arrow-default.svg';
import SortDown from 'assets/images/explore/arrow-down.svg';
import SortUp from 'assets/images/explore/arrow-up.svg';
import { debounce } from 'lodash-es';
import { ImageEnhance } from 'components/ImgLoading';
import { formatNumberEnhance, formatTokenPrice } from 'utils/format';
import Tooltip from 'baseComponents/Tooltip';
import { thousandsNumber } from 'utils/unitConverter';
import BigNumber from 'bignumber.js';

const { Text } = Typography;
export enum SortTypeEnum {
  asc,
  desc,
  default,
}

export type Sort =
  | 'floorPrice'
  | 'itemTotal'
  | 'ownerTotal'
  | 'volumeTotal'
  | 'volumeTotalChange'
  | 'floorChange'
  | 'salesTotal'
  | 'supplyTotal'
  | '';

export interface ISortProps {
  sort: Sort;
  sortType: SortTypeEnum;
}

export default function getColumns(
  isMobile: boolean,
  sort: ISortProps,
  sortChange: (params: ISortProps) => void,
  columnKeys?: string[],
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

  const renderTitle = (title: string, sortKeyWord: Sort) => (
    <div
      className={clsx(styles['sort-header'])}
      onClick={() => {
        sortClick(sortKeyWord);
      }}>
      <span className={styles['sort-header-title']}>{title}</span>
      {(sort.sort !== sortKeyWord || (sort.sort === sortKeyWord && sort.sortType === SortTypeEnum.default)) && (
        <SortDefault />
      )}
      {sort.sort === sortKeyWord && sort.sortType === SortTypeEnum.desc && <SortDown />}
      {sort.sort === sortKeyWord && sort.sortType === SortTypeEnum.asc && <SortUp />}
    </div>
  );
  const renderNumberOfChange = (text: string | number) => {
    const num = Number(text);
    if (isNaN(num)) return '-';

    const percentStr = BigNumber(num).abs().times(100).toFixed(2, BigNumber.ROUND_DOWN);
    const percent = Number(percentStr);

    if (percent === 0) {
      return <span className=" text-textSecondary">0.00%</span>;
    }

    const textClassName = num < 0 ? 'text-functionalDanger' : 'text-functionalSuccess';

    let showStr = '';

    if (percent > 10000) {
      showStr = '>10000%';
    } else {
      showStr = `${num < 0 ? '-' : '+'}${percentStr}%`;
    }

    return <span className={textClassName}>{showStr}</span>;
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      fixed: 'left',
      width: isMobile ? 28 : 54,
      ellipsis: true,
      key: 'index',
      render: (text: string) => (
        <div className="flex items-center">
          <span className={clsx(styles['table-text'], 'font-semibold !text-[var(--table-header-text)]')}>{text}</span>
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
      width: isMobile ? 96 : 234,
      fixed: 'left',
      key: 'tokenName',
      render: (text: string, record: Item) => {
        return (
          <div className="flex items-center">
            <div className={clsx(isMobile ? 'mr-2' : 'mr-4')}>
              <ImageEnhance
                src={record.logoImage}
                className={clsx(
                  'shrink-0 object-cover ',
                  isMobile ? '!w-8 !h-8 !rounded-sm' : '!w-[52px] !h-[52px] !rounded-md ',
                )}
              />
            </div>
            <Text
              className=" !text-textPrimary"
              style={{ width: isMobile ? 52 : 142 }}
              ellipsis={{
                tooltip: text,
              }}>
              {text}
            </Text>
          </div>
        );
      },
    },
    {
      title: renderTitle('Volume', 'volumeTotal'),
      dataIndex: 'volumeTotal',
      key: 'volumeTotal',
      width: 144,
      render: (text: string) => {
        return (
          <Tooltip title={thousandsNumber(text)}>
            <span>{formatNumberEnhance(text)} ELF</span>
          </Tooltip>
        );
      },
    },
    {
      title: renderTitle('Volume Change', 'volumeTotalChange'),
      dataIndex: 'volumeTotalChange',
      key: 'volumeTotalChange',
      width: 154,
      render: renderNumberOfChange,
    },
    {
      title: renderTitle('Floor Price', 'floorPrice'),
      dataIndex: 'floorPrice',
      width: 134,
      key: 'floorPrice',
      render: (text: number, record: Item) => (
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
      title: renderTitle('Floor Change', 'floorChange'),
      dataIndex: 'floorChange',
      key: 'floorChange',
      width: 144,
      render: renderNumberOfChange,
    },
    {
      title: renderTitle('Sales', 'salesTotal'),
      dataIndex: 'salesTotal',
      key: 'salesTotal',
      width: 98,
      render: (text: number) => (
        <div className="flex items-center">
          <Tooltip title={thousandsNumber(text)}>
            <span className={clsx(styles['table-text'], 'font-medium')}>{formatNumberEnhance(text)}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: renderTitle('Items', 'itemTotal'),
      dataIndex: 'itemTotal',
      width: 93,
      key: 'itemTotal',
      render: (text: number) => (
        <div className="flex items-center">
          <Tooltip title={thousandsNumber(text)}>
            <span className={clsx(styles['table-text'], 'font-medium')}>{formatNumberEnhance(text)}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: renderTitle('Owners', 'ownerTotal'),
      dataIndex: 'ownerTotal',
      width: 93,
      key: 'ownerTotal',
      render: (text: number) => (
        <Tooltip title={thousandsNumber(text)}>
          <span className={clsx(styles['table-text'], 'font-medium')}>{formatNumberEnhance(text)}</span>
        </Tooltip>
      ),
    },
    {
      title: renderTitle('Total Supply', 'supplyTotal'),
      dataIndex: 'supplyTotal',
      key: 'supplyTotal',
      align: 'right',
      width: 132,
      render: (text: number) => (
        <div className="text-right">
          <Tooltip title={thousandsNumber(text)}>
            <span className={clsx(styles['table-text'], 'font-medium')}>{formatNumberEnhance(text)}</span>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (columnKeys?.length) {
    return columns.filter((column) => {
      return columnKeys.includes(column.dataIndex);
    }) as any as ColumnsType<Item>;
  }
  return columns as any as ColumnsType<Item>;
}
