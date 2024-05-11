import { useCreateItemPageService } from './hooks/useCreateItemPageService';
import BackIcon from 'assets/images/icons/back.svg';
import { CreateSegmented } from './components/Segmented';

import { SingleCreateForm } from './components/CreateForm/SingleCreateForm';
import { BatchCreateForm } from './components/CreateForm/BatchCreateForm';
import { CreateNFTSyncChainModal } from 'components/SyncChainModal/CreateNFTSyncChainModal';
import Upload from './components/Upload/Upload';
import CollectionTag from './components/CollectionTag';
import { useSelector } from 'store/store';
import { SegmentedValue } from 'antd/lib/segmented';

import { useState } from 'react';

export default function CreateNFTItemPage() {
  const {
    isSmallScreen,
    onBackHandler,
    createType,
    onCreateTypeChange,
    optionsForCollection,
    modalState,
    setModalState,
    createParamsData,
    onCreateHandler,

    metaList,
    setMetaList,

    onBatchCreateHandler,
    batchCreateLoading,
  } = useCreateItemPageService();

  const { collection, tokenId, nftName, singleFile, batchFiles } = useSelector((store) => store.createItem);
  const [type, setType] = useState<SegmentedValue>('single');

  const renderSyncChainModal = () => {
    if (!modalState.isVisible) return null;

    const successUrl = '/account#Created';

    return (
      <CreateNFTSyncChainModal
        visible={modalState.isVisible}
        isError={modalState.isError}
        title={'Create an Item'}
        logoImage={singleFile?.url || ''}
        tokenName={modalState.tokenName}
        collectionName={modalState.collectionSymbol}
        createParamsData={createParamsData}
        isFinished={modalState.isFinished}
        successUrl={successUrl}
        onFinished={() => {
          console.log(modalState.isVisible);
          setModalState({
            isVisible: false,
            isError: false,
            isFinished: false,
            tokenName: '',
            collectionSymbol: '',
          });
        }}></CreateNFTSyncChainModal>
    );
  };

  const renderUploadComp = () => {
    const props =
      createType === 'single'
        ? {
            isBatch: false,
          }
        : {
            metaList,
            isBatch: true,
          };

    return (
      <div>
        <Upload {...props} />
        {collection && createType === 'single' && (
          <CollectionTag
            nftName={nftName}
            collectionName={collection.tokenName}
            src={collection.logoImage}
            id={tokenId}
          />
        )}
        <div className=" leading-[24px] w-[343px]  mdl:w-[480px] text-[16px] font-medium text-[var(--text-secondary)] mt-[16px]">
          File types support: JPG,PNG,GIF. Max size: 100MB
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-[1360px] !mx-auto !px-4 mb-20">
      <h1
        className={`flex gap-4 font-semibold text-2xl mdl:text-5xl pt-10 mdTW:pt-12 pb-6 mdTW:pb-10 text-textPrimary !mb-0`}>
        <span
          className="flex items-center justify-center w-8 h-8 mdl:w-12 mdl:h-12 rounded-full bg-fillHoverBg cursor-pointer"
          onClick={onBackHandler}>
          <BackIcon className=" fill-textPrimary" />
        </span>
        {type === 'single' ? 'Create an item' : 'Create Items'}
      </h1>
      <div className="flex gap-x-10">
        {isSmallScreen ? null : renderUploadComp()}
        <div className="flex-1 ">
          <CreateSegmented
            value={createType}
            onChange={(value: SegmentedValue) => {
              onCreateTypeChange(value);
              setType(value);
            }}
          />

          {!isSmallScreen ? null : renderUploadComp()}

          {createType === 'single' ? (
            <SingleCreateForm optionsForCollection={optionsForCollection} onCreateHandler={onCreateHandler} />
          ) : (
            <BatchCreateForm
              metadataList={metaList}
              optionsForCollection={optionsForCollection}
              onCreateHandler={onBatchCreateHandler}
              onChangeMetaList={setMetaList}
              createLoading={batchCreateLoading}
            />
          )}
        </div>
      </div>
      {renderSyncChainModal()}
    </section>
  );
}
