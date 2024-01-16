import { Button, Modal, Table } from 'antd';
import WarningMark from 'assets/images/waring.svg';
import { useMemo, useState } from 'react';
import { RankType } from '../../SetItems';

import styles from './AddressMigrate.module.css';
import useGetState from 'store/state/getState';
import { RepeatAddressType } from '../AddRankModal/AddRankModal';
import { ColumnsType, Key, TableRowSelection } from 'antd/lib/table/interface';
import React from 'react';
import { OmittedType, getOmittedStr } from 'utils';

function AddressMigrate({
  getContainer,
  confirm,
  cancel,
  visible,
  targetRank,
  rank,
  dataSource = [],
}: {
  getContainer?: () => HTMLElement;
  confirm?: (rank: RankType) => void;
  cancel?: () => void;
  visible?: boolean;
  targetRank?: string;
  rank?: RankType;
  dataSource?: RepeatAddressType[];
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const isSingle = useMemo(() => dataSource?.length === 1, [dataSource?.length]);
  const [list, setList] = useState<RepeatAddressType[]>();
  const columns: ColumnsType<RepeatAddressType> = useMemo(
    () => [
      {
        title: 'Address',
        dataIndex: 'address',
        width: isSmallScreen ? (isSingle ? 253 : 153) : isSingle ? 420 : 270,
        render: (address: string) => (
          <p className="text-[var(--color-primary)] font-semibold text-[16px]">
            {getOmittedStr(address, OmittedType.ADDRESS)}
          </p>
        ),
      },
      {
        title: 'Rank',
        dataIndex: 'rank',
        width: isSmallScreen ? 85 : 100,
        render: (rank: string) => <p className="text-[var(--color-primary)] font-semibold text-[16px]">{rank}</p>,
      },
    ],
    [isSmallScreen, isSingle],
  );
  const onConfirm = () => {
    if (isSingle) {
      const target =
        (rank as RankType)[dataSource[0]?.rank].address?.findIndex((i) => i === dataSource[0].address) ?? -1;
      (rank as RankType)[dataSource[0].rank].address?.splice(target, 1);
    } else {
      dataSource
        .filter((item) => !list?.find((i) => i.address === item.address))
        .forEach((item) => {
          const target = rank?.[targetRank as string]?.address?.findIndex((i) => i === item.address) ?? -1;
          (rank as RankType)[targetRank as string].address?.splice(target, 1);
        });
      list?.forEach((item) => {
        const target = (rank as RankType)[item.rank].address?.findIndex((i) => i === item.address) ?? -1;
        (rank as RankType)[item.rank].address?.splice(target, 1);
      });
    }
    confirm?.(rank as RankType);
    setList(undefined);
  };

  const getRowSelection: () => TableRowSelection<RepeatAddressType> | undefined = () => {
    if (!isSingle) {
      return {
        type: 'checkbox',
        selectedRowKeys: list?.map((item) => item && item.address),
        onChange: (_: Key[], rows: RepeatAddressType[]) => {
          setList(rows);
        },
      };
    } else {
      return undefined;
    }
  };

  return (
    <Modal
      zIndex={1000000}
      title="Add failed"
      closable={false}
      className={`forest-marketplace ${styles['migration-modal']} forest-sale-warning-modal forest-sale-modal-footer ${
        isSmallScreen && 'forest-sale-modal-mobile forest-sale-modal-footer-mobile'
      }`}
      getContainer={getContainer}
      open={visible}
      footer={
        <>
          <Button type="primary" onClick={onConfirm}>
            Confirm
          </Button>
          <Button className="text-[16px]" onClick={cancel}>
            Cancel
          </Button>
        </>
      }>
      <p className="text-[16px] font-medium leading-[24px] flex items-center justify-center tip">
        <WarningMark /> The addresses below have been already added to other ranks.
      </p>
      <Table
        className="forest-table"
        columns={columns}
        rowSelection={getRowSelection()}
        scroll={{ x: undefined, y: 276 }}
        dataSource={dataSource}
        pagination={{ hideOnSinglePage: true }}
        rowKey={(record: RepeatAddressType) => record.address}
      />
      <p className="confirm text-[var(--secondary)] font-medium text-[16px]">Do you want to move them to this rank?</p>
    </Modal>
  );
}

export default React.memo(AddressMigrate);
