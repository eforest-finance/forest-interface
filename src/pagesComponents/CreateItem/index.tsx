'use client';
import { ChangeEvent, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useTimeoutFn, useUnmount, useMount } from 'react-use';
import { useRouter } from 'next/navigation';
import { message, Upload } from 'antd';

import Input, { InputNumber, TextArea } from 'baseComponents/Input';
import { Select, Option } from 'baseComponents/Select';

import clsx from 'clsx';
import FormItem from 'components/FormItem';
import { Item, useCollections } from 'pagesComponents/Collections/Hooks/useCollections';
import AddPicture from 'assets/images/addPicture.svg';

import AElf from 'utils/aelf';
import FileView, { FileType } from 'components/FileView/FileView';

import RequiredSymbol from 'assets/images/required.svg';
import UploadBtn from 'assets/images/icons/upload.svg';
import Preview from 'assets/images/icons/preview.svg';
import Arrow from 'assets/images/arrow.svg';
import AddMetadata from 'assets/images/add.svg';
import Close from 'assets/images/close.svg';
import AudioIcon from 'assets/images/icons/audio.svg';
import VideoIcon from 'assets/images/icons/video.svg';

import style from './style.module.css';
import useGetState from 'store/state/getState';
import { ICreateItemsParams, IIssuerParams } from 'contract/type';
import { useContractConnect } from 'hooks/useContractConnect';

import { CreateNFTSyncChainModal } from 'components/SyncChainModal/CreateNFTSyncChainModal';
import { SupportedELFChainId } from 'constants/chain';
import AWSManagerInstance, { UploadFileType } from 'utils/S3';
import { fetchSymbolHasExisted } from 'api/fetch';
import { externalLinkReg } from 'constants/common';

import { decodeAddress } from 'utils/aelfUtils';
import PageLoading from 'components/PageLoading';
import { elementScrollToView } from 'utils/scrollIntoView';
import BigNumber from 'bignumber.js';
import Modal from 'baseComponents/Modal';
import Button from 'baseComponents/Button';
import { useWalletSyncCompleted, useCheckLoginAndToken } from 'hooks/useWalletSync';
import { useLogoutListener } from 'hooks/useLogoutListener';
import { ExclamationCircleFilled } from '@ant-design/icons';

const NUMBER_MAX = '9007199254740991';
const { base58 } = AElf.utils;

type ItemInfoType = {
  symbol: string;
  owner: string;
  uri: string;
  alias: string;
  quantity: number;
  tokenId: number;
  isBurnable: boolean;
  tokenName?: string;
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
  owner?: {
    msg: string;
  };
  tokenId?: {
    msg: string;
  };
  quantity?: {
    msg: string;
  };
};

enum UploadType {
  File = 'File',
  PreviewImage = 'PreviewImage',
}

type FileUploadType = 'image' | 'video' | 'audio';

