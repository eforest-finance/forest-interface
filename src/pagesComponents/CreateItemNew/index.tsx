import { useCreateItemPageService } from './hooks/useCreateItemPageService';
import BackIcon from 'assets/images/icons/back.svg';
import { CreateSegmented } from './components/Segmented';

import { SingleCreateForm } from './components/CreateForm/SingleCreateForm';
import { BatchCreateForm } from './components/CreateForm/BatchCreateForm';
import { CreateNFTSyncChainModal } from 'components/SyncChainModal/CreateNFTSyncChainModal';
import { AWSUpload } from './components/Upload';

export default function CreateNFTItemPage() {
  const {
    isSmallScreen,
    onBackHandler,
    createType,
    setCreateType,
    optionsForCollection,
    modalState,
    setModalState,
    createParamsData,
    onCreateHandler,
    setFileImage,
    fileImage,

    onBatchCreateHandler,
  } = useCreateItemPageService();

  const renderSyncChainModal = () => {
    if (!modalState.isVisible) return null;

    const successUrl = '/account#Created';

    return (
      <CreateNFTSyncChainModal
        // ref={(ref) => (syncChainModalRef.current = ref)}
        visible={modalState.isVisible}
        isError={modalState.isError}
        title={'Create an Item'}
        logoImage={fileImage.url}
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

  return (
    <section className="max-w-[1360px] !mx-auto !px-4 mb-20">
      <h1
        className={`flex gap-4 font-semibold text-2xl mdl:text-5xl pt-10 mdTW:pt-20 pb-6 mdTW:pb-10 text-textPrimary !mb-0`}>
        <span
          className="flex items-center justify-center w-8 h-8 mdl:w-12 mdl:h-12 rounded-full bg-fillHoverBg cursor-pointer"
          onClick={onBackHandler}>
          <BackIcon className=" fill-textPrimary" />
        </span>
        Create an item
      </h1>
      <div className="flex gap-x-10">
        {isSmallScreen ? null : (
          <div className=" w-[480px] h-[480px] bg-fillCardBg">
            <AWSUpload onChange={setFileImage} />
          </div>
        )}
        <div className="flex-1 ">
          <CreateSegmented value={createType} onChange={setCreateType} />

          {!isSmallScreen ? null : (
            <div className=" w-full aspect-square bg-fillCardBg mt-8">
              <AWSUpload onChange={setFileImage} />
            </div>
          )}

          {createType === 'single' ? (
            <SingleCreateForm optionsForCollection={optionsForCollection} onCreateHandler={onCreateHandler} />
          ) : (
            <BatchCreateForm optionsForCollection={optionsForCollection} onCreateHandler={onBatchCreateHandler} />
          )}
        </div>
      </div>

      {renderSyncChainModal()}
    </section>
  );
}
