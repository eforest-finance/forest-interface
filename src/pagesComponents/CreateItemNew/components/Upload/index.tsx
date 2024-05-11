import { useRef, useState } from 'react';
import { Upload as AntUpload, message } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useHover } from 'ahooks';
import AWSManagerInstance, { UploadFileType } from 'utils/S3';
import Image from 'next/image';

import styles from './upload.module.css';
import clsx from 'clsx';
import { ImageEnhance } from 'components/ImgLoading';

const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

interface AWSUploadChangeParam {
  fileUrl: string;
}
interface AWSUploadProps {
  onChange?: (props: AWSUploadChangeParam) => void;
  upLoadingStatus?: (value?: string) => void;
}

export function AWSUpload(props: AWSUploadProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    // console.log('fileLIst', fileList[0]);
    if (!fileList || !fileList.length) return;
    const file = fileList[0];
    setLoading(file.status === 'uploading');

    if (file.status === 'uploading') {
      message.loading('uploading');
    }
    if (file.status === 'done') {
      message.success(`${file.name || ''} file uploaded successfully.`);
      getBase64(file.originFileObj as File, setImageUrl);
      console.log('executre props.onChange', file.response.url);
      props.onChange && props.onChange({ ...file.response.url });
    }
    props.upLoadingStatus && props.upLoadingStatus(file.status);
  };

  const beforeUpload = async (file: File) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/svg' ||
      file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/SVG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isLt2M) {
      message.error('Image must smaller than 100MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const customUpload = async ({ file, onSuccess, onError }: UploadRequestOption) => {
    try {
      const uploadFile = await AWSManagerInstance.uploadFile(file as File);
      const fileType = (file as File).type.split('/')[0];
      onSuccess &&
        onSuccess({
          url: {
            ...uploadFile,
            fileType,
          },
        });
    } catch (error) {
      onError && onError(error as Error);
    }
  };

  const ref = useRef(null);
  const isHovering = useHover(ref);

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : !imageUrl ? (
        <div className="flex flex-col">
          <UploadOutlined className="cursor-pointer closeIcon text-[42px] text-brandNormal" />
          <span className=" text-textPrimary text-lg">Upload</span>
          <span className=" text-textSecondary text-base">
            Formats supported JPG, PNG, GIF, MP3, MP4. Max size 100 MB. Recommend ratio 16:9.
          </span>
        </div>
      ) : (
        <div className="w-[94px] h-[94px] relative" ref={ref}>
          <ImageEnhance src={imageUrl} className="object-cover w-full h-full" alt="img" />
          {isHovering && (
            <div className="w-[94px] h-[94px] flex flex-col items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-img-upload-bg">
              <UploadOutlined className="cursor-pointer closeIcon" />
              <div className="text-sm font-medium text-white">Edit</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const uploadProps: UploadProps = {
    ...props,
    accept: '.jpeg,.jpg,.png,.svg',
    listType: 'picture-card',
    maxCount: 1,
    showUploadList: false,
    customRequest: customUpload,
    onChange: handleChange,
    beforeUpload,
  };

  return (
    <div className={styles['img-uploader-wrapper']}>
      <AntUpload {...uploadProps}>{uploadButton}</AntUpload>
    </div>
  );
}
