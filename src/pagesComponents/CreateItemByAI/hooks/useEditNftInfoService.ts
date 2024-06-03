import { IAIImage } from 'api/types';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { BatchCreateNFTModal } from 'components/SyncChainModal/BatchCreateNFTModal';
import useGetState from 'store/state/getState';
import {
  setNftInfoFormList,
  setCollection,
  editCurrentSelNftInfoForm,
  setCurrentSelIndex,
  INFTForm,
} from 'store/reducer/create/itemsByAI';
import { dispatch, useSelector } from 'store/store';
import { getSymbolByTokenId } from 'pagesComponents/CreateItemV2/hooks/useCreateSingleItemService';
import { useModal } from '@ebay/nice-modal-react';
import BigNumber from 'bignumber.js';
import { externalLinkReg } from 'constants/common';
import { message } from 'antd';
import { useWebLogin } from 'aelf-web-login';

export function useEditNftInfoService({ collections }: { collections: any[] }) {
  const { nftInfoFormList, currentSelIndex, currentCollection } = useSelector((store) => store.createItemAI);
  const { walletInfo } = useGetState();

  const { login } = useCheckLoginAndToken();
  const { version } = useWebLogin();

  const batchCreateNFTModal = useModal(BatchCreateNFTModal);

  const initNftInfoFormListByImageArr = (imageArr: IAIImage[]) => {
    const results = imageArr.map((item) => ({
      collectionId: '',
      tokenName: '',
      metaData: [],
      imageUrl: item.url,
      hash: item.hash,
    }));
    console.log('initNftInfoFormListByImageArr', results);
    dispatch(setNftInfoFormList(results));
  };

  const onEditCurrentNFTFormHandler = (changedValue: any, values: any) => {
    dispatch(editCurrentSelNftInfoForm(values));

    if (changedValue.collectionId) {
      const collectionInfo = collections.find((itm) => itm.id === changedValue.collectionId);

      if (!collectionInfo) return;
      dispatch(setCollection(collectionInfo));
    }
  };

  const onChangeSetNftInfoFormByIndex = (index: number) => {
    dispatch(setCurrentSelIndex(index));
  };

  const onCreateNFTHandler = () => {
    login({
      callBack: async () => {
        if (version !== 'v2') {
          message.warning('AI NFT Generator only supports V2');
          return;
        }

        const collectionInfo = collections.find((itm) => itm.id === currentCollection?.id);

        const proxyIssuerAddress = collectionInfo?.proxyIssuerAddress || '';
        const proxyOwnerAddress = collectionInfo?.proxyOwnerAddress || '';

        if (!nftInfoFormList.length || !nftInfoFormList.every((formValue) => validateFormValues(formValue))) {
          return;
        }

        const createParamsArr = nftInfoFormList.map((item) => {
          const symbol = getSymbolByTokenId(item.tokenId as number, collectionInfo);
          return {
            symbol,
            tokenName: item.tokenName || '',
            decimals: 0,
            to: walletInfo.address,
            issuer: proxyIssuerAddress,
            owner: proxyOwnerAddress,
            isBurnable: true,
            issueChainId: collectionInfo.issueChainId,
            totalSupply: item.quantity || 0,
            amount: item.quantity || 0,
            memo: '3',
            externalInfo: {
              value: {
                __nft_description: item.description || '',
                __nft_file_url: item.imageUrl || '',
                __nft_file_hash: item.hash || '',
                __nft_external_link: item.externalLink || '',
                __nft_fileType: 'image',
                __nft_metadata: JSON.stringify(item.metaData || []),
                __nft_preview_image: '',
              },
            },
          };
        });

        const imageHashListForUpdate = nftInfoFormList.map((item) => item.hash);

        batchCreateNFTModal.show({
          createParamsData: {
            collectionInfo,
            createParamsArr,
            proxyIssuerAddress,
            proxyOwnerAddress,
            imageHashListForUpdate,
          },
          logoImage: nftInfoFormList[0].imageUrl || 'error',
          collectionName: collectionInfo.tokenName,
          nftItemCount: nftInfoFormList.length,
        });
      },
    });
  };

  return {
    nftInfoFormList,
    initNftInfoFormListByImageArr,

    currentSelNftInfoForm: nftInfoFormList[currentSelIndex],
    onChangeSetNftInfoFormByIndex,

    onEditCurrentNFTFormHandler,

    onCreateNFTHandler,
  };
}

function validateFormValues(nftInfoForm: INFTForm) {
  const NUMBER_MAX = '9007199254740991';

  const requiredKeys: Array<keyof INFTForm> = ['tokenName', 'collectionId', 'quantity', 'tokenId'];
  const requiredFlag = requiredKeys.every((key) => !!nftInfoForm[key]);

  const validateTokenName = /^[A-Za-z0-9]+$/.test(nftInfoForm.tokenName || '');
  const validateQuantity =
    /^[1-9][0-9]*$/.test(String(nftInfoForm.quantity || '')) &&
    BigNumber(String(nftInfoForm.quantity)).lt(BigNumber(NUMBER_MAX));

  const validateTokenId = /^[1-9][0-9]*$/.test(String(nftInfoForm.tokenId)) && Number(nftInfoForm.tokenId) < 999999;

  const validateExternalLink = !nftInfoForm.externalLink || externalLinkReg.test(nftInfoForm.externalLink);
  const res = requiredFlag && validateTokenName && validateQuantity && validateTokenId && validateExternalLink;

  !res && message.error('NFT has not been filled in or has an incorrect parameter entered.');

  return res;
}
