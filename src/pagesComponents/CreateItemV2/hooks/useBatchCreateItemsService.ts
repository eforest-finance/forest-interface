import useGetState from 'store/state/getState';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { store } from 'store/store';
import { getSymbolByTokenId } from './useCreateSingleItemService';
import { useModal } from '@ebay/nice-modal-react';
import { useState } from 'react';
import { BatchCreateNFTModal } from 'components/SyncChainModal/BatchCreateNFTModal';
import { message } from 'antd';

export function useBatchCreateItemService({ collections }: { collections: any[] }) {
  const { walletInfo } = useGetState();
  const { login } = useCheckLoginAndToken();

  const [batchCreateLoading] = useState<boolean>(false);

  const batchCreateNFTModal = useModal(BatchCreateNFTModal);

  const onBatchCreateHandler = (formValues: any) => {
    login({
      callBack: async () => {
        const collectionInfo = collections.find((itm) => itm.id === formValues.collectionId);

        const proxyIssuerAddress = collectionInfo?.proxyIssuerAddress || '';
        const proxyOwnerAddress = collectionInfo?.proxyOwnerAddress || '';

        const batchFiles = store.getState().createItem?.batchFiles || [];
        console.log('batchFiles', batchFiles);

        if (!batchFiles.length) {
          message.error('you must upload metadata file');
          return;
        }

        const createParamsArr = adaptorBatchCreateParamByBatchFiles(batchFiles, collectionInfo, walletInfo);
        batchCreateNFTModal.show({
          createParamsData: {
            collectionInfo,
            createParamsArr,
            proxyIssuerAddress,
            proxyOwnerAddress,
          },
          logoImage: batchFiles?.[0]?.url || 'error',
          collectionName: collectionInfo.tokenName,
          nftItemCount: batchFiles.length,
        });
      },
    });
  };

  return {
    onBatchCreateHandler,
    batchCreateLoading,
  };
}

const adaptorBatchCreateParamByBatchFiles = (batchFiles: any[], collectinInfo: any, walletInfo: any) => {
  const proxyIssuerAddress = collectinInfo?.proxyIssuerAddress || '';
  const proxyOwnerAddress = collectinInfo?.proxyOwnerAddress || '';

  const to = walletInfo.address;
  const issueChainId = collectinInfo?.issueChainId;

  const batchCreateParamsArr = batchFiles.map((createParam) => {
    const symbol = getSymbolByTokenId(createParam.tokenId, collectinInfo);
    return {
      symbol,
      tokenName: createParam.meta?.['NFT Name'] || '',
      decimals: 0,
      to,
      issuer: proxyIssuerAddress,
      owner: proxyOwnerAddress,
      isBurnable: true,
      issueChainId,
      totalSupply: createParam.meta?.Quantity,
      amount: createParam.meta?.Quantity,
      memo: '3',
      externalInfo: {
        value: {
          __nft_description: createParam?.meta?.Description || '',
          __nft_file_url: createParam.url,
          __nft_file_hash: createParam.hash,
          __nft_external_link: createParam.meta?.['External Link'],
          __nft_fileType: createParam.fileType,
          __nft_metadata: JSON.stringify(adatorMetadata(createParam?.meta)),
          __nft_preview_image: '',
        },
      },
    };
  });

  return batchCreateParamsArr;

  function adatorMetadata(metaDataFromFile: any = {}) {
    const metaData: Array<{
      key: string;
      value: string;
    }> = [];
    //Metadata[Attributes1]
    const keys = Object.keys(metaDataFromFile).filter((key) => key.includes('Metadata'));
    keys.forEach((key) => {
      const matcher = String(key).match('Metadata\\[(.*)\\]');
      const targetKey = matcher && matcher[1];
      const value = metaDataFromFile[key];

      if (targetKey && value) {
        metaData.push({
          key: targetKey,
          value,
        });
      }
    });

    return metaData;
  }
};
