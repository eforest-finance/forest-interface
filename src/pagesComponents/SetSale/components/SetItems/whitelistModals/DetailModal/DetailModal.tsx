/* eslint-disable no-inline-styles/no-inline-styles */
import { Button, Input, Modal, Select, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DeleteFilled } from '@ant-design/icons';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { FixedType } from 'rc-table/lib/interface';
import useGetState from 'store/state/getState';

import styles from './DetailModal.module.css';
import { RankType } from '../../SetItems';
import { COM_PAGINATION_STYLE, COM_SCROLL_STYLE } from '../constants';
import { Key } from 'antd/lib/table/interface';
import React from 'react';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import { DANGEROUS_CHARACTERS_REG } from 'constants/common';

type DataSourceType = {
  key: string;
  rank: string;
  price: { symbol?: string | undefined; amount?: string | undefined } | undefined;
  address: string;
};

function DetailModal({
  visible,
  rank,
  onEdit,
  onDelete,
  onCancel,
  getContainer,
}: {
  visible?: boolean;
  rank?: RankType;
  onEdit?: (rankName: string, address: string) => void;
  onDelete?: (rank: RankType) => void;
  onCancel?: () => void;
  getContainer?: () => HTMLElement;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [filter, setFilter] = useState<{ type: string; value: string | undefined }>({ type: 'rank', value: undefined });
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterString, setFilterString] = useState<string | undefined>();
  const [showBatch, setBatch] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataSourceType[]>();
  const [searchDisabled, setSearchDisabled] = useState<boolean>(false);

  useEffect(() => {
    setFilter({ type: 'rank', value: undefined });
    setFilterType(undefined);
    setFilterString(undefined);
    setBatch(false);
  }, [visible]);

  const handleDelete = useCallback(
    (record: DataSourceType) => {
      const index = rank?.[record.rank].address?.findIndex((item) => item === record.address);
      if (typeof index === 'number') {
        const temp = { ...rank };
        temp?.[record.rank].address?.splice(index, 1);
        onDelete?.(temp);
      }
    },
    [onDelete, rank],
  );

  const column = useMemo(
    () => [
      {
        title: 'Rank',
        key: 'rank',
        width: isSmallScreen ? 100 : 160,
        dataIndex: 'rank',
        render: (rank: string) => (
          <p className="text-[var(--color-primary)] text-[16px] font-semibold leading-[24px]">{rank}</p>
        ),
      },
      {
        title: 'Price',
        key: 'price',
        width: isSmallScreen ? 144 : 202,
        dataIndex: 'price',
        render: (price: { symbol?: string; amount?: string }) => (
          <div className="flex items-center">
            <Logo src={ELF} className="w-[32px] h-[32px]" />
            <span className="text-[var(--color-primary)] text-[16px] font-semibold leading-[24px] ml-[4px]">
              {price?.amount}
            </span>
            <span className="text-[var(--color-secondary)] text-[16px] font-semibold leading-[24px] ml-[4px]">
              {price?.symbol?.toUpperCase()}
            </span>
          </div>
        ),
      },
      {
        title: 'Address',
        key: 'address',
        width: 214,
        dataIndex: 'address',
        render: (address: string) => (
          <p className="text-[var(--color-primary)] text-[16px] font-semibold leading-[24px]">
            {getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS)}
          </p>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 160,
        fixed: 'right' as FixedType,
        dataIndex: 'address',
        render: (address: string, record: DataSourceType) => (
          <div className="flex gap-[32px]">
            <p
              onClick={() => onEdit?.(record.rank, address)}
              className="text-[var(--brand-base)] text-[16px] font-semibold leading-[24px] cursor-pointer">
              Edit
            </p>
            <p
              className="text-[var(--brand-base)] text-[16px] font-semibold leading-[24px] cursor-pointer"
              onClick={() => handleDelete(record)}>
              Delete
            </p>
          </div>
        ),
      },
    ],
    [handleDelete, isSmallScreen, onEdit],
  );

  const dataSource = useMemo(() => {
    const list: {
      key: string;
      rank: string;
      price: { symbol?: string | undefined; amount?: string | undefined } | undefined;
      address: string;
    }[] = [];
    Object.keys(rank || {})
      .map((key) => {
        return rank?.[key]?.address?.map((item) => ({
          key: key + item + rank?.[key].price?.symbol + rank?.[key].price?.amount,
          rank: key,
          price: rank?.[key].price,
          address: item,
        }));
      })
      .forEach((arr) => arr?.map((item) => list.push(item)));
    if (filterString) {
      return list.filter((item) => {
        switch (filterType) {
          case 'rank':
            return item.rank.includes(filterString || '');
          case 'price':
            return item.price?.amount?.includes(filterString || '');
          case 'address':
            return item.address.includes(filterString || '');
        }
      });
    }
    return list;
  }, [filterType, filterString, rank]);

  const onSearchClick = () => {
    setFilterType(filter.type || '');
    setFilterString(filter.value || '');
  };

  const onDeleteClick = () => {
    selectedRows?.map((row) => handleDelete(row));
    setBatch(false);
  };

  const onCancelClick = () => {
    setSelectedRows(undefined);
    setBatch(false);
  };

  const getRowSelection = () => {
    if (showBatch) {
      return {
        selectedRowKeys: selectedRows?.map((row) => row.key),
        onChange(_: Key[], rows: DataSourceType[]) {
          setSelectedRows(rows);
        },
      };
    } else {
      return undefined;
    }
  };

  const onSearchInputChange = (value: string) => {
    if (DANGEROUS_CHARACTERS_REG.test(value)) {
      setFilter((v) => ({ ...v, value }));
    }
  };

  return (
    <Modal
      onCancel={() => {
        setBatch(false);
        onCancel?.();
      }}
      className={`forest-marketplace forest-sale-modal-footer ${styles['detail-modal']} ${
        isSmallScreen && 'forest-sale-modal-mobile forest-sale-modal-footer-mobile'
      }`}
      getContainer={getContainer}
      open={visible}
      width={'1000px'}
      title="Whitelist details"
      destroyOnClose
      footer={
        isSmallScreen ? (
          <Button className="w-full" onClick={onCancel}>
            Return
          </Button>
        ) : null
      }>
      <div className={`filter flex ${isSmallScreen && 'flex-col'}`}>
        <Select
          value={filter.type}
          onChange={(type) => setFilter((v) => ({ ...v, type }))}
          getPopupContainer={(v) => v}>
          <Select.Option key="rank">Rank</Select.Option>
          <Select.Option key="price">Price</Select.Option>
          <Select.Option key="address">Address</Select.Option>
        </Select>
        <Input
          placeholder={`Search ${filter.type}`}
          value={filter.value}
          max={80}
          onChange={(value) => onSearchInputChange(value.target.value)}
        />
        <Button disabled={searchDisabled} type="primary" onClick={onSearchClick}>
          Search
        </Button>
      </div>
      {dataSource.length ? (
        <div className="batch-action">
          {showBatch ? (
            <div className="flex justify-between action">
              <div className="flex items-center justify-center gap-[16px]">
                <p onClick={onDeleteClick}>Delete</p>
              </div>
              <Button onClick={onCancelClick}>Cancel</Button>
            </div>
          ) : (
            <div className="default-btn flex items-center justify-center" onClick={() => setBatch(true)}>
              <DeleteFilled />
              Mass delete
            </div>
          )}
        </div>
      ) : null}
      {dataSource.length ? (
        <Table
          className="forest-table"
          rowKey={(record) => record?.key}
          rowSelection={getRowSelection()}
          columns={column}
          dataSource={dataSource}
          scroll={{
            ...COM_SCROLL_STYLE,
            y: isSmallScreen ? '320px' : '255px',
          }}
          pagination={COM_PAGINATION_STYLE}
        />
      ) : (
        <p className="empty mt-[16px] w-full p-[24px] border border-solid border-[var(--line-box)] rounded-[12px] text-[16px] leading-[24px] font-medium">
          No results yet
        </p>
      )}
    </Modal>
  );
}

export default React.memo(DetailModal);
