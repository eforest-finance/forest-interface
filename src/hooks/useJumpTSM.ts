import { useCallback } from 'react';
import useGetState from 'store/state/getState';
import { isPortkeyApp } from 'utils/isMobile';

export const useJumpTSM = () => {
  const { aelfInfo } = useGetState();
  const jumpTSM = useCallback(
    (path: string) => {
      if (isPortkeyApp()) {
        window.location.href = `${aelfInfo.tsm}${path}`;
      } else {
        window.open(`${aelfInfo.tsm}${path}`);
      }
    },
    [aelfInfo],
  );
  return jumpTSM;
};
