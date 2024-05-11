import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, message, Image, Skeleton } from 'antd5/';
import type { UploadProps } from 'antd5/';
import AWSManagerInstance from 'utils/S3';

import { csvToArray, getBase64, getTheFirstFrame } from 'utils/fileToObject';
const { Dragger } = Upload;

import style from './upload.module.css';

import UploadIcon from 'assets/images/v2/upload.svg';
import Reload from 'assets/images/v2/refresh.svg';
import Delete from 'assets/images/v2/delete.svg';
import PlayIcon from 'assets/images/v2/play.svg';
import FileView from 'components/FileView/FileView';
import { ISingleFile } from 'store/reducer/create/item';

enum acceptFileType {
  picture = 'jpeg,.jpg,.png,.gif',
  // media = 'mp3,.mp4',
  // all = 'jpeg,.jpg,.png,.gif,.mp3,.mp4',
}

export type FileUploadType = 'image' | 'video' | 'audio';

interface IUploadProps extends UploadProps {
  isDragger?: boolean;
  previewSrc?: string;
  wrapperClassName?: string;
  onUploadChange?: (file: ISingleFile) => void;
}

type ImageInfoType = {
  url?: string;
  file?: File | null;
  hash?: string;
  preview?: string;
};

export const ImagePlaceHolder = <Skeleton.Image active={true} className={'!w-full !h-full'}></Skeleton.Image>;

export default (props: IUploadProps) => {
  const { isDragger = true, onUploadChange, previewSrc, wrapperClassName } = props;
  const uploader = useRef<any>(null);

  const [s3File, setS3File] = useState<ImageInfoType>({
    url: '',
    hash: '',
    file: null,
    preview: '',
  });

  const [previewImage, setPreviewImage] = useState<string | undefined>('');
  const [localFile, setLocalFile] = useState<string | undefined>('');
  const [poster, setPoster] = useState<any>('');
  const [fileViewVisible, setFileViewVisible] = useState<boolean>(false);

  useEffect(() => {
    setPreviewImage(previewSrc);
  }, [previewSrc]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileType, setFileType] = useState<FileUploadType | undefined>();
  const [accept, setAccept] = useState<acceptFileType>(acceptFileType.picture);

  const [messageApi, contextHolder] = message.useMessage();

  const handleFileUpload = useCallback(async (file: File) => {
    const preview = '';

    if (file.size > 100 * 1024 * 1024) {
      message.error(`File upload failed. Please choose a file within the size limit.`);
      return false;
    }

    const type = file.type.split('/')[0] as unknown as FileUploadType;

    if ('video' === type) {
      getTheFirstFrame(file, (poster) => {
        setTimeout(() => {
          setPoster(poster);
        }, 0);
      });
    }

    setFileType(type);
    messageApi.open({
      type: 'loading',
      content: 'Uploading..',
      duration: 0,
    });

    try {
      switch (file.type) {
        case 'video/mp4':
        case 'audio/mpeg':
        case 'image/gif':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png': {
          const { url, hash } = await AWSManagerInstance.uploadFile(file);
          getBase64(file, (base64: string) => {
            setLocalFile(base64);
          });
          if (type === 'audio') {
            setPoster('');
          }

          // fileType, url, hash

          setS3File({
            url,
            file,
            hash,
            preview,
          });

          setPreviewImage(url);
          onUploadChange &&
            onUploadChange({
              fileType: type,
              url,
              hash,
            });
          console.log(url);
          setTimeout(messageApi.destroy, 0);

          message.success(`${file.name} file uploaded successfully.`);
          return false;
        }

        default:
          message.error('File upload failed. The supported formats are JPG, PNG, GIF');
          setTimeout(messageApi.destroy, 0);

          return Upload.LIST_IGNORE;
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
    action: '',
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    beforeUpload(file: any) {
      handleFileUpload(file);

      const traitsArray = csvToArray(file);
      console.log('--traitsArray--', traitsArray);
    },
  };

  const UploadButton = useCallback(() => {
    return (
      <div ref={uploader}>
        <p className="ant-upload-drag-icon">
          <UploadIcon />
        </p>
        <p className="text-[15px] text-[var(--text-secondary)]">Click or drag file to this area to upload</p>
        {/* <p className="ant-upload-hint">Formats supported JPG, PNG, GIF. Max size 100 MB. Recommend ratio 16:9.</p> */}
      </div>
    );
  }, []);

  const handleReload = () => {
    if (uploader.current) {
      uploader.current.click();
    }
  };

  const handleDelete = () => {
    setS3File({});
    setPreviewImage('');
  };

  const handlePlay = () => {
    setFileViewVisible(true);
  };
  const handleClose = () => {
    setFileViewVisible(false);
  };

  const previewImageSrc = fileType === 'image' ? s3File.url : poster;

  return (
    <div>
      {isDragger ? (
        <div className={` ${style['upload-wrapper']} ${previewImage ? 'mdl:!h-auto' : ''}`}>
          {s3File.url && (
            <div className="p-[30px] border-[1px] border-dashed	border-[var(--line-border)] rounded-t-[12px] relative ">
              <Image
                className="object-contain"
                wrapperClassName={`${
                  fileType !== 'image' && 'bg-[var(--bg-page-gray)]'
                } w-[283px] h-[248px] mdl:w-[420px] mdl:h-[248px] overflow-hidden flex justify-center`}
                preview={
                  fileType === 'image'
                    ? {
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                      }
                    : false
                }
                placeholder={ImagePlaceHolder}
                src={previewImageSrc}
              />

              {fileType !== 'image' && (
                <span
                  className="bg-transparent	 cursor-pointer absolute top-[30px] w-[283px] h-[248px] mdl:w-[420px] mdl:-[248px] overflow-hidden flex justify-center items-center"
                  onClick={handlePlay}>
                  <PlayIcon></PlayIcon>
                </span>
              )}

              <div className="cursor-pointer flex items-center justify-between mt-[20px]">
                <span className="flex items-center justify-center text-[var(--bg-btn)]" onClick={handleReload}>
                  <Reload className=" mr-[10px]" /> Reupload
                </span>
                <span
                  className="cursor-pointer	 flex items-center justify-center pr-[10px] text-[var(--bg-btn)]"
                  onClick={handleDelete}>
                  <Delete className=" mr-[10px]" /> Delete
                </span>
              </div>
            </div>
          )}

          <div className={`${style['upload-drag-wrapper']} ${wrapperClassName} ${previewImage ? 'hidden' : 'inline'}`}>
            <Dragger {...uploadProps} className={`rounded-[15.6px]`}>
              <UploadButton />
            </Dragger>
          </div>
        </div>
      ) : (
        <Upload {...uploadProps}></Upload>
      )}
      {contextHolder}
      {fileType && fileType !== 'image' && (
        <FileView visible={fileViewVisible} type={fileType} src={localFile} onClose={handleClose} />
      )}
    </div>
  );
};
