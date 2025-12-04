import { Button } from 'antd';
import CommonModal from '../CommonModal';
import RemoveByUpdate from '../RemoveByUpdate';
import RemoveTable from '../RemoveTable';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { ADD_RM_TYPE } from 'store/reducer/saleInfo/type';
import { useHideModal } from 'components/WhiteList/hooks/useHideModal';

export default function RemoveWhiteList() {
  const hideModal = useHideModal();
  const { infoState } = useGetState();
  const { modalAction, whiteListInfo: whiteListInfoStore } = useDetailGetState();
  const { whitelistId, whitelistInfo } = whiteListInfoStore;
  const { leftCallBack, onCancel, removeType } = modalAction.modalState || {};
  const { isSmallScreen } = infoState;

  return (
    <CommonModal
      closable={false}
      {...modalAction.modalState}
      className="!top-0"
      leftCallBack={() =>
        hideModal({
          callback: () => leftCallBack?.(),
        })
      }
      footer={
        isSmallScreen &&
        removeType === ADD_RM_TYPE.Alone && (
          <>
            <Button type="default" onClick={() => hideModal()}>
              Return
            </Button>
          </>
        )
      }
      onCancel={(e) =>
        hideModal({
          callback: () => onCancel?.(e),
        })
      }>
      {removeType === ADD_RM_TYPE.Alone ? (
        <RemoveTable />
      ) : (
        <RemoveByUpdate
          whitelistId={whitelistId}
          policyType={whitelistInfo?.strategyType}
          draggerProps={modalAction.modalState?.draggerProps}
        />
      )}
    </CommonModal>
  );
}
