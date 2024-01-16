import { Button, Input, Modal, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RankType } from '../SetItems';
import AddressError from './AddressError/AddressError';
import AddressMigrate from './AddressMigrate/AddressMigrate';
import LimitModal from './Limit/Limit';

import useGetState from 'store/state/getState';
import React from 'react';
import { decodeAddress } from 'utils/aelfUtils';
import { RepeatAddressType } from './AddRankModal/AddRankModal';
import { checkRepeat } from './utils';
import { MAX_ADDRESS_ERROR } from 'constants/errorMessage';

function AddressModal({
  visible,
  onSave,
  onCancel,
  getContainer,
  rank,
}: {
  visible?: boolean;
  onSave?: (rank: RankType) => void;
  onCancel?: () => void;
  getContainer?: () => HTMLElement;
  rank?: RankType;
}) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [limitVisible, setLimitVisible] = useState(false);
  const [addressErrorModalVisible, setAddressErrorModalVisible] = useState(false);
  const [migrationVisible, setMigrationVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [rankName, setRank] = useState<string | undefined>();

  const tempAddresses = useMemo(
    () =>
      Array.from(
        new Set(
          address
            .split(',')
            .filter((item) => item !== '')
            .concat(rank?.[rankName || '']?.address || []),
        ),
      ),
    [address, rank, rankName],
  );
  const tempRank = useMemo(
    () => ({
      ...rank,
      [rankName || '']: {
        ...rank?.[rankName || ''],
        address: tempAddresses,
      },
    }),
    [rank, rankName, tempAddresses],
  );

  const repeatAddress: RepeatAddressType[] = useMemo(
    () =>
      address
        .split(',')
        .filter((item) => item !== '')
        .flatMap((item) =>
          checkRepeat({
            address: item,
            rankName,
            rank,
          }),
        ),
    [address, rank, rankName],
  );

  const amount = useMemo(
    () =>
      Object.values(tempRank)
        .map((item) => item.address?.length)
        .reduce((pre, val) => (pre || 0) + (val || 0)),
    [tempRank],
  );

  const onAdd = useCallback(() => {
    console.log('tempAddresses', tempAddresses);
    console.log(tempAddresses.map((item) => decodeAddress(item)));
    if (tempAddresses.filter((item) => !decodeAddress(item)).length) {
      return setAddressErrorModalVisible(true);
    }
    if ((amount || 0) > 100) {
      return setLimitVisible(true);
    }
    if (repeatAddress.length > 0) {
      setMigrationVisible(true);
    } else {
      onSave?.(tempRank);
    }
  }, [amount, onSave, repeatAddress.length, tempAddresses, tempRank]);

  useEffect(() => {
    setAddress('');
    setRank('');
  }, [visible]);
  return (
    <>
      <AddressMigrate
        visible={migrationVisible}
        getContainer={getContainer}
        dataSource={repeatAddress}
        rank={tempRank}
        targetRank={rankName}
        confirm={(rank: RankType) => {
          onSave?.(rank);
          setMigrationVisible(false);
        }}
        cancel={() => setMigrationVisible(false)}
      />
      <AddressError
        visible={addressErrorModalVisible}
        getContainer={getContainer}
        addresses={address.split(',')}
        errorAddresses={tempAddresses.filter((item) => !decodeAddress(item))}
        onCancel={() => {
          setAddressErrorModalVisible(false);
        }}
        onConfirm={(addresses) => {
          setAddress(addresses.join(','));
          setAddressErrorModalVisible(false);
        }}
      />
      <LimitModal
        getContainer={getContainer}
        onConfirm={() => {
          setAddress((v) => {
            const list = v.split(',').filter((item) => item !== '');
            list.splice(list.length - Number(amount) + 100);
            return list.join(',');
          });
          setLimitVisible(false);
        }}
        onCancel={() => {
          setLimitVisible(false);
        }}
        count={address.split(',').filter((item) => item !== '').length - Number(amount) + 100}
        visible={limitVisible}
      />
      <Modal
        className={`forest-marketplace forest-sale-warning-modal forest-sale-modal-footer ${
          isSmallScreen && `forest-sale-modal-mobile forest-sale-modal-footer-mobile`
        }`}
        onCancel={() => {
          setRank(undefined);
          onCancel?.();
        }}
        getContainer={getContainer}
        open={visible}
        title="Add addresses"
        footer={
          <>
            <Button
              disabled={!rankName || !address}
              className="flex justify-center items-center"
              type="primary"
              onClick={onAdd}>
              Save
            </Button>
            <Button
              className="flex justify-center items-center"
              onClick={() => {
                setRank(undefined);
                onCancel?.();
              }}>
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
        <div className="mt-[40px]">
          <p className="title">Wallet address</p>
          <Input.TextArea
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className="resize-none h-[120px]"
            placeholder={MAX_ADDRESS_ERROR}
          />
        </div>
      </Modal>
    </>
  );
}

export default React.memo(AddressModal);
