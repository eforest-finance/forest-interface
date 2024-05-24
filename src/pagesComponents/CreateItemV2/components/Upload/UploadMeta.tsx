import { useCallback, useState } from 'react';
import { message } from 'antd5/';
import { csvToArray } from 'utils/fileToObject';
import DownloadIcon from 'assets/images/icons/download.svg';

import UploadArea from './UploadArea';
import { store, useSelector } from 'store/store';

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
  const [fileName, setFileName] = useState('');
  const [, setMetaList] = useState<Array<ItemFromCsv>>([]);
  const { batchFiles } = store.getState().createItem;
  const { csvTemplate } = useSelector((store) => store.aelfInfo.aelfInfo);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }

    setFileName(file.name);
    try {
      const tableArray = await csvToArray(file);
      const keyArray = tableArray[0];
      const keyLength = keyArray.length;
      const list = [];
      for (let i = 1; i < tableArray.length; i++) {
        const col = tableArray[i];
        const item = {} as any;
        for (let ki = 0; ki < keyLength; ki++) {
          item[keyArray[ki]] = col[ki];
        }
        list.push(item);
      }
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
      if (!batchFiles?.length) {
        message.warning('Please upload pictures, audio or video first');
        return;
      }

      handleFileUpload(file);
    },
  };

  return (
    <div>
      <UploadArea
        {...uploadProps}
        className="w-[840px] mdl:h-[192px] mdl:!w-[840px]"
        title="Drop files here or click to upload"
        subTitle={`Download the template, fill in the corresponding NFT details, and upload. Upon completion, you can select individual NFTs to modify their details.`}
      />

      {!!fileName.length && (
        <div className="text-[16px] text-[var(--text-secondary)] pl-[8px]  pt-[8px] leading-[20px]">{fileName}</div>
      )}

      <a
        className=" inline-flex mt-4 gap-x-2 h-12 px-5 py-3 rounded-lg bg-fillHoverBg items-center justify-center "
        href={csvTemplate}
        download>
        <DownloadIcon className=" w-5 h-5 fill-textPrimary" />
        <span className=" text-textPrimary text-base font-medium">Download template</span>
      </a>
      <div className="pt-[8px] text-[var(--error)]">
        {batchFiles?.map((item) => {
          if (item.error) {
            return (
              <div className="pt-[4px]" key={item.url}>
                {item.error}{' '}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default UploadMeta;
