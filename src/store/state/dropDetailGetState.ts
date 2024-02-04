import { useSelector } from 'react-redux';
import { getDropDetailInfo, getDropQuota } from 'store/reducer/dropDetail/dropDetailInfo';

const useDropDetailGetState = () => {
  const dropDetailInfo = useSelector(getDropDetailInfo);
  const dropQuota = useSelector(getDropQuota);
  return {
    dropDetailInfo,
    dropQuota,
  };
};

export default useDropDetailGetState;
