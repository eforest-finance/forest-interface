import { hideModalAction, updateViewTheWhiteList } from 'store/reducer/saleInfo/whiteListInfo';
import { store } from 'store/store';

export const useHideModal = () => {
  const hideModal = (params?: { callback?: () => void }) => {
    store.dispatch(updateViewTheWhiteList(hideModalAction));
    params?.callback?.();
  };

  return hideModal;
};
