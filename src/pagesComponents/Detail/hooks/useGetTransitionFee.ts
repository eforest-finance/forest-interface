import { fetchTransactionFee } from 'api/fetch';
import { useEffect, useState } from 'react';
import useDetailGetState from 'store/state/detailGetState';

export interface ITransitionFee {
  transactionFee?: number;
  transactionFeeOfUsd?: number;
  forestServiceRate?: number;
  creatorLoyaltyRate?: number;
}

export default function useGetTransitionFee() {
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const [transactionFee, setTransactionFee] = useState<ITransitionFee>();
  useEffect(() => {
    async function fetchData() {
      if (!nftInfo) {
        return;
      }
      const transactionFeeData = fetchTransactionFee();
      try {
        const transactionFee = await transactionFeeData;
        setTransactionFee(transactionFee);
      } catch (e) {
        console.log('error', e);
      }
    }
    fetchData();
  }, [nftInfo]);

  return transactionFee;
}
