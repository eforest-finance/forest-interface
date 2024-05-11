import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, message, Image, Skeleton, Flex, Button } from 'antd5/';
import type { UploadProps } from 'antd5/';
import AWSManagerInstance from 'utils/S3';
import { cloneDeep } from 'lodash-es';
import { csvToArray, getBase64, getTheFirstFrame } from 'utils/fileToObject';
import { FileUploadType, ImagePlaceHolder } from './UploadSingle';
import UploadArea from './UploadArea';

import UploadIcon from 'assets/images/v2/upload.svg';
import Reload from 'assets/images/v2/refresh.svg';
import Delete from 'assets/images/v2/delete.svg';
import PlayIcon from 'assets/images/v2/play.svg';

import style from './upload.module.css';
import FileView from 'components/FileView/FileView';
import { ItemFromCsv } from './UploadMeta';
import { store } from 'store/store';
import { ISingleFile } from 'store/reducer/create/item';

const { Dragger } = Upload;

export enum acceptFileType {
  picture = 'jpeg,.jpg,.png,.gif',
  media = 'mp3,.mp4',
  all = 'jpeg,.jpg,.png,.gif,.mp3,.mp4',
}

interface Item {
  poster: string;
  file: File;
  src: string;
  url: string;
  tokenId: string;
  fileType: FileUploadType;
  hash: string;
}

interface UploadBatchProps {
  metaList?: Array<ItemFromCsv>;
  onUploadChange?: (fileArray: ISingleFile[]) => void;
}

const MAX_UPLOAD = 30;