export default function CreateItem() {
  const [fileViewVisible, setFileViewVisible] = useState(false);
  const nav = useRouter();

  const getList = useCollections('address', true);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  const { infoState, supportChains = [], walletInfo, aelfInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const address = walletInfo?.address;

  const [item, setItem] = useState<string>('');
  const [itemFile, setItemFile] = useState<File>();
  const [uploadFile, setUploadFile] = useState<UploadFileType>({
    url: '',
    hash: '',
  });
  const [previewImageUrl, setPreviewImageUrl] = useState<string>();
  const [previewImageLoading, setPreviewImageLoading] = useState<boolean>(false);

  const [fileType, setFileType] = useState<FileUploadType>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(-1);

  const [modalState, setModalState] = useState({
    isVisible: false,
    isError: false,
    isFinished: false,
  });

  const [protocols, setProtocols] = useState<Item[]>([]);
  const [protocolItem, setProtocolItem] = useState<Item>();

  const [ownerType, setOwnerType] = useState('myself');
  const [metadata, setMetadata] = useState<{ key: string; value: string }[]>([]);
  const [description, setDescription] = useState('');
  const [hasPath, setPath] = useState(false);
  const [itemInfo, setItemInfo] = useState<Partial<ItemInfoType> | undefined>({ quantity: 1 });
  const [isDisabled, setIsDisabled] = useState(false);
  const [formError, setFormError] = useState<FormErrorType>();

  const unMounted = useRef<boolean>(false);

  const { getAccountInfoSync } = useWalletSyncCompleted();
  const { isLogin, login } = useCheckLoginAndToken();

  useEffect(() => {
    if (!getList) return;
    getList('all', 0, 100, (res: Item[]) => {
      if (!res?.length) {
        setModalVisible(true);
      } else {
        setProtocols(res);
      }
    });
  }, [getList, state, state?.chainId, state?.symbol]);

  useMount(() => {
    document.body.scrollTop = 0;
  });
  useUnmount(() => {
    message.destroy();
    unMounted.current = true;
  });

  const FileBox = useMemo(() => {
    const type = itemFile?.type || '';
    return (
      <div className="upload-item-card mt-[24px] text-[14px] text-[--color-primary] font-medium	 rounded-[12px] flex flex-col">
        <div
          className={`${style['upload-item']}`}
          onClick={() => {
            isSmallScreen && setFileViewVisible(true);
          }}>
          {type?.includes('image') ? (
            <img src={item} alt="item" className="w-full h-full object-cover" />
          ) : type.includes('audio') ? (
            <AudioIcon />
          ) : (
            <VideoIcon />
          )}
          {isSmallScreen || (
            <div
              className="preview w-full h-full hidden absolute bg-[rgba(0,0,0,.6)] hover:flex"
              onClick={() => setFileViewVisible(true)}>
              <Preview />
            </div>
          )}
        </div>
        <FileView
          visible={fileViewVisible}
          type={type.split('/')[0] as FileType}
          src={item}
          onClose={() => setFileViewVisible(false)}
        />
        {itemFile?.name}
      </div>
    );
  }, [fileViewVisible, isSmallScreen, item, itemFile?.name, itemFile?.type]);

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

  const getBase64 = useCallback((img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }, []);

  const beforeUpload = async (e: File, type: UploadType) => {
    if (e.size > 100 * 1024 * 1024) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }

    message.loading('Uploading...', 0);

    if (type === UploadType.File) {
      try {
        const fileType = e.type.split('/')[0] as FileUploadType;
        if (fileType !== 'audio' && fileType !== 'video') {
          setPreviewImageLoading(false);
          setPreviewImageUrl(undefined);
        }
        setFileType(fileType);
      } catch (error) {
        console.log(error);
      }

      if (['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4', 'audio/mpeg'].includes(e.type)) {
        setFileLoading(true);
        getBase64(e, (imageUrl: SetStateAction<string>) => {
          setItem(imageUrl);
          setItemFile(e);
        });

        const uploadFile = await AWSManagerInstance.uploadFile(e);
        if (unMounted.current) return;

        setUploadFile(uploadFile);
        message.destroy();
        message.success(`${e.name} file uploaded successfully.`);
        setFileLoading(false);

        return Upload.LIST_IGNORE;
      } else {
        message.destroy();
        message.error(`File upload failed. The supported formats are JPG, PNG, GIF, MP4 and MP3`);
        return Upload.LIST_IGNORE;
      }
    } else {
      if (['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(e.type)) {
        setPreviewImageLoading(true);

        const uploadFile = await AWSManagerInstance.uploadFile(e);
        if (unMounted.current) return;
        setPreviewImageUrl(uploadFile.url);
        message.destroy();
        message.success(`${e.name} file uploaded successfully.`);
        setPreviewImageLoading(false);
      } else {
        message.destroy();
        message.error('File upload failed. The supported formats are JPG, PNG and GIF');
        return Upload.LIST_IGNORE;
      }
    }
  };

  const handleTokenIdChange = (value: number | null) => {
    const id = value === null ? undefined : value;
    updateErrorState('tokenId', undefined);

    handleItemChange(id, 'tokenId');
  };

  const handleCollectionChange = (symbol: string) => {
    try {
      const collectionItem = protocols.find((item) => item.symbol === symbol);
      setProtocolItem(collectionItem);
      handleItemChange(collectionItem?.symbol, 'symbol');
      handleItemChange('', 'tokenId'); // clear tokenId when change collection
    } catch (error) {
      console.error('handleCollectionChange error', error);
    }
  };

  const updateErrorState = (key: string, msg: string | undefined) => {
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event?.target as HTMLInputElement).value;
    const trimName = value.trim();
    if (trimName?.length && !/^[A-Za-z0-9]+$/.test(trimName)) {
      updateErrorState('name', 'Invalid name. Please enter only letters and numbers.');
    } else {
      updateErrorState('name', undefined);
    }
    handleItemChange(trimName, 'alias');
  };

  const handleExternalChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = (event?.target as HTMLInputElement).value;
    const trimText = value.trim();
    if (trimText?.length && !externalLinkReg.test(trimText)) {
      updateErrorState('externalLink', 'Invalid external link.');
    } else {
      updateErrorState('externalLink', undefined);
    }
    handleItemChange(trimText, 'uri');
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = (event?.target as HTMLInputElement).value;
    const trimText = value.trim();

    const bigValue = new BigNumber(trimText);

    if (bigValue.isZero() || !trimText) {
      updateErrorState('quantity', 'Please enter a number greater than 1.');
      handleItemChange(trimText, 'quantity');
      return;
    } else {
      if (bigValue.gt(new BigNumber(NUMBER_MAX))) {
        updateErrorState('quantity', 'Maximum limit exceeded for creating NFT items. Please enter a smaller number.');
        handleItemChange(trimText, 'quantity');
        return;
      }
    }
    updateErrorState('quantity', undefined);
    handleItemChange(bigValue.integerValue().abs().toString(), 'quantity');
  };

  const handleItemChange = (
    e: string | number | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | undefined,
    type: keyof ItemInfoType,
  ) => {
    let value: string | number;
    if (typeof e === 'object') {
      value = (e as ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>).target.value;
    } else {
      value = e as string | number;
    }

    setItemInfo((v) => {
      if (v) {
        return { ...v, [type]: value };
      } else {
        return { [type]: value } as unknown as ItemInfoType;
      }
    });
  };

  const formValidation = () => {
    const isRequired =
      !!itemInfo?.alias?.length &&
      itemInfo?.quantity &&
      itemInfo.quantity > 0 &&
      !!itemFile &&
      !!itemInfo?.tokenId &&
      !!itemInfo?.symbol &&
      !fileLoading &&
      !previewImageLoading &&
      !error &&
      (ownerType === 'other' ? !!itemInfo.owner : true);

    console.log('formValidation', isRequired);

    if (formError) {
      const keys = Object.keys(formError);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const item = formError[key as keyof FormErrorType];

        if (item) {
          return false;
        }
      }
    }

    if (fileType === 'audio' || fileType === 'video') {
      if (previewImageUrl) return isRequired;
      return false;
    }

    return isRequired;
  };

  useEffect(() => {
    const disable = !formValidation();
    setIsDisabled(disable);
  }, [itemFile, itemInfo, ownerType, error, fileLoading, previewImageLoading, fileType]);

  const getCollectionSymbolPrefix = (symbol: string) => {
    try {
      const symbolPrefix = symbol.split('-')[0];
      return symbolPrefix;
    } catch (error) {
      console.log('getCollectionSymbolPrefix error', error);
      return '';
    }
  };

  const getSymbolByTokenId = (tokenId: number) => {
    if (itemInfo?.symbol) {
      const symbolPrefix = getCollectionSymbolPrefix(itemInfo.symbol);
      const symbol = `${symbolPrefix}-${tokenId}`;
      return symbol;
    } else {
      return '';
    }
  };

  const [createParamsData, setCreateParamsData] = useState<{
    createParams?: ICreateItemsParams;
    issuerParams?: IIssuerParams;
    proxyIssuerAddress?: string;
    skipChainSync?: boolean;
  }>({});

  const canSkipChainSync = () => {
    return !protocolItem.isMainChainCreateNFT;
  };

  const handleCreate = async () => {
    login({
      callBack: async () => {
        const symbol = getSymbolByTokenId(itemInfo!.tokenId!);
        const { exist } = await fetchSymbolHasExisted({ symbol });
        if (exist) {
          message.error('This token ID has been taken');
          setLoading(false);
          updateErrorState('tokenId', 'This token ID has been taken');
          return;
        }

        const proxyIssuerAddress = protocolItem?.proxyIssuerAddress || '';
        const proxyOwnerAddress = protocolItem?.proxyOwnerAddress || '';

        const to = ownerType === 'myself' ? address : itemInfo?.owner;
        const issueChainId = protocolItem?.issueChainId;
        const params: ICreateItemsParams = {
          symbol,
          tokenName: itemInfo!.alias!,
          decimals: 0,
          to,
          issuer: proxyIssuerAddress,
          owner: proxyOwnerAddress,
          isBurnable: true,
          issueChainId,
          totalSupply: itemInfo!.quantity!,
          memo: '3',
          externalInfo: {
            value: {
              __nft_description: description,
              __nft_file_url: uploadFile?.url,
              __nft_file_hash: uploadFile?.hash,
              __nft_external_link: itemInfo!.uri!,
              __nft_fileType: fileType!,
              __nft_metadata: JSON.stringify(metadata),
              __nft_preview_image: previewImageUrl,
            },
          },
        };

        setCreateParamsData({
          createParams: params,
          issuerParams: {
            symbol,
            amount: itemInfo!.quantity!,
            memo: '3',
            to: to!,
          },
          proxyIssuerAddress,
          skipChainSync: canSkipChainSync(),
        });
        setModalState((preState) => {
          return {
            ...preState,
            isVisible: true,
          };
        });
      },
    });
  };

  useLogoutListener();

  if (!isLogin) {
    return <PageLoading />;
  }

  const renderSyncChainModal = () => {
    if (!modalState.isVisible) return null;

    const collectionSymbol = itemInfo?.symbol;

    const successUrl = state?.usr?.protocolId ? `/explore-items/${state?.usr?.protocolId}` : `/account#Created`;

    return (
      <CreateNFTSyncChainModal
        // ref={(ref) => (syncChainModalRef.current = ref)}
        visible={modalState.isVisible}
        isError={modalState.isError}
        title={'Create an Item'}
        logoImage={previewImageUrl || uploadFile?.url}
        tokenName={itemInfo?.alias}
        collectionName={collectionSymbol}
        createParamsData={createParamsData}
        isFinished={modalState.isFinished}
        successUrl={successUrl}
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
        }}></CreateNFTSyncChainModal>
    );
  };

  return (
    <div
      className={clsx(
        'create-item',
        isSmallScreen && `${style.mobile_create_protocol} p-[0_16px]`,
        'm-[0_auto] mdTW:p-[0_40px] max-w-[1280px]',
        style.wrapper,
      )}>
      <Modal
        className={style['create-collection-tip-modal']}
        closable={false}
        title="   "
        open={modalVisible}
        footer={
          <Button className="!w-[256px]" size="ultra" onClick={() => nav.push('/create-collection')} type="primary">
            Go to create{timer > 0 ? <span>&nbsp;({timer}s)</span> : ''}
          </Button>
        }>
        <div className="flex items-center">
          <ExclamationCircleFilled className={style['warning-icon']} />
          <span>Please create a collection before creating an item</span>
        </div>
      </Modal>
      <div className={clsx('top', hasPath && 'has-path')}>
        <h1
          className={`font-semibold	leading-[48px] pt-[40px] mdTW:pt-[80px] pb-[24px] mdTW:pb-[40px] text-[var(--color-primary)] !mb-0 text-[30px] mdTW:text-[40px]`}>
          Create New Item
        </h1>
        <p className="tip flex items-center !mb-[16px] mdTW:!mb-[24px]">
          <RequiredSymbol className="h-full flex item-center text-[var(--red1)] "></RequiredSymbol>
          <span className="tip-text ml-[4px] text-[var(--text2)] text-[14px] leading-[21px]">Required fields</span>
        </p>
      </div>
      <div className="form">
        <FormItem
          title="File"
          require
          description={
            <>
              <span>File types supported: JPG, PNG, GIF, MP3, MP4. Max size: 100MB</span>
            </>
          }>
          <>
            <Upload
              name="File"
              accept=".jpeg,.jpg,.png,.gif,.mp4,.mp3"
              action={''}
              listType="picture-card"
              className={style['item-uploader']}
              disabled={fileLoading}
              beforeUpload={(e) => beforeUpload(e, UploadType.File)}
              showUploadList={false}>
              <UploadBtn />
            </Upload>
            {!!item && FileBox}
          </>
        </FormItem>

        {fileType === 'audio' || fileType === 'video' ? (
          <FormItem
            title="Thumbnail"
            require
            description="Because multimedia files are used for this item, please add a thumbnail image (PNG, JPG, or JPEG) for better display.">
            <Upload
              accept=".jpeg,.jpg,.png,"
              name="Preview"
              action={'/'}
              beforeUpload={(e) => beforeUpload(e, UploadType.PreviewImage)}
              listType="picture-card"
              className={`${style.featured_uploader} mt-[16px]`}
              disabled={fileLoading}
              showUploadList={false}>
              <div className="feature flex-center">
                {previewImageUrl ? <img src={previewImageUrl} alt="featured" className="w-full" /> : <AddPicture />}
              </div>
            </Upload>
          </FormItem>
        ) : null}

        <FormItem title="Name" require error={formError?.name}>
          <Input
            status={formError?.name && 'error'}
            className={`${isSmallScreen && '!w-[100%]'} mdTW:!w-[510px] !mt-[16px]`}
            placeholder="Item name"
            value={itemInfo?.alias}
            maxLength={30}
            onFocus={(e) => elementScrollToView(e.target)}
            onChange={handleNameChange}
          />
        </FormItem>
        <FormItem
          title="External link"
          error={formError?.externalLink}
          description="You can add an external link, such as your website homepage. It will be visible on the item detail page, allowing users to click and access additional information.">
          {isSmallScreen ? (
            <TextArea
              status={formError?.externalLink && 'error'}
              className={`w-full !h-[120px] !mt-[16px] resize-none`}
              placeholder="http://yoursite.io/item/123"
              value={itemInfo?.uri}
              maxLength={100}
              onFocus={(e) => elementScrollToView(e.target)}
              onChange={handleExternalChange}
            />
          ) : (
            <Input
              allowClear
              status={formError?.externalLink && 'error'}
              className={`w-full !mt-[16px] xlTW:!w-[840px]`}
              placeholder="http://yoursite.io/item/123"
              value={itemInfo?.uri}
              maxLength={100}
              onChange={handleExternalChange}
            />
          )}
        </FormItem>
        <FormItem
          title="Description"
          description="The description will appear on the item detail page below its image. Markdown syntax is supported (Up to 1,000 characters).">
          <TextArea
            maxLength={1000}
            className="w-full xlTW:!w-[840px] !h-[200px] mdTW:!h-[128px] !mt-[16px] resize-none	"
            placeholder="Please provide a detailed description of your item."
            value={description}
            onFocus={(e) => elementScrollToView(e.target)}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormItem>
        <FormItem title="Collection" description="This is the collection where your item will appear." require>
          <Select
            className={`${style.protocol_select} ${isSmallScreen ? '!w-full' : 'w-[510px]'}`}
            value={protocolItem?.tokenName}
            optionLabelProp="label"
            getPopupContainer={(v) => v}
            onChange={handleCollectionChange}>
            {protocols.map((item) => (
              <Option key={`${item.id}`} value={item.symbol} label={getCollectionSymbolPrefix(item.symbol)}>
                {item.logoImage ? (
                  <img
                    className="mr-8 w-[24px] h-[24px] rounded-[50%] option-icon border"
                    src={item.logoImage}
                    alt=""
                  />
                ) : (
                  <p className="option-icon border" />
                )}
                {item?.tokenName}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          title="Token ID"
          error={formError?.tokenId}
          description="Token ID is the unique identifier for an item within a collection. Please select a numeric ID for your token."
          require>
          <InputNumber
            status={formError?.tokenId && 'error'}
            className={`${isSmallScreen ? '!w-full !mt-[11.5px]' : '!w-[510px] !mt-[16px]'} ${
              style['token-id']
            } hover-color`}
            placeholder="Token ID"
            controls={false}
            value={itemInfo?.tokenId}
            max={999999}
            min={1}
            onFocus={(e) => elementScrollToView(e.target)}
            onChange={handleTokenIdChange}
          />
        </FormItem>
        <FormItem
          title="Quantity"
          require
          error={formError?.quantity}
          description="The number of items that can be created. ">
          <Input
            onKeyDown={(e) => {
              /\d|\.|Backspace|ArrowRight|ArrowLeft|ArrowUp|ArrowDown/.test(e.key) || e.preventDefault();
            }}
            status={formError?.quantity && 'error'}
            className={`${isSmallScreen ? '!w-full !mt-[11.5px]' : '!w-[510px] !mt-[16px]'}`}
            placeholder="Quantity"
            value={itemInfo?.quantity}
            onChange={handleQuantityChange}
          />
        </FormItem>
        <FormItem title="Blockchain">
          <Select
            className={`${isSmallScreen ? '!w-full mt-[16px]' : '!w-[510px] mt-[8px]'}`}
            disabled
            value={aelfInfo?.curChain}>
            {supportChains.map((item) => {
              return <Option key={item}>{item}</Option>;
            })}
          </Select>
        </FormItem>
        <FormItem title="Owner">
          <>
            <div className="mt-[8px] flex !w-full max-w-[840px]">
              <Select
                className="!w-full mdTW:!w-[280px]"
                suffixIcon={<Arrow />}
                value={ownerType}
                getPopupContainer={(v) => v}
                onChange={(e) => {
                  setOwnerType(e);
                  setItemInfo((v) => {
                    if (v) return { ...v, owner: '' };
                    return undefined;
                  });
                  setError(false);
                }}>
                <Option key="myself">Myself</Option>
                <Option key="other">Other</Option>
              </Select>
              {ownerType === 'other' && !isSmallScreen && (
                <>
                  <Input
                    className={clsx(
                      isSmallScreen && '!w-[100%] mt-[11.5px] !ml-0',
                      'flex-1	 ml-[16px]',
                      error && 'error !text-[--red1] !border-[--red1] hover:shadow-none',
                    )}
                    placeholder="Address"
                    value={itemInfo?.owner}
                    onFocus={(e) => elementScrollToView(e.target)}
                    onChange={(e) => {
                      handleItemChange(e, 'owner');
                      if (decodeAddress(e.target.value)) {
                        setError(false);
                      } else {
                        setError(true);
                      }
                    }}
                    onBlur={() => {
                      if (itemInfo?.owner && decodeAddress(itemInfo?.owner)) {
                        setError(false);
                      } else {
                        setError(true);
                      }
                    }}
                  />
                  {error && (
                    <p className="error-tip font-medium flex items-center justify-center text-[--red1] ml-[12px] ">
                      Invalid address
                    </p>
                  )}
                </>
              )}
            </div>
            {ownerType === 'other' && isSmallScreen && (
              <div className="mt-[8px] flex w-full">
                <Input
                  className={clsx(
                    isSmallScreen && '!w-[100%] mt-[11.5px] !ml-0',
                    'flex-1	 ml-[16px]',
                    error && 'error !text-[--red1] !border-[--red1] hover:shadow-none',
                  )}
                  placeholder="Address"
                  value={itemInfo?.owner}
                  onFocus={(e) => elementScrollToView(e.target)}
                  onChange={(e) => {
                    handleItemChange(e, 'owner');
                    if (decodeAddress(e.target.value)) {
                      setError(false);
                    } else {
                      setError(true);
                    }
                  }}
                  onBlur={() => {
                    if (itemInfo?.owner && decodeAddress(itemInfo?.owner)) {
                      setError(false);
                    } else {
                      setError(true);
                    }
                  }}
                />

                {error && (
                  <p className="error-tip font-medium flex items-center justify-center text-[--red1] ml-[12px] ">
                    Invalid address
                  </p>
                )}
              </div>
            )}
          </>
        </FormItem>
        <FormItem title="Metadata">
          <>
            {metadata.map((item, index) => {
              return (
                <p key={index} className="metadata-row p-[8px_0] flex items-center">
                  <Input
                    className="w-[280px]"
                    autoFocus
                    value={item.key}
                    maxLength={50}
                    onFocus={(e) => elementScrollToView(e.target)}
                    onChange={(e) => changeMetadata(e, index, 'key')}
                  />
                  <span className="w-[14px] h-px m-[0_5px] bg-[--line-box]"></span>
                  <Input
                    className="w-[280px]"
                    value={item.value}
                    maxLength={50}
                    onFocus={(e) => elementScrollToView(e.target)}
                    onChange={(e) => changeMetadata(e, index, 'value')}
                  />
                  <Close
                    className="w-[24px] h-[24px] ml-[16px] cursor-pointer "
                    onClick={deleteMetadata.bind(null, index)}
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
      <div className="submit-wrap  border-t border-x-0	border-b-0 border-solid	border-[var(--line-box)] mt-[40px] py-[40px]">
        <Button
          className="!w-[180px]"
          //loading={loading}
          disabled={isDisabled}
          type="primary"
          size="ultra"
          onClick={handleCreate}>
          Create
        </Button>
      </div>
      {renderSyncChainModal()}
    </div>
  );
}
