import { fetchNftSalesInfo } from 'api/fetch';
import { INftSaleInfoItem } from 'api/types';
import { useEffect, useState } from 'react';
import useGetState from 'store/state/getState';

export function useGetSalesInfo(id: string) {
  const [salesInfo, setSalesInfo] = useState<INftSaleInfoItem>();
  const { walletInfo } = useGetState();
  useEffect(() => {
    async function fetchData() {
      if (!id) {
        return;
      }
      const salesInfo = fetchNftSalesInfo({ id, excludedAddress: walletInfo?.address || '' });
      try {
        const info = await salesInfo;
        setSalesInfo(info);
      } catch (e) {
        console.log('error', e);
      }
    }
    fetchData();
  }, [id, walletInfo]);

  return salesInfo;
}
