import { AIForm } from './components/AIForm';
import { PageTitle } from 'components/PageTitle';
import { CreateStep } from './components/CreateStep';
import { useCreateItemAIPageService } from './hooks/useCreateItemAIPageService';
import ImagePreview from './components/ImagePreview';
import useGeneratePictures, { ICreateArt } from './hooks/useGeneratePictures';
import { useEffect, useState } from 'react';
import Progressing from './components/Progressing';
import Album from './components/Album';
import { message } from 'antd';
import { SingleCreateForm } from 'pagesComponents/CreateItemV2/components/CreateForm/SingleCreateForm';
import { useEditNftInfoService } from './hooks/useEditNftInfoService';
import useGetState from 'store/state/getState';
import { fetchAiImages, fetchTransactionFee, updateAiImagesStatus } from 'api/fetch';
import { dispatch, store } from 'store/store';
import { IAIImage } from 'api/types';
import CollectionTag from 'pagesComponents/CreateItemV2/components/CollectionTag';
import { useMount } from 'react-use';
import { clearNftInfoFormList } from 'store/reducer/create/itemsByAI';
import { useWebLogin } from 'aelf-web-login';

export default function CreateNFTByAIPage() {
  const { isSmallScreen, createStep, nextStep, preStep, optionsForCollection } = useCreateItemAIPageService();
  const { CreateArt } = useGeneratePictures();
  const { nftInfoFormList } = store.getState().createItemAI;
  const { version } = useWebLogin();

  const { walletInfo } = useGetState();

  const [albumImages, setAlbumImages] = useState<IAIImage[]>([]);
  const [unusedImages, setUnusedImages] = useState<IAIImage[]>([]);

  const [albumOpen, setAlbumOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGuessFee, setAiGuessFee] = useState<number>();

  const [selectedId, setSelectedId] = useState<number>(0);
  const {
    initNftInfoFormListByImageArr,
    currentSelNftInfoForm,
    onEditCurrentNFTFormHandler,
    onChangeSetNftInfoFormByIndex,
    onCreateNFTHandler,
  } = useEditNftInfoService({
    collections: optionsForCollection,
  });

  useMount(() => {
    dispatch(clearNftInfoFormList());
  });

  console.log('nftInfoFormList---', nftInfoFormList);

  const fetchUnusedImages = async () => {
    const { items } = await fetchAiImages({ status: 0, address: walletInfo.address });
    if (items.length) {
      setAlbumImages(items);
      setUnusedImages(items);
      setTimeout(() => {
        setAlbumOpen(true);
      }, 50);
    }
  };

  const getGuessFee = async () => {
    const { aiImageFee } = await fetchTransactionFee();
    setAiGuessFee(aiImageFee);
  };

  useEffect(() => {
    if (walletInfo.address) {
      fetchUnusedImages();
    }

    if (version !== 'v2') {
      message.warning('AI NFT Generator only supports V2');
    }

    getGuessFee();
  }, [walletInfo]);

  const handleCreate = async (values: ICreateArt) => {
    console.log(values);

    setIsLoading(true);
    try {
      const images = await CreateArt(values, aiGuessFee || 0);
      if (images?.length) {
        setAlbumImages(images);
        setUnusedImages(images);
        setTimeout(() => {
          setAlbumOpen(true);
        }, 50);
      } else {
        message.error('create fail');
      }
    } catch (error) {
      console.log(error);
      message.error('create fail');
    }
    setIsLoading(false);
  };

  const handleImageChoose = (id: number) => {
    setSelectedId(id);
    console.log('handleImageChoose', id);
    onChangeSetNftInfoFormByIndex(id);
  };

  const onRegenerate = () => {
    preStep();
    setUnusedImages([]);
    setAlbumImages([]);
  };
  const onReSelect = async () => {
    preStep();
    setAlbumImages([...unusedImages]);
    setTimeout(() => {
      setAlbumOpen(true);
    }, 50);
  };

  const renderUploadComp = () => {
    return (
      <>
        <div>
          <ImagePreview
            wrapperClassName={nftInfoFormList && nftInfoFormList.length === 1 ? '!rounded-b-none' : ''}
            items={nftInfoFormList}
            selectedId={selectedId}
            onSelectChange={handleImageChoose}
            onReSelect={onReSelect}
            onRegenerate={onRegenerate}
          />
          {nftInfoFormList && nftInfoFormList.length === 1 && (
            <CollectionTag
              nftName={nftInfoFormList[0].tokenName}
              collectionName={nftInfoFormList[0].collectionName}
              src={nftInfoFormList[0].collectionIcon}
              id={Number(nftInfoFormList[0].tokenId!)}
            />
          )}
        </div>
      </>
    );
  };
  return (
    <section className="max-w-[1360px] !mx-auto !px-4 mb-20">
      <PageTitle title="AI NFT Generator" />

      <div className="flex gap-x-10">
        {isSmallScreen ? null : renderUploadComp()}
        <div className="flex-1 flex flex-col gap-y-8">
          {!isSmallScreen ? null : renderUploadComp()}
          <CreateStep currentStep={createStep} />
          {createStep === 0 ? <AIForm onCreate={handleCreate} aiImageFee={aiGuessFee ?? '--'} /> : null}
          {createStep === 1 ? (
            <SingleCreateForm
              key={selectedId}
              defaultFormValues={currentSelNftInfoForm}
              optionsForCollection={optionsForCollection}
              onCreateHandler={onCreateNFTHandler}
              disabledMainChainCollectionSelect={true}
              onValuesChange={onEditCurrentNFTFormHandler}
            />
          ) : null}
        </div>
      </div>
      <Progressing isModalOpen={isLoading} />
      <Album
        isModalOpen={albumOpen}
        items={albumImages!}
        onConfirm={(items: IAIImage[]) => {
          setAlbumOpen(false);
          initNftInfoFormListByImageArr(items);
          nextStep();
        }}
        onCancel={() => {
          setAlbumOpen(false);
          setAlbumImages([]);
          updateAiImagesStatus({ status: 3, imageList: unusedImages.map((item) => item.hash) }); // abandon all
        }}
      />
    </section>
  );
}
