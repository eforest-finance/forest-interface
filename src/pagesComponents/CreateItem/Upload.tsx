import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, message, Image, Skeleton } from 'antd5/';
import type { UploadProps } from 'antd5/';

import UploadBatch from './UploadBatch';
import UploadSingle from './UploadSingle';

import { ItemFromCsv } from './UploadMeta';

interface IUploadProps extends UploadProps {
  isDragger?: boolean;
  previewSrc?: string;
  isBatch?: boolean;
  metaList?: Array<ItemFromCsv>;
  onChange?: (file: any) => void;
}

export default (props: IUploadProps) => {
  const { isBatch = true, metaList } = props;

  return <div>{isBatch ? <UploadBatch metaList={metaList} /> : <UploadSingle />}</div>;
};
