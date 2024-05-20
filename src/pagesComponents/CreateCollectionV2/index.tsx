import Upload from 'pagesComponents/CreateItemV2/components/Upload/UploadSingle';
import { useCreateCollectionPageService } from './hooks/useCreateCollectionPageService';
import BackIcon from 'assets/images/icons/back.svg';
import { CreateForm } from './components/CreateForm';
import SyncChainModal from 'components/SyncChainModal';
import styles from '../CreateItemV2/components/Upload/upload.module.css';

export default function CreateCollectionPage() {
  const { isSmallScreen, onBackHandler, onCreateHandler, modalState, setModalState, createParamsData, setUploadFile } =
    useCreateCollectionPageService();

  const renderUploadComp = () => {
    return (
      <div className="mb-8">
        <Upload onUploadChange={setUploadFile} wrapperClassName={styles['upload-single-no-bottom']} />
        <div className="w-[343px] mdl:w-[480px] text-base text-textSecondary mt-4">
          File types support: JPG,PNG,GIF. Max size: 100MB
        </div>
      </div>
    );
  };

  const renderSyncChainModal = () => {
    if (!modalState.isVisible) return null;

    return (
      <SyncChainModal
        visible={modalState.isVisible}
        isError={modalState.isError}
        title={'Create a Collection'}
        logoImage={modalState.logoImage}
        tokenName={modalState.tokenName}
        seed={modalState.seed}
        createParamsData={createParamsData}
        isFinished={modalState.isFinished}
        successUrl="/my-collections"
        onFinished={() => {
          console.log(modalState.isVisible);
          setModalState((pre: any) => ({
            ...pre,
            isVisible: false,
            isError: false,
            isFinished: false,
          }));
        }}
      />
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
        Create a collection
      </h1>

      <div className="flex gap-x-10">
        {isSmallScreen ? null : renderUploadComp()}
        <div className="flex-1 flex flex-col ">
          {!isSmallScreen ? null : renderUploadComp()}
          <CreateForm onCreateHandler={onCreateHandler} />
        </div>
      </div>
      {renderSyncChainModal()}
    </section>
  );
}
