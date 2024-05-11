import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, message, Image, Skeleton } from 'antd5/';
import type { UploadProps } from 'antd5/';
import { ISingleFile, setBatchFiles, setSingleFile } from 'store/reducer/create/item';

import UploadBatch from './UploadBatch';
import UploadSingle from './UploadSingle';

import { ItemFromCsv } from './UploadMeta';
import { store } from 'store/store';

interface IUploadProps extends UploadProps {
  isDragger?: boolean;
  previewSrc?: string;
  isBatch?: boolean;
  metaList?: Array<ItemFromCsv>;
  onChange?: (file: any) => void;
}

export default (props: IUploadProps) => {
  const { isBatch = true, metaList } = props;
  const handleSingleUploadChange = (uploadFile: ISingleFile) => {
    store.dispatch(setSingleFile(uploadFile));
  };
  const handleBatchUploadChange = (uploadFiles: ISingleFile[]) => {
    console.log('uploadFiles---', uploadFiles);

    store.dispatch(setBatchFiles(uploadFiles));
  };

  return (
    <div>
      {isBatch ? (
        <UploadBatch metaList={metaList} onUploadChange={handleBatchUploadChange} />
      ) : (
        <UploadSingle onUploadChange={handleSingleUploadChange} />
      )}
    </div>
  );
};
