import useResponsive from 'hooks/useResponsive';
import { fetchCollections } from 'api/fetch';
import { useRequest } from 'ahooks';
import useGetState from 'store/state/getState';
import { useState } from 'react';
import { dispatch } from 'store/store';
import { clearNftInfoFormList } from 'store/reducer/create/itemsByAI';

export function useCreateItemAIPageService() {
  const { isLG } = useResponsive();
  const { walletInfo } = useGetState();

  const [createStep, setCreateStep] = useState<number>(0);
  const preStep = () => {
    if (!createStep) return;
    setCreateStep(createStep - 1);
    dispatch(clearNftInfoFormList());
  };
  const nextStep = () => {
    if (createStep > 1) return;
    setCreateStep(createStep + 1);
  };

  const { data: collectionList } = useRequest(
    () => {
      if (!walletInfo.aelfChainAddress || !walletInfo.address)
        return Promise.resolve({
          items: [],
        });
      return fetchCollections({
        skipCount: 0,
        maxResultCount: 1000,
        addressList: [walletInfo.aelfChainAddress, walletInfo.address],
      });
    },
    {
      refreshDeps: [walletInfo.aelfChainAddress, walletInfo.address],
    },
  );

  const onCreateNFTHandler = (values: any) => {
    console.log('onCreateNFTHandler', values);
  };

  return {
    isSmallScreen: isLG,
    optionsForCollection: collectionList?.items || [],
    onCreateNFTHandler,

    preStep,
    nextStep,
    createStep,
  };
}
