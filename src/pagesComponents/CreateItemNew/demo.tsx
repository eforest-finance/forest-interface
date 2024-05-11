import Upload from './components/Upload/Upload';
import CollectionTag from './components/CollectionTag';

import UploadMeta, { ItemFromCsv } from './components/Upload/UploadMeta';
import { useState } from 'react';
import { store } from 'store/store';

export default () => {
  const { collection, tokenId } = store.getState().createItem;
  console.log(store.getState().createItem);

  const [metaList, setMetaList] = useState<Array<ItemFromCsv>>([]);
  // const handChange = (metaList: Array<ItemFromCsv>) => {
  //   setMetaList(metaList);
  // };
  return (
    <div>
      <Upload metaList={metaList} isBatch />
      {collection && <CollectionTag collectionName={collection.name} src={collection.icon} id={tokenId} />}
      <div className=" leading-[24px] w-[343px]  mdl:w-[480px] text-[16px] font-medium text-[var(--text-secondary)] mt-[16px]">
        You can reupload to replace the media, File types support: JPG,PNG,GIF,MP3,MP4. Max size: 100MB
      </div>
    </div>
  );
};
