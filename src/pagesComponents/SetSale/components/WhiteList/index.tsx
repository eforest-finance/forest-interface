import React, { useCallback, useMemo, useState } from 'react';
import styles from './index.module.css';
import useGetState from 'store/state/getState';
import { Switch } from 'antd';
import { PlusOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import AddRankModal from '../SetItems/whitelistModals/AddRankModal/AddRankModal';
import DetailModal from '../SetItems/whitelistModals/DetailModal/DetailModal';
import SettingModal from '../SetItems/whitelistModals/SettingModal/SettingModal';
import AddressModal from '../SetItems/whitelistModals/AddRankModal/AddRankModal';
import DeleteConfirm from '../SetItems/whitelistModals/DeleteConfirm';
import EditModal from '../SetItems/whitelistModals/EditModal/EditModal';
import FileModal from '../SetItems/whitelistModals/FileModal/FileModal';
import LimitModal from '../SetItems/whitelistModals/Limit/Limit';
import { RankType } from '../SetItems/SetItems';

enum DeleteType {
  ADDRESS = 'address',
  RANK = 'rank',
}

enum AddType {
  WhitelistRank,
  Addresses,
  CsvFile,
}

interface IProps {
  rank: RankType;
  tagInfo: RankType | undefined;
}

function WhiteList({ rank: initRank, tagInfo }: IProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const [enableWhiteList, setEnableWhiteList] = useState(false);
  const [rank, setRank] = useState<RankType>(initRank);
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmType, setConfirmModalType] = useState<DeleteType>(DeleteType.ADDRESS);
  const [confirmRank, setConfirmRank] = useState<RankType>();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAddress, setEditAddress] = useState<string>('');

  const addressCount = useMemo(() => {
    const addressList = Object.values(rank)?.map((item) => item.address?.length || 0);
    if (addressList.length > 0) {
      const count = addressList?.reduce((pre, val) => pre + val);
      return count;
    } else {
      return 0;
    }
  }, [rank]);

  const onAddClick = (type: AddType) => {
    if (addressCount >= 100) {
      setLimitModalVisible(true);
    } else {
      switch (type) {
        case AddType.WhitelistRank:
          return setAddModalVisible(true);
        case AddType.Addresses:
          return setAddressModalVisible(true);
        case AddType.CsvFile:
          return setFileModalVisible(true);
      }
    }
  };

  const onEdit = useCallback((_: string, address: string) => {
    setEditAddress(address);
    setDetailModalVisible(false);
    setEditModalVisible(true);
  }, []);

  const onDelete = (rank: RankType, type: DeleteType) => {
    setConfirmRank(rank);
    setConfirmModalType(type);
    setConfirmModalVisible(true);
  };

  const onConfirmDelete = useCallback(() => {
    setConfirmModalVisible(false);
    if (!confirmRank) return;
    setRank(confirmRank);
  }, [confirmRank]);

  const onFileModalSave = (rank: RankType) => {
    setRank(rank);
    setFileModalVisible(false);
  };

  const Modals = () => {
    const container = () => document.querySelector('.set-items-wrapper') as HTMLElement;
    return (
      <>
        <AddRankModal
          visible={addModalVisible}
          rank={rank}
          onSave={(rank) => {
            setRank(rank);
            setAddModalVisible(false);
          }}
          onCancel={() => setAddModalVisible(false)}
          getContainer={container}
        />
        <DetailModal
          visible={detailModalVisible}
          rank={rank}
          onEdit={onEdit}
          onDelete={(rank) => onDelete(rank, DeleteType.ADDRESS)}
          onCancel={() => setDetailModalVisible(false)}
          getContainer={container}
        />
        <SettingModal
          visible={settingModalVisible}
          rank={rank}
          existRank={tagInfo}
          onAddRank={() => {
            if (addressCount >= 100) {
              setLimitModalVisible(true);
            } else {
              setAddModalVisible(true);
            }
          }}
          onCancel={() => setSettingModalVisible(false)}
          onDelete={(rank) => onDelete(rank, DeleteType.RANK)}
          getContainer={container}
        />
        <AddressModal
          onSave={(rank) => {
            setAddressModalVisible(false);
            setRank(rank);
          }}
          onCancel={() => setAddressModalVisible(false)}
          visible={addressModalVisible}
          rank={rank}
          getContainer={container}
        />
        <EditModal
          onSave={(rank) => {
            setEditModalVisible(false);
            setDetailModalVisible(true);
            setRank(rank);
          }}
          onCancel={() => {
            setEditModalVisible(false);
            setDetailModalVisible(true);
            setEditAddress('');
          }}
          visible={editModalVisible}
          rank={rank}
          getContainer={container}
          address={editAddress}
        />
        <DeleteConfirm
          visible={confirmModalVisible}
          getContainer={container}
          onDelete={onConfirmDelete}
          type={confirmType}
          onCancel={() => {
            setConfirmRank(undefined);
            setConfirmModalVisible(false);
          }}
        />
        <FileModal
          onSave={onFileModalSave}
          onCancel={() => setFileModalVisible(false)}
          visible={fileModalVisible}
          rank={rank}
          getContainer={container}
        />
        <LimitModal visible={limitModalVisible} onCancel={() => setLimitModalVisible(false)} getContainer={container} />
      </>
    );
  };

  return (
    <div className={`${styles['white-list']} ${isSmallScreen && styles['white-list-mobile']}} mt-[40px]`}>
      {Modals()}
      <div className={`${styles['row-title']} flex justify-between`}>
        <span className="font-medium">Whitelist</span>
        <Switch checked={enableWhiteList} onChange={(checked) => setEnableWhiteList(checked)} />
      </div>
      {enableWhiteList && (
        <div
          className={`${styles['add-list-btn']} flex items-center justify-center`}
          onClick={() => onAddClick(AddType.WhitelistRank)}>
          <PlusOutlined />
          Add Whitelist rank
        </div>
      )}
      {enableWhiteList && !!Object.keys(rank).length && (
        <div className={styles['white-list-wrap']}>
          <div className="flex justify-between">
            <div
              className={`${styles.detail} flex flex-col items-center justify-center`}
              onClick={() => setDetailModalVisible(true)}>
              <FileTextOutlined />
              Whitelist{isSmallScreen ? <br /> : ' '}details
            </div>
            <div
              className={`${styles.setting} flex flex-col items-center justify-center`}
              onClick={() => setSettingModalVisible(true)}>
              <SettingOutlined />
              Whitelist rank setting
            </div>
          </div>
          <div className={`${styles['add-address-wrap']} flex justify-between`}>
            <div
              className={`${styles['add-address-btn']} flex items-center justify-center flex-1 mr-[8px]`}
              onClick={() => onAddClick(AddType.Addresses)}>
              <PlusOutlined />
              Add addresses
            </div>
            <p className={styles['add-file']} onClick={() => onAddClick(AddType.CsvFile)}>
              Add csv file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(WhiteList);
