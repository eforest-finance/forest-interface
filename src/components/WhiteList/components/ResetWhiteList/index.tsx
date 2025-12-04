import { Button, message } from 'antd';
import { useCallback, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CommonModal from '../CommonModal';
import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import { resetWhitelistHandler } from 'components/WhiteList/hooks/managersAction';
import { store } from 'store/store';
import { hideModalAction, updateViewTheWhiteList } from 'store/reducer/saleInfo/whiteListInfo';
import { useHideModal } from 'components/WhiteList/hooks/useHideModal';

export default function ResetWhiteList() {
  const hideModal = useHideModal();
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { whiteListInfo: whiteListInfoStore, modalAction } = useDetailGetState();
  const { whitelistInfo, chainId } = whiteListInfoStore;

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const resetHandler = useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      if (!chainId) return message.error('Failed to recognise the current network that the logged-in account is on');
      if (!whitelistInfo?.whitelistHash || !whitelistInfo?.projectId) return message.error('Incorrect parameter');
      setConfirmLoading(true);
      await resetWhitelistHandler(
        {
          whitelistId: whitelistInfo?.whitelistHash || '',
          projectId: whitelistInfo?.projectId || '',
        },
        chainId,
      );
      modalAction.modalState?.onOk?.(e);
      store.dispatch(updateViewTheWhiteList(hideModalAction));
      setConfirmLoading(false);
    },
    [chainId, modalAction.modalState, whitelistInfo?.projectId, whitelistInfo?.whitelistHash],
  );
  return (
    <CommonModal
      className="reset-modal"
      closable
      {...modalAction.modalState}
      title={modalAction.modalState?.title || 'Reset Whitelist'}
      onCancel={(e) =>
        hideModal({
          callback: () => modalAction.modalState?.onCancel?.(e),
        })
      }>
      {modalAction.modalState?.children ? (
        modalAction.modalState?.children
      ) : (
        <>
          <p className="reset-tip-content text-[20px] font-medium text-[var(--color-primary)] text-center">
            Are you sure you want to reset the whitelist?
          </p>
          <div className="tip flex leading-[24px] gap-[16px]">
            <ExclamationCircleOutlined className="text-[24px] text-[#DD444D]" />
            <p className=" text-[16px] font-medium text-[#DD444D]">
              This action will erase all current information and cannot be undone.
            </p>
          </div>
        </>
      )}
      <div
        className={`form-button-wrapper flex items-center justify-center gap-[16px] ${
          isSmallScreen ? 'flex-row' : 'flex-row-reverse'
        }`}>
        <Button type="default" onClick={() => hideModal()}>
          Cancel
        </Button>
        <Button type="primary" className="warning" loading={confirmLoading} onClick={resetHandler}>
          Confirm
        </Button>
      </div>
    </CommonModal>
  );
}
