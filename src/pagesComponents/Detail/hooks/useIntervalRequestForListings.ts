import Socket from 'socket';
import { getListingsInfo } from '../component/Listings/utils/getListingsInfo';
import { useEffect } from 'react';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { getNFTNumber } from '../utils/getNftNumber';
import { SupportedELFChainId } from 'constants/chain';
import { updateDetail } from '../utils/getNftInfo';
import { store } from 'store/store';

const useIntervalRequestForListings = (nftId: string, chainId: Chain) => {
  const socket = Socket();
  const fetchAndReceiveWs = () => {
    if (!socket || !nftId) {
      return;
    }
    console.log('socket listings---0');

    socket.registerHandler('ReceiveListingChangeSignal', (data) => {
      const walletInfo = store.getState().userInfo.walletInfo;
      const infoState = store.getState().info;
      const { nftInfo, listings, nftNumber } = store.getState().detailInfo;
      console.log('socket listings---1 ReceiveListingChangeSignal', listings?.page === 1, data?.hasChanged, data);
      if (data?.hasChanged) {
        const currentChain = chainId || infoState.sideChain;
        const owner = currentChain === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;

        // if (!updateDetailLoading) {
        updateDetail({ nftId, address: walletInfo.address });
        // }

        if (owner && !nftNumber.loading) {
          getNFTNumber({
            owner,
            nftSymbol: nftInfo?.nftSymbol,
            chainId: currentChain,
          });
        }

        if (!listings?.items?.length || listings?.page === 1) {
          getListingsInfo(chainId, 1, listings?.pageSize || DEFAULT_PAGE_SIZE);
        }
      }
    });
    console.log('socket listings---2');
    socket.sendEvent('RequestListingChangeSignal', nftId);
  };

  useEffect(() => {
    fetchAndReceiveWs();

    return () => {
      console.log('socket listings---3');

      socket?.destroy();
      socket?.sendEvent('UnsubscribeListingChangeSignal', nftId);
    };
  }, [nftId, socket]);
};

export default useIntervalRequestForListings;
