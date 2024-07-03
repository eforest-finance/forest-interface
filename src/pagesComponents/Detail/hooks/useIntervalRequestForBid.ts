import { useEffect, useMemo, useState } from 'react';
import { IBidInfo, IAuctionInfoResponse } from 'api/types';
import Socket from 'socket';

export interface IIntervalDataForBid {
  isBidding: boolean;
  bidInfos: IBidInfo[];
  auctionInfo: IAuctionInfoResponse & Partial<IBidInfo>;
}
const useIntervalRequestForBid = (isCanBeBid: boolean, nftSymbol: string | undefined, bidSuccess: () => void) => {
  const [biddings, setBiddings] = useState<Array<IBidInfo>>([]);
  const [auctionInfo, setAuctionInfo] = useState<IAuctionInfoResponse & Partial<IBidInfo>>();
  const socket = Socket();

  const intervalDataForBid: IIntervalDataForBid = useMemo(() => {
    // console.log('xxxxx', isCanBeBid, auctionInfo?.finishIdentifier);
    return {
      isBidding: isCanBeBid && auctionInfo?.finishIdentifier !== 2,
      bidInfos: biddings,
      auctionInfo: { ...biddings?.[0], ...auctionInfo } as IAuctionInfoResponse & Partial<IBidInfo>,
    };
  }, [isCanBeBid, auctionInfo, biddings]);

  useEffect(() => {
    if (!isCanBeBid) {
      return;
    }

    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }

      socket.registerHandler('ReceiveSymbolBidInfos', (data) => {
        setBiddings(data?.items || []);
      });
      socket.registerHandler('ReceiveSymbolBidInfo', (data) => {
        setBiddings((c) => [data, ...c]);
      });
      socket.registerHandler('ReceiveSymbolAuctionInfo', (data) => {
        setAuctionInfo(data);
        bidSuccess();
      });
      socket.sendEvent('RequestSymbolBidInfo', nftSymbol, 1000);
      socket.sendEvent('RequestSymbolAuctionInfo', nftSymbol);
    }

    fetchAndReceiveWs();

    return () => {
      socket?.destroy();
      socket?.sendEvent('UnsubscribeSymbolAuctionInfo', nftSymbol);
      socket?.sendEvent('UnsubscribeSymbolBidInfo', nftSymbol);
    };
  }, [isCanBeBid, nftSymbol, socket]);

  return intervalDataForBid;
};

export default useIntervalRequestForBid;
