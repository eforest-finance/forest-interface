import { useSelector } from 'react-redux';
import { getPreviewInfo } from 'store/reducer/saleInfo/saleInfo';

const useSaleInfoGetState = () => {
  const previewInfo = useSelector(getPreviewInfo);
  return {
    previewInfo,
  };
};

export default useSaleInfoGetState;
