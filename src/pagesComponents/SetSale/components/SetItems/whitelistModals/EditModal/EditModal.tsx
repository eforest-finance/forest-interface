import { Button, Input, Modal, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { RankType } from '../../SetItems';

import styles from './EditModal.module.css';
import useGetState from 'store/state/getState';
import React from 'react';

function EditModal({
  visible,
  onSave,
  onCancel,
  getContainer,
  address,
  rank,
}: {
  visible?: boolean;
  onSave?: (rank: RankType) => void;
  onCancel?: () => void;
  getContainer?: () => HTMLElement;
  address: string;
  rank?: RankType;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [rankName, setRank] = useState<string | null>();
  const rankWithoutCurrent = useMemo(() => {
    const keys = Object.keys(rank as RankType);
    const temp: RankType = {};
    keys.forEach((key) => {
      const targetIndex = rank?.[key].address?.findIndex((item) => item === address) ?? -1;
      if (targetIndex >= 0) {
        temp[key] = { price: (rank as RankType)[key].price, address: [...((rank as RankType)[key].address || [])] };
        temp[key].address?.splice(targetIndex, 1);
      }
    });
    return {
      ...rank,
      ...temp,
    };
  }, [address, rank]);
  const tempRank = useMemo(
    () => ({
      ...rankWithoutCurrent,
      [rankName || '']: {
        ...rank?.[rankName || ''],
        address: Array.from(new Set([...(rank?.[rankName || '']?.address || []), address])),
      },
    }),
    [address, rank, rankName, rankWithoutCurrent],
  );
  useEffect(() => setRank(''), [visible]);

  const onReturn = () => {
    setRank(null);
    onCancel?.();
  };

  return (
    <Modal
      className={`forest-marketplace ${styles['edit-address-modal']} forest-sale-modal-footer ${
        isSmallScreen && 'forest-sale-modal-mobile forest-sale-modal-footer-mobile'
      }`}
      onCancel={onReturn}
      getContainer={getContainer}
      open={visible}
      title="Edit"
      footer={
        <>
          <Button
            disabled={!rankName || !address}
            className="flex items-center justify-center"
            type="primary"
            onClick={() => onSave?.(tempRank)}>
            Save
          </Button>
          <Button className="flex items-center justify-center" onClick={onReturn}>
            Return
          </Button>
        </>
      }>
      <div className="filter">
        <p className="title">Whitelist rank name</p>
        <Select
          value={rankName}
          onChange={(e) => setRank(e)}
          className="w-full"
          placeholder="Rank name"
          getPopupContainer={(v) => v}>
          {Object.keys(rank as RankType)?.map((item) => (
            <Select.Option key={item}>{item}</Select.Option>
          ))}
        </Select>
      </div>
      <div className="address mt-[24px]">
        <p className="title">Wallet address</p>
        <Input.TextArea disabled value={address} className="resize-none h-[120px]" />
      </div>
    </Modal>
  );
}

export default React.memo(EditModal);
