import { Button, Input, Modal, Table } from 'antd';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { FixedType } from 'rc-table/lib/interface';
import { AddressType, PriceType, RankType } from '../../SetItems';
import useGetState from 'store/state/getState';
import { useMeasure } from 'react-use';
import styles from './SettingModal.module.css';
import { ColumnsType, TableRowSelection } from 'antd/lib/table/interface';
import { COM_PAGINATION_STYLE, COM_SCROLL_STYLE } from '../constants';
import BigNumber from 'bignumber.js';
import { AMOUNT_LENGTH } from 'constants/common';

type dataSourceType = {
  rankName: string;
  price?: PriceType;
  address?: AddressType;
};

export default function SettingModal({
  visible,
  rank,
  existRank,
  getContainer,
  onAddRank,
  onCancel,
  onDelete,
}: {
  visible?: boolean;
  rank?: RankType;
  existRank?: RankType;
  getContainer?: () => HTMLElement;
  onAddRank?: () => void;
  onCancel?: () => void;
  onDelete?: (rank: RankType) => void;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [showBatch, setBatch] = useState(false);
  const [selectedRows, setSelectedRows] = useState<dataSourceType[]>();
  const [min, setMin] = useState<string | undefined>();
  const [max, setMax] = useState<string | undefined>();
  const [filter, setFilter] = useState<(string | undefined)[]>([undefined, undefined]);

  const [ref, { height }] = useMeasure<HTMLDivElement>();

  const onActionDelete = (rankName: string, record: dataSourceType) => {
    return Object.keys(existRank || {})?.includes(rankName) || rank?.[rankName].address?.length
      ? undefined
      : () => handleDelete([record]);
  };

  const handleDelete = useCallback(
    (keys: { rankName: string | number }[]) => {
      const temp = { ...rank };
      keys.map((key: { rankName: string | number }) => {
        delete temp[key.rankName];
      });
      onDelete?.(temp);
    },
    [onDelete, rank],
  );

  const columns: ColumnsType<dataSourceType> = useMemo(
    () => [
      {
        title: 'Rank',
        dataIndex: 'rankName',
        key: 'rank',
        width: isSmallScreen ? 100 : 280,
        render: (rank: string) => <p className="text-[var(--color-primary)] text-[16px] font-semibold">{rank}</p>,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: isSmallScreen ? 140 : 296,
        render: (price: { symbol?: string; amount?: string }) => (
          <div className="flex items-center">
            <Logo src={ELF} className="w-[32px] h-[32px]" />
            <span className="text-[var(--color-primary)] text-[16px] font-semibold lint-24 ml-[4px]">
              {price?.amount}
            </span>
            <span className="text-[var(--color-secondary)] text-[16px] font-semibold leading-[24px] ml-[4px]">
              {price?.symbol?.toUpperCase()}
            </span>
          </div>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        fixed: isSmallScreen ? ('right' as FixedType) : false,
        width: isSmallScreen ? 112 : 160,
        align: 'right',
        dataIndex: 'rankName',
        render: (rankName: string, record: dataSourceType) => (
          <p
            className={`text-[16px] font-semibold text-right lint-24 ${
              Object.keys(existRank || {})?.includes(rankName) || rank?.[rankName].address?.length
                ? 'text-[var(--color-disable)]'
                : 'text-[var(--brand-base)]'
            }`}
            onClick={onActionDelete(rankName, record)}>
            <span
              className={`${
                Object.keys(existRank || {}).includes(rankName) ? ' cursor-not-allowed' : 'cursor-pointer'
              }`}>
              Delete{Object.keys(existRank || {})?.includes(rankName)}
            </span>
          </p>
        ),
      },
    ],
    [existRank, isSmallScreen, rank],
  );

  const dataSource: dataSourceType[] = useMemo(() => {
    return Object.keys(rank || {}).map((key) => ({
      rankName: key,
      price: rank?.[key]?.price,
      address: rank?.[key].address,
    }));
  }, [rank]);

  const onMinChange = (value: string, type: 'min' | 'max') => {
    const pivot = new BigNumber(value);
    if ((pivot.e || 0) > AMOUNT_LENGTH - 1) return value.slice(0, AMOUNT_LENGTH);
    const [, dec] = value.split('.');
    const decimals = 2;
    let val: string | undefined = undefined;
    if (pivot.gte(0)) {
      val = (dec?.length || 0) >= +decimals ? pivot.toFixed(+decimals, BigNumber.ROUND_DOWN) : value;
    }
    switch (type) {
      case 'min':
        return setMin(val);
      case 'max':
        return setMax(val);
    }
  };

  const onAddRankClick = () => {
    onAddRank?.();
    onCancel?.();
  };

  const onDeleteClick = () => {
    if (selectedRows?.length) {
      handleDelete(selectedRows);
      setBatch(false);
      setSelectedRows(undefined);
    }
  };

  const onCancelClick = () => {
    setSelectedRows(undefined);
    setBatch(false);
  };

  const rowSelection: TableRowSelection<dataSourceType> | undefined = useMemo(() => {
    if (showBatch) {
      return {
        selectedRowKeys: selectedRows?.map((row) => row.rankName),
        onChange(_keys, rows) {
          setSelectedRows(
            rows.filter((item) => !Object.keys(existRank || {}).includes(item.rankName) && !item?.address?.length),
          );
        },
        renderCell: (_checked, record, _index, originNode) => {
          if (record.address?.length) {
            return null;
          }
          if (Object.keys(existRank || {})?.includes(record.rankName)) {
            return null;
          }
          return originNode;
        },
      };
    }
    return undefined;
  }, [existRank, selectedRows, showBatch]);

  useEffect(() => {
    setFilter([undefined, undefined]);
    setMax(undefined);
    setMin(undefined);
    setSelectedRows(undefined);
    setBatch(false);
  }, [visible]);

  const filterDataSource = useMemo(
    () =>
      dataSource.filter((item) => {
        const amountToNumber = new BigNumber(item.price?.amount || '0');
        if (filter[0] !== undefined && filter[1] !== undefined) {
          const filter0 = new BigNumber(filter[0]);
          const filter1 = new BigNumber(filter[1]);
          return amountToNumber.comparedTo(filter1) !== 1 && amountToNumber.comparedTo(filter0) !== -1;
        }
        return item;
      }),
    [dataSource, filter],
  );

  const searchDisabled: boolean = useMemo(() => {
    const bigMin = new BigNumber(min || 0);
    const bigMax = new BigNumber(max || 0);
    return Boolean(min && max && bigMin.comparedTo(bigMax) === 1);
  }, [max, min]);

  return (
    <Modal
      className={`forest-marketplace forest-sale-modal-footer ${styles['setting-modal']} ${
        isSmallScreen && `forest-sale-modal-mobile forest-sale-modal-footer-mobile`
      }`}
      open={visible}
      title="Whitelist rank setting"
      onCancel={onCancel}
      destroyOnClose
      footer={
        isSmallScreen ? (
          <Button className="w-full" onClick={onCancel}>
            Return
          </Button>
        ) : null
      }
      getContainer={getContainer}>
      <div ref={ref}>
        <div className={`setting-filter flex justify-between ${isSmallScreen && 'flex-col'}`}>
          <p className="text-[18px] leading-[27px] font-medium w-full text-left">Price range</p>
          <div className={`flex ${isSmallScreen ? 'flex-col gap-[24px] w-[100%]' : 'gap-[16px]'}`}>
            <div className="flex items-center w-[100%] gap-[10px]">
              <Input placeholder="Min" value={min} type="number" onChange={(e) => onMinChange(e.target.value, 'min')} />
              <span className="border border-solid border-[var(--line-box)] block min-w-[16px]" />
              <Input placeholder="Max" value={max} type="number" onChange={(e) => onMinChange(e.target.value, 'max')} />
            </div>
            <Button disabled={searchDisabled} type="primary" onClick={() => setFilter([min, max])}>
              Search
            </Button>
          </div>
        </div>
        <div className={`batch-action setting-batch flex ${isSmallScreen ? ' gap-x-0 gap-y-[40px]' : 'gap-[40px]'}`}>
          <div className="add-rank-btn" onClick={onAddRankClick}>
            <PlusOutlined className="mr-[-10px]" />
            Add Rank
          </div>
          {showBatch ? (
            <div className="flex justify-between action flex-1 !my-0 ml-[10px]">
              <div className="flex items-center justify-center gap-[16px]">
                <p onClick={onDeleteClick}>Delete</p>
              </div>
              {!isSmallScreen ? <Button onClick={onCancelClick}>Cancel</Button> : null}
            </div>
          ) : (
            <div className="default-btn flex justify-center items-center ml-[10px]" onClick={() => setBatch(true)}>
              <DeleteFilled className="mr-[-10px]" />
              Mass delete
            </div>
          )}
        </div>
        {isSmallScreen && showBatch && (
          <Button className="w-fit mb-[32px]" onClick={onCancelClick}>
            Cancel
          </Button>
        )}
      </div>
      {filterDataSource.length ? (
        <div style={{ height: `calc(100% - ${height}px - 80px)` }} className="overflow-y-auto">
          <Table
            className={`forest-table ${styles['forest-table-setting-modal']}`}
            rowSelection={rowSelection}
            rowKey={(record) => record.rankName}
            columns={columns}
            dataSource={filterDataSource}
            scroll={{
              ...COM_SCROLL_STYLE,
              y: isSmallScreen ? `100%` : '255px',
            }}
            pagination={COM_PAGINATION_STYLE}
          />
        </div>
      ) : (
        <p className="empty w-full p-[24px] border border-solid border-[var(--line-box)] rounded-[12px] text-[16px] leading-[24px] font-medium">
          No results yet
        </p>
      )}
    </Modal>
  );
}
