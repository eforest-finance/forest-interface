import useGetState from 'store/state/getState';

export default function useJumpExplorer() {
  const { aelfInfo } = useGetState();
  const jump = (chainId: string, path: string) => {
    if (chainId === 'AELF') {
      window.open(`${aelfInfo.MainExplorerURL}${path}`);
    } else {
      window.open(`${aelfInfo.SideExplorerURL}${path}`);
    }
  };
  return jump;
}
