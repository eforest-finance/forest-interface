import { useCallback, useState } from 'react';
import { Upload, message, Image, Skeleton } from 'antd5/';
import type { UploadProps } from 'antd5/';
import { csvToArray } from 'utils/fileToObject';

import UploadArea from './UploadArea';

export interface ItemFromCsv {
  'File Name': string;
  'Token ID': string;
  [key: string]: string;
}

interface UploadMetaProps {
  onChange: (metaList: Array<ItemFromCsv>) => void;
}

const UploadMeta: React.FC<UploadMetaProps> = (props: UploadMetaProps) => {
  const { onChange } = props;
  const [_, setMetaList] = useState<Array<ItemFromCsv>>([]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }

    try {
      const tableArray = await csvToArray(file);
      const keyArray = tableArray[0];
      const keyLength = keyArray.length;
      const list = [];
      for (let i = 1; i < tableArray.length - 1; i++) {
        const col = tableArray[i];
        const item = {} as any;
        for (let ki = 0; ki < keyLength; ki++) {
          item[keyArray[ki]] = col[ki];
        }
        list.push(item);
      }
      console.log('----list----', list);
      setMetaList(list);
      onChange(list);
    } catch (error) {
      console.error(error);
      message.error('File upload failed.');
      //   setTimeout(messageApi.destroy, 0);
    }
  }, []);

  const uploadProps = {
    name: 'File',
    accept: '.csv',
    showUploadList: false,
    multiple: true,
    maxCount: 1,
    action: '',
    beforeUpload(file: File) {
      handleFileUpload(file);
    },
  };

  return (
    <div>
      <UploadArea
        {...uploadProps}
        className="w-[840px] h-[192px] mdl:!w-[840px]"
        title="Drop files here or click to upload"
        subTitle={`Download the template, fill in the corresponding NFT details, and upload. Upon completion, you can select individual NFTs to modify their details.`}
      />
    </div>
  );
};

export default UploadMeta;
