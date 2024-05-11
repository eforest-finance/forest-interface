import useGetState from 'store/state/getState';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { store } from 'store/store';
import { getSymbolByTokenId } from './useCreateSingleItemService';
import useCreateByStep from 'hooks/useCreate';

export function useBatchCreateItemService({ collections, fileImage }: { collections: any[]; fileImage: any }) {
  const { walletInfo } = useGetState();
  const { login } = useCheckLoginAndToken();
  const info = store.getState().aelfInfo.aelfInfo;

  const { batchCreateNFT } = useCreateByStep();

  const batchCreateNFTByContract = async () => {};

  const batchCreateNfts = [];

  const onBatchCreateHandler = (formValues: any) => {
    login({
      callBack: async () => {
        const collectinInfo = collections.find((itm) => itm.id === formValues.collectionId);

        console.log('batchCreateNFT collectionInfo', collectinInfo);
        const proxyIssuerAddress = collectinInfo?.proxyIssuerAddress || '';
        const proxyOwnerAddress = collectinInfo?.proxyOwnerAddress || '';

        const symbol = getSymbolByTokenId(formValues!.tokenId, collectinInfo);
        const to = walletInfo.address;
        const issueChainId = collectinInfo?.issueChainId;

        const createParamsArr = [
          {
            tokenName: 'snow',
            quantity: 1000,
            fileImage: {
              url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1715396283840-nft_download_image_11.png',
              hash: '824c9d4ba913600417c9af770e340928',
              externalLink: '',
              fileType: 'image',
            },
            symbol: 'ASGJDAGAUWAGASDSAG-1106',
          },
          {
            tokenName: 'snow',
            quantity: 1000,
            fileImage: {
              url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1715396283840-nft_download_image_11.png',
              hash: '824c9d4ba913600417c9af770e340928',
              externalLink: '',
              fileType: 'image',
            },
            symbol: 'ASGJDAGAUWAGASDSAG-1107',
          },
          {
            tokenName: 'snow',
            quantity: 1000,
            fileImage: {
              url: 'https://forest-testnet.s3.ap-northeast-1.amazonaws.com/1715396283840-nft_download_image_11.png',
              hash: '824c9d4ba913600417c9af770e340928',
              externalLink: '',
              fileType: 'image',
            },
            symbol: 'ASGJDAGAUWAGASDSAG-1108',
            externalLink: '',
          },
        ].map((createParam) => {
          return {
            symbol: createParam.symbol,
            tokenName: createParam.tokenName,
            decimals: 0,
            to,
            issuer: proxyIssuerAddress,
            owner: proxyOwnerAddress,
            isBurnable: true,
            issueChainId,
            totalSupply: createParam.quantity,
            amount: createParam.quantity,
            memo: '3',
            externalInfo: {
              value: {
                __nft_description: '',
                __nft_file_url: createParam.fileImage.url,
                __nft_file_hash: createParam.fileImage.hash,
                __nft_external_link: createParam.externalLink,
                __nft_fileType: createParam.fileImage.fileType,
                __nft_metadata: JSON.stringify([]),
                __nft_preview_image: '',
              },
            },
          };
        });

        batchCreateNFT(createParamsArr, proxyOwnerAddress, proxyIssuerAddress);
      },
    });
  };

  return {
    onBatchCreateHandler,
  };
}
