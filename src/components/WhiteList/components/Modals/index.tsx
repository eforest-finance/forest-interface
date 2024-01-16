import dynamic from 'next/dynamic';
import { IModalAction, MODAL_ACTION_TYPE } from 'store/reducer/saleInfo/type';
import useDetailGetState from 'store/state/detailGetState';
const AddWhiteList = dynamic(() => import('../AddWhiteList'));
const RemoveWhiteList = dynamic(() => import('../RemoveWhiteList'));
const ResetWhiteList = dynamic(() => import('../ResetWhiteList'));
const UserLevelSetting = dynamic(() => import('../UserLevelSetting'));
const ViewTheWhiteList = dynamic(() => import('../ViewTheWhiteList'));

export default function Modals({ modalAction }: { modalAction: IModalAction }) {
  const { whiteListInfo } = useDetailGetState();

  const whiteListModals = {
    [MODAL_ACTION_TYPE.HIDE]: null,
    [MODAL_ACTION_TYPE.ADD_WHITELIST]: <AddWhiteList />,
    [MODAL_ACTION_TYPE.RM_WHITELIST]: <RemoveWhiteList />,
    [MODAL_ACTION_TYPE.RESET_WHITELIST]: <ResetWhiteList />,
    [MODAL_ACTION_TYPE.USER_LEVEL_SETTING]: <UserLevelSetting />,
    [MODAL_ACTION_TYPE.VIEW_THE_WHITELIST]: <ViewTheWhiteList />,
  };

  return whiteListInfo?.whitelistInfo?.isAvailable ? <>{whiteListModals[modalAction.type]}</> : null;
}
