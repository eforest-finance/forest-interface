import { fetchTransactionFee } from 'api/fetch';
import { useEffect, useState } from 'react';
import useDetailGetState from 'store/state/detailGetState';
import { INftInfo } from 'types/nftTypes';

export interface ITransitionFee {
  transactionFee?: number;
  transactionFeeOfUsd?: number;
  forestServiceRate?: number;
  creatorLoyaltyRate?: number;
  aiImageFee?: number;
}

export default function useGetTransitionFee(nftInfo?: INftInfo) {
  const { detailInfo } = useDetailGetState();
  const { nftInfo: stateNftInfo } = detailInfo;
  const info = nftInfo || stateNftInfo;
  const [transactionFee, setTransactionFee] = useState<ITransitionFee>();
  useEffect(() => {
    async function fetchData() {
      if (!info) {
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
  }, [info]);

  return transactionFee;
}
