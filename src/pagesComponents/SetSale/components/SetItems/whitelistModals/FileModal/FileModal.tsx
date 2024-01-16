import { Button, Modal, Select, Upload } from 'antd';
import { parseCSV } from 'components/WhiteList/utils/parseCSV';
import { useCallback, useEffect, useMemo, useState } from 'react';
import UploadIcon from 'assets/images/saleInfo/upload.svg';
import { RankType } from '../../SetItems';
import AddressError from '../AddressError/AddressError';
import AddressMigrate from '../AddressMigrate/AddressMigrate';
import LimitModal from '../Limit/Limit';
import useGetState from 'store/state/getState';

import styles from './FileModal.module.css';
import { RcFile } from 'antd/lib/upload';
import { RepeatAddressType } from '../AddRankModal/AddRankModal';
import React from 'react';
import { decodeAddress } from 'utils/aelfUtils';
import { checkRepeat } from '../utils';
import { uniqBy } from 'lodash-es';
import { addPrefixSuffix } from 'utils';

function FileModal({
  visible,
  rank,
  onSave,
  onCancel,
  getContainer,
}: {
  visible?: boolean;
  rank?: RankType;
  onSave?: (rank: RankType) => void;
  onCancel?: () => void;
  getContainer?: () => HTMLElement;
}) {
  const [addressErrorModalVisible, setAddressErrorModalVisible] = useState(false);
  const [limitVisible, setLimitVisible] = useState(false);
  const [migrationVisible, setMigrationVisible] = useState(false);
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [rankName, setRankName] = useState<string>();
  const [addressList, setAddressList] = useState<string[]>([]);
  const UploadFormat = useMemo(() => (isSmallScreen ? Upload : Upload.Dragger), [isSmallScreen]);

  useEffect(() => {
    setRankName(undefined);
  }, [visible]);

  const tempAddresses = useMemo(
    () => Array.from(new Set(addressList.filter((item) => item !== '').concat(rank?.[rankName || '']?.address || []))),
    [addressList, rank, rankName],
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

  const amount = useMemo(
    () =>
      Object.values(tempRank)
        .map((item) => item.address?.length)
        .reduce((pre, val) => (pre || 0) + (val || 0)),
    [tempRank],
  );

  const repeatAddress: RepeatAddressType[] = useMemo(
    () =>
      addressList
        .filter((item) => item !== '')
        .flatMap((item) => {
          return checkRepeat({
            address: item,
            rankName,
            rank,
          });
        }),
    [addressList, rank, rankName],
  );

  const onAdd = useCallback(() => {
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
      setRankName(undefined);
      setAddressList([]);
    }
  }, [amount, onSave, repeatAddress.length, tempAddresses, tempRank]);

  const onReturn = () => {
    setRankName(undefined);
    setAddressList([]);
    onCancel?.();
  };

  const beforeUpload = useCallback(async (file: RcFile) => {
    const parseRes = await parseCSV({
      file,
    });
    const arr = uniqBy(parseRes as string[], (address) => {
      if (!address.includes('_')) {
        return addPrefixSuffix(address);
      }
      return address;
    });
    setAddressList(arr);
    return false;
  }, []);

  const onAddressMigrateConfirm = (rank: RankType) => {
    onSave?.(rank);
    setRankName(undefined);
    setAddressList([]);
    setMigrationVisible(false);
  };

  const onAddressErrorConfirm = (addresses: string[]) => {
    setAddressList(addresses);
    setAddressErrorModalVisible(false);
  };

  const onLimitModalConfirm = () => {
    setAddressList((v) => {
      const list = [...v];
      list.splice(addressList.length - Number(amount) + 100);
      return list;
    });
    setLimitVisible(false);
  };

  const getErrorAddresses = () => {
    return tempAddresses.filter((item) => !decodeAddress(item));
  };

  return (
    <>
      <Modal
        destroyOnClose
        open={visible}
        onCancel={onCancel}
        title="Mass add"
        className={`forest-marketplace ${styles['file-modal']} forest-sale-modal-footer ${
          isSmallScreen && 'forest-sale-modal-mobile forest-sale-modal-footer-mobile'
        }`}
        getContainer={getContainer}
        footer={
          <>
            <Button
              disabled={!rank || !rankName || !addressList.length}
              className="flex items-center justify-center"
              type="primary"
              onClick={onAdd}>
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
            onChange={(e) => setRankName(e)}
            className="w-full"
            placeholder="Rank name"
            getPopupContainer={(v) => v}>
            {Object.keys(rank as RankType)?.map((item) => (
              <Select.Option key={item}>{item}</Select.Option>
            ))}
          </Select>
        </div>
        <div className="upload">
          <p className="title">Upload</p>
          {visible ? (
            <UploadFormat maxCount={1} accept=".csv" beforeUpload={beforeUpload}>
              <div className="upload-window flex items-center justify-center flex-col font-medium text-[14px] leading-[21px]">
                <UploadIcon />
                <p>
                  {/* Drag files around, or <span className="text-[var(--color-brand)]">click</span> upload */}
                  {`Click "Upload" or drag files here`}
                </p>
              </div>
            </UploadFormat>
          ) : null}
        </div>
      </Modal>
      <LimitModal
        getContainer={getContainer}
        onConfirm={onLimitModalConfirm}
        onCancel={() => setLimitVisible(false)}
        count={addressList.length - Number(amount) + 100}
        visible={limitVisible}
      />
      <AddressMigrate
        visible={migrationVisible}
        getContainer={getContainer}
        dataSource={repeatAddress}
        rank={tempRank}
        targetRank={rankName}
        confirm={onAddressMigrateConfirm}
        cancel={() => setMigrationVisible(false)}
      />
      <AddressError
        visible={addressErrorModalVisible}
        getContainer={getContainer}
        addresses={addressList}
        errorAddresses={getErrorAddresses()}
        onCancel={() => setAddressErrorModalVisible(false)}
        onConfirm={onAddressErrorConfirm}
      />
    </>
  );
}

export default React.memo(FileModal);
