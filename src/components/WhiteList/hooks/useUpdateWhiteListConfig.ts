import { useDeepCompareEffect } from 'react-use';
import { setWhiteListInfo } from 'store/reducer/saleInfo/whiteListInfo';
import useDetailGetState from 'store/state/detailGetState';
import { dispatch } from 'store/store';

export interface IWhiteListConfigType {
  chainId?: Chain;
  whitelistId?: string;
  contract?: Chain;
  adminAddress?: string;
  account?: string;
}

export const useUpdateWhiteListConfig = (v: IWhiteListConfigType) => {
  const { whiteListInfo } = useDetailGetState();
  useDeepCompareEffect(() => {
    dispatch(
      setWhiteListInfo({
        ...whiteListInfo,
        ...v,
      }),
    );
  }, [v]);
};
