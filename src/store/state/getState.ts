import { useSelector } from 'react-redux';
import { selectInfo } from '../reducer/info';
import { getChainsInfo, getNftTypes } from '../reducer/nftInfo';
import { getAelfInfo } from '../reducer/aelfInfo';
import { getWalletInfo } from 'store/reducer/userInfo';
import { getPauseState, getCrossChainSyncStatusComplete } from 'store/reducer/syncChainModal';

const useGetState = () => {
  const infoState = useSelector(selectInfo);
  const aelfInfo = useSelector(getAelfInfo);
  const supportChains = useSelector(getChainsInfo);
  const nftTypes = useSelector(getNftTypes);
  const walletInfo = useSelector(getWalletInfo);
  const pauseState = useSelector(getPauseState);
  const crossChainSyncStatusComplete = useSelector(getCrossChainSyncStatusComplete);

  return {
    infoState,
    supportChains,
    nftTypes,
    walletInfo,
    aelfInfo,
    pauseState,
    crossChainSyncStatusComplete,
  };
};

export default useGetState;
