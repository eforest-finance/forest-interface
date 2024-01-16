import { message, Switch } from 'antd';
import { PlusOutlined, DeleteFilled, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { messageHTML } from 'utils/aelfUtils';

import styles from './style.module.css';
import useGetState from 'store/state/getState';
import { useManagerAction } from 'components/WhiteList/hooks/useManagerAction';
import { store } from 'store/store';
import { setWhiteListInfo } from 'store/reducer/saleInfo/whiteListInfo';
import { useHandleAction } from 'components/WhiteList/hooks/useHandleAction';
import useDetailGetState from 'store/state/detailGetState';
import { IContractError } from 'contract/type';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';

export default function WhiteListPanel({
  visible,
  onCancel,
  chainId,
}: {
  visible?: boolean;
  onCancel?: () => void;
  chainId?: Chain;
}) {
  const {
    addWhiteList,
    addWhiteListBatch,
    removeWhiteList,
    removeWhiteListBatch,
    resetWhiteList,
    userLevelSetting,
    viewTheWhiteList,
  } = useHandleAction();
  const { infoState } = useGetState();
  const { whiteListInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;

  const { enableWhiteList, disableWhiteList } = useManagerAction();
  const [enableLoading, setEnableLoading] = useState(false);
  const [enable, setEnable] = useState<boolean>(false);

  const onWhitelistSwitch = async (checked: boolean) => {
    setEnableLoading(true);
    try {
      const res = await (enable ? disableWhiteList() : enableWhiteList());

      if (!res.error) {
        res?.TransactionId && messageHTML(res?.TransactionId, 'success', chainId);
        setEnable(checked);
        store.dispatch(
          setWhiteListInfo({
            whitelistInfo: {
              ...whiteListInfo.whitelistInfo,
              isAvailable: checked,
            },
          }),
        );
      } else {
        message.error(res.errorMessage?.message);
      }
    } catch (error) {
      const resError = error as IContractError;
      message.error(resError.errorMessage?.message);
    }
    setEnableLoading(false);
  };

  useEffect(() => {
    setEnable(whiteListInfo.whitelistInfo?.isAvailable || false);
  }, [whiteListInfo.whitelistInfo?.isAvailable]);

  return (
    <Modal
      onCancel={onCancel}
      footer={
        isSmallScreen && (
          <Button type="primary" onClick={() => resetWhiteList()}>
            Reset Whitelist
          </Button>
        )
      }
      className={`${styles['whitelist-panel-modal']} ${isSmallScreen && styles['whitelist-panel-modal-mobile']}`}
      open={visible}
      title="Whitelist">
      <div
        className={`${styles['enable-switch']} text-[18px] leading-[27px] ${isSmallScreen && 'flex justify-between'}`}>
        Whitelist
        <Switch
          checked={!!enable}
          loading={enableLoading}
          onClick={(checked, e) => {
            e.preventDefault();
            onWhitelistSwitch(checked);
          }}
        />
      </div>
      <div className={`${styles['action-button']} text-[16px] p-[16px] m-[24px]`} onClick={viewTheWhiteList}>
        <FileTextOutlined /> Whitelist details
      </div>
      <p className={`${styles.title} text-[18px] leading-[27px]`}>Whitelist management</p>
      <div
        className={`${styles['action-button']} text-[16px] p-[16px] ${isSmallScreen || 'm-[24px]'}`}
        onClick={() => userLevelSetting()}>
        <SettingOutlined /> Whitelist rank setting
      </div>
      <div className={`flex justify-between ${isSmallScreen ? 'm-[20px]' : 'm-[24px]'}`}>
        <div
          className={`${styles['action-button']} text-[16px] p-[16px] ${isSmallScreen ? 'flex-[246]' : 'flex-[603]'}`}
          onClick={addWhiteList}>
          <PlusOutlined /> Add addresses
        </div>
        <p
          className={`flex items-center justify-center ${styles['add-file']} ${
            isSmallScreen ? 'flex-[93]' : 'flex-[125]'
          }`}
          onClick={addWhiteListBatch}>
          Add csv file
        </p>
      </div>
      <div className={`flex justify-between ${isSmallScreen ? 'm-[20px]' : 'm-[24px]'}`}>
        <div
          className={`${styles['action-button']} text-[16px] p-[16px] ${isSmallScreen ? 'flex-[246]' : 'flex-[603]'}`}
          onClick={removeWhiteList}>
          <DeleteFilled />
          Delete addresses
        </div>
        <p
          className={`flex justify-center items-center ${styles['add-file']} ${
            isSmallScreen ? 'flex-[93]' : 'flex-[125]'
          }`}
          onClick={removeWhiteListBatch}>
          Add csv file
        </p>
      </div>
      {!isSmallScreen ? (
        <p className={styles['reset-word']} onClick={resetWhiteList}>
          <span className="cursor-pointer">Reset Whitelist</span>
        </p>
      ) : null}
    </Modal>
  );
}
