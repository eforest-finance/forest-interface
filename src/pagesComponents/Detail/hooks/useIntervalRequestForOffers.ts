import Socket from 'socket';
import { useEffect } from 'react';
import { getOffersInfo } from '../component/Offers/utils/getOffersInfo';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { SupportedELFChainId } from 'constants/chain';
import { getNFTNumber } from '../utils/getNftNumber';
import { updateDetail } from '../utils/getNftInfo';
import { store } from 'store/store';

const useIntervalRequestForOffers = (nftId: string, chainId: Chain) => {
  const socket = Socket();
  const fetchAndReceiveWs = () => {
    if (!socket) {
      return;
    }
    console.log('socket offers---0');

    socket.registerHandler('ReceiveOfferChangeSignal', (data) => {
      const walletInfo = store.getState().userInfo.walletInfo;
      const infoState = store.getState().info;
      const { offers, nftInfo, nftNumber, updateDetailLoading } = store.getState().detailInfo;

      console.log(
        'socket offers---1 ReceiveOfferChangeSignal',
        offers?.page === 1,
        data?.hasChanged && (!offers || offers?.page === 1),
        updateDetailLoading,
        data,
      );

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

        if (!offers || offers?.page === 1) {
          getOffersInfo(nftId, chainId, 1, offers?.pageSize || DEFAULT_PAGE_SIZE);
        }
      }
    });
    console.log('socket offers---2');
    socket.sendEvent('RequestNftOfferChange', nftId);
  };

  useEffect(() => {
    fetchAndReceiveWs();

    return () => {
      console.log('socket offers---3');

      socket?.destroy();
      socket?.sendEvent('UnsubscribeNftOfferChange', nftId);
    };
  }, [nftId, socket]);
};

export default useIntervalRequestForOffers;
