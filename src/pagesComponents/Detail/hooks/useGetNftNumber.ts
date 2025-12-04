import { useEffect } from 'react';
import useGetState from 'store/state/getState';
import { SupportedELFChainId } from 'constants/chain';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { getNFTNumber as getNFTNumberFun } from '../utils/getNftNumber';
import { store } from 'store/store';
import { initializationNftNumber, setNftNumber } from 'store/reducer/detail/detailInfo';

export default function useGetNftNumber({ nftSymbol, chainId }: { nftSymbol?: string; chainId?: Chain }) {
  const { isLogin } = useCheckLoginAndToken();
  const { walletInfo, infoState } = useGetState();

  const getNFTNumber = async ({ nftSymbol, chainId }: { nftSymbol?: string; chainId?: Chain }) => {
    const currentChain = chainId || infoState.sideChain;
    const owner = currentChain === SupportedELFChainId.MAIN_NET ? walletInfo.aelfChainAddress : walletInfo.address;
    if (!(isLogin && owner)) return;

    getNFTNumberFun({
      owner,
      nftSymbol,
      chainId: currentChain,
    });
  };

  useEffect(() => {
    if (isLogin && nftSymbol) {
      getNFTNumber({ nftSymbol, chainId });
    } else {
      store.dispatch(setNftNumber(initializationNftNumber));
    }
  }, [isLogin, nftSymbol, chainId, walletInfo.address, walletInfo.aelfChainAddress]);

  return getNFTNumber;
}
