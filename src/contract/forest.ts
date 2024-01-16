import { store } from 'store/store';

export const getForestContractAddress = () => {
  const info = store.getState().aelfInfo.aelfInfo;

  return {
    main: info?.forestMainAddress as unknown as string,
    side: info?.forestSideAddress as unknown as string,
  };
};
