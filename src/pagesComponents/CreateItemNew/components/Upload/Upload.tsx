import type { UploadProps } from 'antd5/';
import { ISingleFile, setBatchFiles, setSingleFile } from 'store/reducer/create/item';

import UploadBatch from './UploadBatch';
import UploadSingle from './UploadSingle';

import { ItemFromCsv } from './UploadMeta';
import { store } from 'store/store';
import style from './upload.module.css';

interface IUploadProps extends UploadProps {
  isDragger?: boolean;
  previewSrc?: string;
  isBatch?: boolean;
  metaList?: Array<ItemFromCsv>;
  onChange?: (file: any) => void;
}

export default (props: IUploadProps) => {
  const { collection } = store.getState().createItem;
  const { isBatch = true, metaList } = props;
  const handleSingleUploadChange = (uploadFile: ISingleFile) => {
    store.dispatch(setSingleFile(uploadFile));
  };
  const handleBatchUploadChange = (uploadFiles: ISingleFile[]) => {
    store.dispatch(setBatchFiles(uploadFiles));
  };

  return (
    <div className="mdl:mt-0 mt-[32px]">
      {isBatch ? (
        <UploadBatch metaList={metaList} onUploadChange={handleBatchUploadChange} />
      ) : (
        <UploadSingle
          wrapperClassName={`${!collection ? style['upload-single-no-bottom'] : ''}`}
          onUploadChange={handleSingleUploadChange}
        />
      )}
    </div>
  );
};
