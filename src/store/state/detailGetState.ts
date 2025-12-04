import { useSelector } from 'react-redux';
import { getDetailInfo } from '../reducer/detail/detailInfo';
import { getModalAction, getWhiteListInfo } from 'store/reducer/saleInfo/whiteListInfo';

const useDetailGetState = () => {
  const detailInfo = useSelector(getDetailInfo);
  const whiteListInfo = useSelector(getWhiteListInfo);
  const modalAction = useSelector(getModalAction);
  return {
    detailInfo,
    whiteListInfo,
    modalAction,
  };
};

export default useDetailGetState;
