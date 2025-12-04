import { fetchSymbolHasExisted } from 'api/fetch';
import { useState } from 'react';
import useGetState from 'store/state/getState';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { ICreateItemsParams, IIssuerParams } from 'contract/type';
import { message } from 'antd';
import { useSelector } from 'store/store';
import { BatchCreateNFTModal } from 'components/SyncChainModal/BatchCreateNFTModal';
import { useModal } from '@ebay/nice-modal-react';

export const getCollectionSymbolPrefix = (symbol: string) => {
  try {
    const symbolPrefix = symbol.split('-')[0];
    return symbolPrefix;
  } catch (error) {
    console.log('getCollectionSymbolPrefix error', error);
    return '';
  }
};
export const getSymbolByTokenId = (tokenId: number, collectinInfo: any) => {
  if (collectinInfo?.symbol) {
    const symbolPrefix = getCollectionSymbolPrefix(collectinInfo.symbol);
    const symbol = `${symbolPrefix}-${tokenId}`;
    return symbol;
  } else {
    return '';
  }
};

export function useCreateSingeItemService({ collections }: { collections: any[] }) {
  const [, setLoading] = useState<boolean>(false);
  const { walletInfo } = useGetState();
  const { singleFile } = useSelector((store) => store.createItem);

  const { login } = useCheckLoginAndToken();

  const batchCreateNFTModal = useModal(BatchCreateNFTModal);

  const [modalState, setModalState] = useState({
    isVisible: false,
    isError: false,
    isFinished: false,
    tokenName: '',
    collectionSymbol: '',
  });

  const [createParamsData, setCreateParamsData] = useState<{
    createParams?: ICreateItemsParams;
    issuerParams?: IIssuerParams;
    proxyIssuerAddress?: string;
    skipChainSync?: boolean;
  }>({});

  const onCreateHandler = (formValues: { [key: string]: any }) => {
    login({
      callBack: async () => {
        console.log('onCreateHandler', singleFile);
        if (!singleFile?.url) {
          message.error('nft item must have a logo image');
          return;
        }

        const collectionInfo = collections.find((itm) => itm.id === formValues.collectionId);

        const symbol = getSymbolByTokenId(formValues.tokenId, collectionInfo);
        const { exist } = await fetchSymbolHasExisted({ symbol });
        if (exist) {
          message.error('This token ID has been taken');
          setLoading(false);
          // updateErrorState('tokenId', 'This token ID has been taken');
          return;
        }

        const proxyIssuerAddress = collectionInfo?.proxyIssuerAddress || '';
        const proxyOwnerAddress = collectionInfo?.proxyOwnerAddress || '';

        // const to = ownerType === 'myself' ? address : itemInfo?.owner;
        const to = walletInfo.address;
        const issueChainId = collectionInfo?.issueChainId;

        const params: ICreateItemsParams = {
          symbol,
          tokenName: formValues.tokenName,
          decimals: 0,
          to,
          issuer: proxyIssuerAddress,
          owner: proxyOwnerAddress,
          isBurnable: true,
          issueChainId,
          totalSupply: formValues.quantity,
          memo: '3',
          externalInfo: {
            value: {
              __nft_description: formValues.description || '',
              __nft_file_url: singleFile.url,
              __nft_file_hash: singleFile.hash || '',
              __nft_external_link: formValues.externalLink,
              __nft_fileType: singleFile.fileType || '',
              __nft_metadata: JSON.stringify(formValues.metaData || []),
              __nft_preview_image: '',
            },
          },
        };

        if (!collectionInfo.isMainChainCreateNFT) {
          params.amount = formValues.quantity;
          batchCreateNFTModal.show({
            createParamsData: {
              collectionInfo,
              createParamsArr: [params],
              proxyIssuerAddress,
              proxyOwnerAddress,
            },
            logoImage: singleFile?.url || 'error',
            collectionName: collectionInfo.tokenName,
            nftItemCount: 1,
            title: 'Create an Item',
          });
          return;
        }

        setCreateParamsData({
          createParams: params,
          issuerParams: {
            symbol,
            amount: formValues.quantity,
            memo: '3',
            to: to,
          },
          proxyIssuerAddress,
          skipChainSync: !collectionInfo.isMainChainCreateNFT,
        });
        setModalState((preState) => {
          return {
            ...preState,
            isVisible: true,
            tokenName: formValues.tokenName,
            collectionSymbol: collectionInfo.symbol,
          };
        });
      },
    });
  };

  return {
    onCreateHandler,
    modalState,
    setModalState,
    createParamsData,
  };
}
