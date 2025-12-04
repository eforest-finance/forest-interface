import { message } from 'antd';
import { ADD_RM_TYPE, IModalWhiteListProps, MODAL_ACTION_TYPE } from 'store/reducer/saleInfo/type';
import { updateViewTheWhiteList } from 'store/reducer/saleInfo/whiteListInfo';
import useDetailGetState from 'store/state/detailGetState';
import { store } from 'store/store';

export const useHandleAction = () => {
  const { whiteListInfo: whiteListInfoStore } = useDetailGetState();
  const { whitelistInfo } = whiteListInfoStore;

  const openModal = (
    type: MODAL_ACTION_TYPE,
    modalState: IModalWhiteListProps = {
      open: true,
    },
    verify = true,
  ) => {
    if (verify && !whitelistInfo?.isAvailable) {
      message.error('Whitelist unavailable');
      return;
    }
    store.dispatch(
      updateViewTheWhiteList({
        type,
        modalState,
      }),
    );
  };

  return {
    addWhiteListBatch: () => {
      openModal(MODAL_ACTION_TYPE.ADD_WHITELIST, {
        open: true,
        title: 'Add address batch',
        addType: ADD_RM_TYPE.Batch,
      });
    },
    removeWhiteList: () => {
      openModal(MODAL_ACTION_TYPE.RM_WHITELIST, {
        open: true,
        title: 'Delete addresses',
        removeType: ADD_RM_TYPE.Alone,
      });
    },
    removeWhiteListBatch: () => {
      openModal(MODAL_ACTION_TYPE.RM_WHITELIST, {
        open: true,
        title: 'Delete address batch',
        removeType: ADD_RM_TYPE.Batch,
      });
    },
    addWhiteList: () => {
      openModal(MODAL_ACTION_TYPE.ADD_WHITELIST, {
        open: true,
        title: 'Add addresses',
        addType: ADD_RM_TYPE.Alone,
      });
    },
    userLevelSetting: () => {
      openModal(MODAL_ACTION_TYPE.USER_LEVEL_SETTING);
    },
    viewTheWhiteList: (verify = true) => {
      openModal(
        MODAL_ACTION_TYPE.VIEW_THE_WHITELIST,
        {
          open: true,
        },
        verify,
      );
    },
    resetWhiteList: () => {
      openModal(MODAL_ACTION_TYPE.RESET_WHITELIST);
    },
  };
};