export default (props: UploadBatchProps) => {
  const { metaList, onUploadChange } = props;
  const {
    collection: { name },
  } = store.getState().createItem;

  const uploader = useRef<any>(null);
  const task = useRef<number>(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [accept, setAccept] = useState<acceptFileType>(acceptFileType.all);
  const [messageApi, contextHolder] = message.useMessage();
  const [listData, setListData] = useState<Array<Item>>([]);
  const [fileViewVisible, setFileViewVisible] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<Item | undefined>();
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    if (metaList && !!metaList.length) {
      mergeListDataByCsvFile();
    }
  }, [metaList]);

  const mergeListDataByCsvFile = () => {
    if (listData.length < 1) {
      messageApi.open({
        type: 'warning',
        content: 'Please upload pictures, audio or video first',
        duration: 2,
      });
      return;
    }

    setListData((preList) => {
      const newList = preList.map((listItem) => {
        const meta = metaList?.find((metaItem) => metaItem['File Name'] === listItem.file.name);

        if (meta) {
          return {
            ...listItem,
            tokenId: meta['Token ID'],
          };
        } else {
          return listItem;
        }
      });

      return newList;
    });
  };

  const handleFileUpload = useCallback(async (file: File, fileList: Array<File>) => {
    if (file.size > 100 * 1024 * 1024) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }

    const type = file.type.split('/')[0] as unknown as FileUploadType;
    const base64 = await getBase64(file);
    const item = {
      poster: '',
      file,
      src: base64,
      url: '',
      tokenId: '',
      fileType: type,
      hash: '',
    } as Item;

    switch (type) {
      case 'image':
        {
          item.poster = base64;
        }
        break;
      case 'audio':
        break;

      case 'video':
        {
          const poster = await getTheFirstFrame(file);
          item.poster = poster;
        }
        break;

      default:
        break;
    }

    setListData((preState) => {
      return [...preState, item];
    });

    // if (task.current === fileList.length) {
    //   messageApi.open({
    //     type: 'loading',
    //     content: 'Uploading..',
    //     duration: 0,
    //   });
    // }

    try {
      const { url, hash } = await AWSManagerInstance.uploadFile(file);
      task.current--;

      setListData((preState) => {
        const newList = cloneDeep(preState);

        let shouldUpdateItem = newList.find((item) => {
          return item.file.name === file.name;
        });

        if (shouldUpdateItem) {
          shouldUpdateItem.url = url;
          shouldUpdateItem.hash = hash;
        }
        onUploadChange && onUploadChange(newList);

        return newList;
      });

      if (!!!task.current) {
        message.success(`files uploaded successfully.`);
        setTimeout(messageApi.destroy, 0);
      }
    } catch (error) {
      console.error(error);
      message.error('File upload failed.');
      setTimeout(messageApi.destroy, 0);
    }
  }, []);

  const uploadProps = {
    name: 'File',
    accept: accept,
    showUploadList: false,
    multiple: true,
    maxCount: MAX_UPLOAD,
    action: '',
    beforeUpload(file: File, fileList: Array<File>) {
      if (reloadFlag) {
        setListData([]);
        setReloadFlag(false);
      }
      task.current = fileList.length;
      handleFileUpload(file, fileList);
    },
  };

  const UploadButton = useCallback(() => {
    return (
      <div ref={uploader}>
        <p className="ant-upload-drag-icon">
          <UploadIcon />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Formats supported JPG, PNG, GIF, MP3, MP4. Max size 100 MB. Recommend ratio 16:9.
        </p>
      </div>
    );
  }, []);

  const handleReload = () => {
    if (uploader.current) {
      setReloadFlag(true);
      uploader.current.click();
    }
  };

  const handlePlay = (previewItem: Item) => () => {
    debugger;
    setPreviewItem(previewItem);
    setFileViewVisible(true);
  };
  const handleClose = () => {
    setFileViewVisible(false);
    setPreviewItem(undefined);
  };

  console.log('------>', listData, store.getState().createItem);

  return (
    <div>
      <div className={`${style['upload-wrapper-batch']}`}>
        {!!listData.length && (
          <div className="p-[16px] pr-0  border-[1px] border-solid border-[var(--line-border)] rounded-[12px] relative ">
            <div className={`${style['list-wrapper']} overflow-scroll  mdl:h-[448px]`}>
              <Flex wrap gap={8}>
                {listData.map((item, i) => (
                  <div
                    key={`nft-${i}`}
                    className="w-[144px] h-[180px] border-[1px] border-solid border-[var(--line-border)]  rounded-[8px] overflow-hidden relative">
                    <Image.PreviewGroup preview>
                      <Image
                        className="object-contain"
                        wrapperClassName={`${
                          item.fileType !== 'image' && 'bg-[var(--bg-page-gray)]'
                        }  overflow-hidden flex justify-center w-[144px] h-[144px]`}
                        preview={
                          item.fileType === 'image'
                            ? {
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                              }
                            : false
                        }
                        placeholder={ImagePlaceHolder}
                        src={item.poster}
                      />
                    </Image.PreviewGroup>

                    {item.fileType !== 'image' && (
                      <span
                        className="bg-transparent	cursor-pointer absolute top-0 w-[144px] h-[144px]  overflow-hidden flex justify-center items-center"
                        onClick={handlePlay(item)}>
                        <PlayIcon></PlayIcon>
                      </span>
                    )}
                    <div className="text-[12px] text-[var(--text-secondary)] pl-[8px]  pt-[8px] leading-[20px]">
                      <span>{name}</span>
                      <span className="pl-[4px]">{item.tokenId ? `#${item.tokenId}` : ''}</span>
                    </div>
                  </div>
                ))}
              </Flex>
            </div>
          </div>
        )}

        <div className={`${style['upload-drag-wrapper']}`}>
          <Dragger {...uploadProps} className={`rounded-[15.6px] ${listData.length ? 'hidden' : 'inline'}`}>
            <UploadButton />
          </Dragger>
        </div>

        {contextHolder}
        {previewItem && previewItem.fileType !== 'image' && (
          <FileView visible={fileViewVisible} type={previewItem.fileType} src={previewItem.src} onClose={handleClose} />
        )}
      </div>
      {!!listData.length && (
        <>
          {listData.length < MAX_UPLOAD && (
            <UploadArea
              {...uploadProps}
              title="Drag & drop or click to continue upload"
              subTitle={` You can upload ${MAX_UPLOAD - listData.length} more images, video or audio`}
            />
          )}
          <div className="flex items-center  text-[var(--bg-btn)] mt-[16px] cursor-pointer" onClick={handleReload}>
            <Reload className=" mr-[10px]" /> Reupload
          </div>
        </>
      )}
    </div>
  );
};
