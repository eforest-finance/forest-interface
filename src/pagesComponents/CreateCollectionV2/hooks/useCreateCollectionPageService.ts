import { useRouter } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';
import { useState } from 'react';
import { ICreateCollectionParams } from 'contract/type';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { message } from 'antd';
import useGetState from 'store/state/getState';
import { ISingleFile } from 'store/reducer/create/item';

export function useCreateCollectionPageService() {
  const router = useRouter();
  const onBackHandler = () => {
    router.back();
  };

  const { login } = useCheckLoginAndToken();
  const { walletInfo } = useGetState();

  const { isLG } = useResponsive();

  const [modalState, setModalState] = useState({
    isVisible: false,
    isError: false,
    isFinished: false,
    tokenName: '',
    logoImage: '',
    seed: '',
  });

  const [uploadFile, setUploadFile] = useState<ISingleFile>();

  const [createParamsData, setCreateParamsData] = useState<ICreateCollectionParams>({
    symbol: '',
    tokenName: '',
    totalSupply: 0,
    decimals: 0,
    issuer: '',
    isBurnable: false,
    issueChainId: '',
    amount: 1,
    seedSymbol: '',
    owner: '',
    isCreateNftIssueChain: true,
    externalInfo: {
      value: {
        __nft_description: '',
        __nft_external_link: '',
        __nft_file_hash: '',
        __nft_featured_url: '',
        __nft_file_url: '',
        __nft_metadata: '',
      },
    },
  });

  const onCreateHandler = (formValues: any) => {
    console.log('onCreateHandler', formValues);
    if (!uploadFile?.url) {
      message.error('collection item must have a logo image');
      return;
    }

    login({
      callBack: () => {
        const params = adaptorCreateParam(formValues, walletInfo, uploadFile);
        setCreateParamsData(params);
        console.log('params before create', params);
        setModalState({
          ...modalState,
          isVisible: true,
          tokenName: formValues.tokenName,
          logoImage: uploadFile?.url || '',
          seed: formValues?.symbol?.value || '',
        });
      },
    });
  };

  return {
    onBackHandler,
    isSmallScreen: isLG,

    onCreateHandler,

    uploadFile,
    setUploadFile,

    modalState,
    setModalState,

    createParamsData,
  };
}

function adaptorCreateParam(formValues: any, walletInfo: any, file: any) {
  const owner = walletInfo.address || ''; //side chain address
  const issuer = walletInfo.address; // side
  const params: ICreateCollectionParams = {
    symbol: formValues!.symbol.value || '',
    seedSymbol: formValues.symbol?.key || '',
    tokenName: formValues.tokenName || '',
    decimals: 0,
    issuer,
    isBurnable: formValues.isBurnable,
    issueChainId: formValues.issueChainId,
    totalSupply: 1,
    memo: '3',
    amount: 1,
    owner,
    isCreateNftIssueChain: true,
    externalInfo: {
      value: {
        __nft_file_hash: file?.hash || '',
        __nft_feature_hash: '',
        __nft_payment_tokens: ['ELF'],
        __nft_description: formValues.description,
        __nft_file_url: file?.url || '',
        __nft_featured_url: '',
        __nft_external_link: formValues.externalLink || '',
        __nft_metadata: '',
      },
    },
  };

  return params;
}
