import { useRequest } from 'ahooks';
import { fetchCollections } from 'api/fetch';
import useResponsive from 'hooks/useResponsive';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useGetState from 'store/state/getState';

import { useCreateSingeItemService } from './useCreateSingleItemService';
import { useBatchCreateItemService } from './useBatchCreateItemsService';

export function useCreateItemPageService() {
  const router = useRouter();
  const { isLG } = useResponsive();
  const { walletInfo } = useGetState();
  const [createType, setCreateType] = useState<string | number>('single');

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

  const [fileImage, setFileImage] = useState<any>({});

  const { modalState, setModalState, createParamsData, onCreateHandler } = useCreateSingeItemService({
    collections: collectionList?.items || [],
    fileImage,
  });

  const { onBatchCreateHandler } = useBatchCreateItemService({
    collections: collectionList?.items || [],
    fileImage,
  });

  const onBackHandler = () => {
    router.back();
  };

  return {
    onBackHandler,

    isSmallScreen: isLG,
    createType,
    setCreateType,
    optionsForCollection: collectionList?.items || [],
    setFileImage,
    fileImage,

    modalState,
    setModalState,
    createParamsData,
    onCreateHandler,

    onBatchCreateHandler,
  };
}
