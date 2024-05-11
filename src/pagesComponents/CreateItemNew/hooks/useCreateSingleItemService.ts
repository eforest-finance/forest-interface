import { fetchSymbolHasExisted } from 'api/fetch';
import { useState } from 'react';
import useGetState from 'store/state/getState';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { ICreateItemsParams, IIssuerParams } from 'contract/type';
import { message } from 'antd';

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

export function useCreateSingeItemService({ collections, fileImage }: { collections: any[]; fileImage: any }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { walletInfo } = useGetState();

  const { login } = useCheckLoginAndToken();

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
        if (!fileImage?.url) {
          message.error('nft item must have a logo image');
          return;
        }

        const collectinInfo = collections.find((itm) => itm.id === formValues.collectionId);

        const symbol = getSymbolByTokenId(formValues!.tokenId, collectinInfo);
        const { exist } = await fetchSymbolHasExisted({ symbol });
        if (exist) {
          message.error('This token ID has been taken');
          setLoading(false);
          // updateErrorState('tokenId', 'This token ID has been taken');
          return;
        }

        const proxyIssuerAddress = collectinInfo?.proxyIssuerAddress || '';
        const proxyOwnerAddress = collectinInfo?.proxyOwnerAddress || '';

        // const to = ownerType === 'myself' ? address : itemInfo?.owner;
        const to = walletInfo.address;
        const issueChainId = collectinInfo?.issueChainId;
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
              __nft_description: '',
              __nft_file_url: fileImage.url,
              __nft_file_hash: fileImage.hash,
              __nft_external_link: formValues.externalLink!,
              __nft_fileType: fileImage.fileType,
              __nft_metadata: JSON.stringify([]),
              __nft_preview_image: '',
            },
          },
        };

        setCreateParamsData({
          createParams: params,
          issuerParams: {
            symbol,
            amount: formValues!.quantity!,
            memo: '3',
            to: to!,
          },
          proxyIssuerAddress,
          skipChainSync: !collectinInfo.isMainChainCreateNFT,
        });
        setModalState((preState) => {
          return {
            ...preState,
            isVisible: true,
            tokenName: formValues.tokenName,
            collectionSymbol: collectinInfo.symbol,
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
