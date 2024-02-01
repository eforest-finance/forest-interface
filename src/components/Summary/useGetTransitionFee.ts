import { fetchTransactionFee } from 'api/fetch';
import { useEffect, useState } from 'react';

export interface ITransitionFee {
  transactionFee?: number;
  transactionFeeOfUsd?: number;
  forestServiceRate?: number;
  creatorLoyaltyRate?: number;
}

export default function useGetTransitionFee() {
  const [transactionFee, setTransactionFee] = useState<ITransitionFee>();
  useEffect(() => {
    async function fetchData() {
      try {
        const transactionFee = await fetchTransactionFee();
        setTransactionFee(transactionFee);
      } catch (e) {
        console.log('error', e);
      }
    }
    fetchData();
  }, []);

  return transactionFee;
}
