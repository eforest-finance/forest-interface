import { useRequest } from 'ahooks';
import { fetchCollections } from 'api/fetch';
import useResponsive from 'hooks/useResponsive';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useGetState from 'store/state/getState';

import { useCreateSingeItemService } from './useCreateSingleItemService';
import { useBatchCreateItemService } from './useBatchCreateItemsService';
import { resetValue } from 'store/reducer/create/item';
import { store } from 'store/store';
import { SegmentedValue } from 'antd/lib/segmented';
import { ItemFromCsv } from '../components/Upload/UploadMeta';

export function useCreateItemPageService() {
  const router = useRouter();
  const { isLG } = useResponsive();
  const { walletInfo } = useGetState();
  const [createType, setCreateType] = useState<string | number>('single');

  const [metaList, setMetaList] = useState<Array<ItemFromCsv>>([]);

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

  const { modalState, setModalState, createParamsData, onCreateHandler } = useCreateSingeItemService({
    collections: collectionList?.items || [],
  });

  const { onBatchCreateHandler, batchCreateLoading } = useBatchCreateItemService({
    collections: collectionList?.items || [],
  });

  const onBackHandler = () => {
    router.back();
  };

  const onCreateTypeChange = (value: SegmentedValue) => {
    setCreateType(value);
    setMetaList([]);
    store.dispatch(resetValue());
  };

  useEffect(() => {
    store.dispatch(resetValue());
  }, []);

  return {
    onBackHandler,

    isSmallScreen: isLG,
    createType,
    onCreateTypeChange,
    optionsForCollection: collectionList?.items || [],

    metaList,
    setMetaList,

    modalState,
    setModalState,
    createParamsData,
    onCreateHandler,

    onBatchCreateHandler,

    batchCreateLoading,
  };
}
