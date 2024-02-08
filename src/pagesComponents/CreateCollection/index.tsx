'use client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useSetState, useTimeoutFn, useUnmount, useMount } from 'react-use';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { message, Upload } from 'antd';

import Input, { TextArea } from 'baseComponents/Input';
import { Select, Option } from 'baseComponents/Select';
import Button from 'baseComponents/Button';

import RequiredSymbol from 'assets/images/required.svg';
import AddPicture from 'assets/images/addPicture.svg';
import Arrow from 'assets/images/arrow.svg';
import AddMetadata from 'assets/images/add.svg';
import Close from 'assets/images/close.svg';

import FormItem from 'components/FormItem';
import ELFSVG from 'assets/images/elf.svg';

import useGetState from 'store/state/getState';

import style from './style.module.css';
import SyncChainModal, { ISyncChainModalRef } from 'components/SyncChainModal';

import { fetchSymbolList } from 'api/fetch';
import { useContractConnect } from 'hooks/useContractConnect';
import AWSManagerInstance, { UploadFileType } from 'utils/S3';

import SelectSearch, { ISelectRequestConfig } from 'components/SelectSearch';
import { IContractError, ICreateCollectionParams, ICreateParams } from 'contract/type';
import { externalLinkReg } from 'constants/common';
import { IOwnedSymbol } from 'api/types';
import { dispatch } from 'store/store';
import PageLoading from 'components/PageLoading';
import { elementScrollToView } from 'utils/scrollIntoView';
import { useWalletSyncCompleted, useCheckLoginAndToken } from 'hooks/useWalletSync';
import { useLogoutListener } from 'hooks/useLogoutListener';

type ProtocolInfo = {
  name?: string;
  url?: string;
  blockchain: string[];
  symbol?: string;
  payment?: string;
  type?: string;
  supply: number;
  burnable: boolean;
  additional: boolean;
  fee: number;
};

enum ImageType {
  Logo = 'Logo',
  Featured = 'Featured',
}

type ImageInfoType = {
  url: string;
  file: File | null;
  hash: string;
  preview: string;
};

type FormErrorType = {
  name?: {
    msg: string;
  };
  externalLink?: {
    msg: string;
  };
  description?: {
    msg: string;
  };
  tokenId?: {
    msg: string;
  };
};

enum ErrorStateType {
  Name = 'name',
  ExternalLink = 'externalLink',
}

export default function CreateCollection() {
  const { infoState, walletInfo, aelfInfo } = useGetState();

  const syncChainModalRef = useRef<ISyncChainModalRef>();
  const symbolOption = useRef<IOwnedSymbol>();
  const [symbolParams, setSymbolParams] = useSetState({
    address: walletInfo?.address,
    seedOwnedSymbol: undefined,
    skipCount: 0,
    maxResultCount: 10,
  });

  const { getAccountInfoSync } = useWalletSyncCompleted();
  const { isLogin, login } = useCheckLoginAndToken();

  const address = walletInfo?.address;
  const mainAddress = walletInfo?.aelfChainAddress;

  console.log('----walletInfo----', walletInfo, address);

  const { isSmallScreen } = infoState;
  const nav = useRouter();

  const navigate = navigator;
  const [isDisabled, setIsDisabled] = useState(true);

  const [logo, setLogo] = useSetState<ImageInfoType>({
    url: '',
    hash: '',
    file: null,
    preview: '',
  });
  const [logoLoading, setLogoLoading] = useState<boolean>(false);

  const [featured, setFeatured] = useSetState<ImageInfoType>({
    url: '',
    hash: '',
    file: null,
    preview: '',
  });
  const [featuredLoading, setFeaturedLoading] = useState<boolean>(false);

  const [modalState, setModalState] = useState({
    isVisible: false,
    isError: false,
    isFinished: false,
  });

  const [protocolInfo, setProtocolInfo] = useState<ProtocolInfo>({
    payment: 'ELF',
    burnable: true,
    additional: true,
    symbol: undefined,
    supply: 1,
    blockchain: [aelfInfo.curChain],
    fee: 5, // why 5
  });
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([]);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<FormErrorType>();

  const [loading, setLoading] = useState(false);
  const unMounted = useRef<boolean>(false);

  const updateErrorState = (key: ErrorStateType, msg: string | undefined) => {
    if (msg) {
      setFormError((preState: FormErrorType | undefined) => {
        return {
          ...preState,
          [key]: {
            msg,
          },
        };
      });
    } else {
      setFormError((preState: FormErrorType | undefined) => {
        return {
          ...preState,
          [key]: undefined,
        };
      });
    }
  };

  function getBase64(img: Blob, callback: Function) {
    const reader = new FileReader();
    try {
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    } catch {
      // message.error('');
    }
  }

  useMount(() => {
    document.body.scrollTop = 0;
  });

  useUnmount(() => {
    message.destroy();
    unMounted.current = true;
  });

  const beforeUpload = (type: ImageType) => {
    return async (file: File) => {
      let preview = '';
      const getImg = () =>
        getBase64(file, (imageUrl: string) => {
          preview = imageUrl;
        });

      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error(`File upload failed. Please choose a file within the size limit.`);
        return false;
      }

      message.loading({ content: 'Uploading...', key: 'upload', duration: 0 });

      switch (file.type) {
        case 'image/gif':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          if (type === ImageType.Logo) {
            setLogoLoading(true);
          } else {
            setFeaturedLoading(true);
          }
          getImg();
          // eslint-disable-next-line no-case-declarations
          const { url, hash } = await AWSManagerInstance.uploadFile(file);
          if (unMounted.current) return;
          if (type === ImageType.Logo) {
            setLogo({
              url,
              file,
              hash,
              preview,
            });
            setLogoLoading(false);
          } else {
            setFeatured({
              url,
              file,
              hash,
              preview,
            });
            setFeaturedLoading(false);
          }
          message.destroy();
          message.success(`${file.name} file uploaded successfully.`);
          return false;

        default:
          message.destroy();
          message.error('File upload failed. The supported formats are JPG, PNG and GIF');
          return Upload.LIST_IGNORE;
      }
    };
  };

  const addMetadata = () => {
    setMetadata((v) => {
      return [
        ...v.map((item, index) => {
          return {
            key: item.key.includes('description') ? 'description' + (index + 1) : item.key,
            value: item.value,
          };
        }),
        { key: 'description' + (v.length + 1), value: '' },
      ];
    });
  };

  const deleteMetadata = (index: number) => {
    setMetadata((v) => {
      v.splice(index, 1);
      return [...v];
    });
  };

  const changeMetadata = (e: any, index: number, type: 'key' | 'value') => {
    setMetadata((v) => {
      v[index] = { ...v[index], [type]: e.target.value };
      return [...v];
    });
  };

  const handleSelect = useCallback((symbol: string, item: any) => {
    handleProtocolChange(symbol, 'symbol');
    symbolOption.current = item;
  }, []);

  const handleSearch = useCallback(
    async (config: ISelectRequestConfig) => {
      const { searchText } = config;
      const requestParams = {
        address: mainAddress!,
        seedOwnedSymbol: searchText,
        // skipCount: page,
        // maxResultCount: 10,
      };

      if (!searchText) {
        delete requestParams.seedOwnedSymbol;
      }

      if (!requestParams.address) {
        return null;
      }

      try {
        const res = await fetchSymbolList(requestParams);
        const items = res.items.map((item) => {
          return {
            ...item,
            label: item.symbol,
            value: item.symbol,
          };
        });
        return {
          total: res.totalCount,
          items,
        };
      } catch (error) {
        console.log(error);
      }

      return null;
    },
    [mainAddress, isLogin],
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event?.target as HTMLInputElement).value;
    const trimName = value.trim();
    if (trimName?.length && !/^[A-Za-z0-9]+$/.test(trimName)) {
      updateErrorState(ErrorStateType.Name, 'Invalid name. Please enter only letters and numbers.');
    } else {
      updateErrorState(ErrorStateType.Name, undefined);
    }
    handleProtocolChange(trimName, 'name');
  };

  const handleExternalChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = (event?.target as HTMLInputElement).value;
    const trimText = value.trim();
    if (trimText?.length && !externalLinkReg.test(trimText)) {
      updateErrorState(ErrorStateType.ExternalLink, 'Invalid external link.');
    } else {
      updateErrorState(ErrorStateType.ExternalLink, undefined);
    }

    handleProtocolChange(trimText, 'url');
  };

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

  const handleCreate = async () => {
    login({
      callBack: async () => {
        const mainAddress = await getAccountInfoSync();
        if (!mainAddress) return;

        console.log('protocolInfo', protocolInfo);

        const owner = walletInfo.aelfChainAddress || mainAddress || ''; // main
        const issuer = walletInfo.address; // side

        const params: ICreateCollectionParams = {
          symbol: protocolInfo!.symbol || '',
          tokenName: protocolInfo.name || '',
          decimals: 0,
          issuer,
          isBurnable: protocolInfo!.burnable,
          issueChainId: protocolInfo!.blockchain[0],
          totalSupply: 1,
          memo: '3',
          amount: 1,
          seedSymbol: symbolOption.current?.seedSymbol || '',
          owner,
          externalInfo: {
            value: {
              __nft_file_hash: logo.hash,
              __nft_feature_hash: featured.hash,
              __nft_payment_tokens: [protocolInfo.payment || ''],
              __nft_description: description,
              __nft_file_url: logo.url,
              __nft_featured_url: featured.url,
              __nft_external_link: protocolInfo.url || '',
              __nft_metadata: JSON.stringify(metadata),
            },
          },
        };
        setCreateParamsData(params);
        setModalState({
          ...modalState,
          isVisible: true,
        });
      },
    });
  };

  useEffect(() => {
    const isRequired = (() => {
      const { name, symbol } = protocolInfo;
      const validateDescription = description.length <= 1000;
      const validateChain = protocolInfo.blockchain;

      return !(
        logo?.url &&
        logo?.hash &&
        name &&
        symbol &&
        validateDescription &&
        validateChain &&
        !logoLoading &&
        !featuredLoading
      );
    })();

    if (formError) {
      const keys = Object.keys(formError);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const item = formError[key as keyof FormErrorType];

        if (item) {
          setIsDisabled(true);
          return;
        }
      }
    }

    setIsDisabled(isRequired);
  }, [description.length, featuredLoading, formError, logo, logoLoading, protocolInfo]);

  useLogoutListener();

  const handleProtocolChange = (e: any, type: keyof ProtocolInfo) => {
    let value: boolean | string | number;
    switch (type) {
      case 'burnable':
      case 'additional':
        value = e === 'True';
        break;
      case 'blockchain':
      case 'supply':
      case 'url':
      case 'name':
        value = e;
        break;
      case 'symbol':
        value = e || '';
        break;
      case 'type':
        value = e?.target?.value || e;
        handleProtocolChange('True', 'additional');
        break;
      default:
        value = e?.target?.value || e;
    }
    setProtocolInfo((v) => {
      return {
        ...v,
        [type]: value,
      };
    });
  };

  if (!isLogin) {
    return <PageLoading />;
  }

  const renderSyncChainModal = () => {
    if (!modalState.isVisible) return null;

    return (
      <SyncChainModal
        // ref={(ref) => (syncChainModalRef.current = ref)}
        visible={modalState.isVisible}
        isError={modalState.isError}
        title={'Create a Collection'}
        logoImage={logo.url}
        tokenName={protocolInfo.name}
        seed={protocolInfo.symbol}
        createParamsData={createParamsData}
        isFinished={modalState.isFinished}
        successUrl="/my-collections"
        onFinished={() => {
          console.log(modalState.isVisible);
          setModalState({
            isVisible: false,
            isError: false,
            isFinished: false,
          });

          // setTimeout(() => {
          //   nav.push('/my-collections');
          // }, 4000);
        }}></SyncChainModal>
    );
  };

  return (
    <div
      className={clsx(
        'create_protocol',
        isSmallScreen && `${style['mobile_create_protocol']} p-[0_16px]`,
        'max-w-[1280px] mx-auto my-0 mdTW:p-[0_40px]',
        style.wrapper,
      )}>
      <div>
        <h1
          className={`font-semibold leading-[48px] text-[var(--color-primary)] text-[30px] pb-[24px] mdTW:pb-[40px] !mb-0 mdTW:text-[40px] pt-[40px] mdTW:pt-[80px]`}>
          Create a Collection
        </h1>
        <p className="flex items-center	font-medium leading-[21px] !mb-[16px] mdTW:!mb-[24px] text-[14px]">
          <RequiredSymbol className="h-full flex item-center text-functionalDanger "></RequiredSymbol>
          <span className="ml-[4px] text-[var(--color-secondary)]">Required fields</span>
        </p>
      </div>

      <div className="form">
        <FormItem
          title="Logo image"
          require
          description="This image will also be used as a thumbnail. 350 x 350 px recommended.">
          <Upload
            accept=".jpeg,.jpg,.png"
            name="Files"
            beforeUpload={beforeUpload(ImageType.Logo)}
            listType="picture-card"
            disabled={logoLoading}
            className={`${style.logo_uploader} mt-[16px]`}
            showUploadList={false}>
            <div className="logo flex-center">
              {logo.preview ? <img src={logo.preview} alt="avatar" className="w-full	h-full" /> : <AddPicture />}
            </div>
          </Upload>
        </FormItem>
        <FormItem
          title="Featured image"
          description="This image will be used for featuring your collection on the homepage, category pages, or other promotional areas in Forest. 600 x 400 px recommended.">
          <Upload
            accept=".jpeg,.jpg,.png"
            name="Files"
            action={'/'}
            disabled={featuredLoading}
            beforeUpload={beforeUpload(ImageType.Featured)}
            listType="picture-card"
            className={`${style.featured_uploader} mt-[16px]`}
            showUploadList={false}>
            <div className="feature flex-center">
              {featured.preview ? <img src={featured.preview} alt="featured" className="w-full" /> : <AddPicture />}
            </div>
          </Upload>
        </FormItem>
        <FormItem title="Name" require error={formError?.name}>
          <Input
            status={formError?.name && 'error'}
            className={`mdTW:!w-[510px] !mt-[16px] ${isSmallScreen && '!w-[100%]'} `}
            placeholder="Collection name"
            value={protocolInfo.name}
            maxLength={30}
            onChange={handleNameChange}
            onFocus={(e) => elementScrollToView(e.target)}
          />
        </FormItem>
        <FormItem title="Symbol" require description=" Please select the symbol you like.">
          <SelectSearch
            className={`mdTW:w-[510px] !mt-[16px] xlTW:!w-[840px] ${isSmallScreen && '!w-[100%]'} `}
            placeholder="symbol"
            value={protocolInfo.symbol}
            onSelect={handleSelect}
            requestList={handleSearch}
          />
        </FormItem>
        <FormItem
          title="External link"
          error={formError?.externalLink}
          description="You can add an external link, such as your website homepage. ">
          {isSmallScreen ? (
            <TextArea
              className="resize-none !h-[120px] !mt-[16px]"
              placeholder="http://yoursite.io/item/123"
              value={protocolInfo.url}
              maxLength={100}
              onFocus={(e) => elementScrollToView(e.target)}
              onChange={handleExternalChange}></TextArea>
          ) : (
            <Input
              status={formError?.externalLink && 'error'}
              value={protocolInfo.url}
              maxLength={100}
              className={`!mt-[16px] xlTW:!w-[840px]`}
              placeholder="http://yoursite.io/item/123"
              onChange={handleExternalChange}
            />
          )}
        </FormItem>
        <FormItem
          title="Description"
          error={formError?.description}
          description={
            <>
              <span className="color-green2">Markdown</span> syntax is supported (Up to 1,000 characters).
            </>
          }>
          <TextArea
            status={formError?.description && 'error'}
            maxLength={1000}
            className={`!mt-[16px] xlTW:!w-[840px] resize-none !h-[200px]`}
            placeholder="Please provide a detailed description of your collection."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={(e) => elementScrollToView(e.target)}
          />
        </FormItem>
        <FormItem
          require
          title="Blockchain"
          description="Select the blockchain where you'd like new items from this collection to be added.">
          <Select
            disabled
            className={`${style.chain_select} !mt-[16px] !w-full mdTW:!w-[510px]`}
            onChange={(e) => handleProtocolChange(e, 'blockchain')}
            value={protocolInfo.blockchain}>
            {/* {supportChains.map((item) => {
              return <Option key={item}>{item}</Option>;
            })} */}
          </Select>
        </FormItem>
        <FormItem title="Payment tokens" description="Your items can be traded using these tokens.">
          <div className="!mt-[8px] w-[200px] p-[16px] text-[18px] rounded-[12px] bg-[#1b76e21f] flex items-center border	payment-token border-[var(--brand-base)] border-solid text-[var(--text-item)]">
            <ELFSVG width="32px" height="32px" className="mr-[8px]" />
            ELF
            <RequiredSymbol className="flex item-center ml-[8px] "></RequiredSymbol>
          </div>
        </FormItem>
        <FormItem title="Metadata">
          <>
            {metadata.map((item, index) => {
              return (
                <p key={index} className="metadata-row flex items-center mt-[10px]">
                  <Input
                    className="w-[280px] h-[56px] "
                    autoFocus
                    value={item.key}
                    maxLength={100}
                    onFocus={(e) => elementScrollToView(e.target)}
                    onChange={(e) => changeMetadata(e, index, 'key')}
                  />
                  <span className="w-[14px] h-[1px] bg-[--line-box] m-[0px_5px] "></span>
                  <Input
                    className="w-[500px] h-[56px] "
                    value={item.value}
                    maxLength={100}
                    onFocus={(e) => elementScrollToView(e.target)}
                    onChange={(e) => changeMetadata(e, index, 'value')}
                  />
                  <Close
                    className={`w-[16px] ${isSmallScreen && 'w-[36px] mt-[10px]'} h-[16px] ml-[16px] cursor-pointer `}
                    onClick={() => deleteMetadata(index)}
                  />
                </p>
              );
            })}
            {metadata?.length < 10 && (
              <div className={style['add-metadata-btn']} onClick={addMetadata}>
                <AddMetadata />
              </div>
            )}
          </>
        </FormItem>
      </div>
      <div className="submit-wrap border-t border-x-0	border-b-0 border-solid	border-[var(--line-box)] mt-[40px] py-[40px]">
        <Button size="ultra" className="!w-[180px]" disabled={isDisabled} type="primary" onClick={handleCreate}>
          Create
        </Button>
      </div>
      {renderSyncChainModal()}
    </div>
  );
}
