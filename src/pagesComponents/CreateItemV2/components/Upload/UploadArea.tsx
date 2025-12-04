import { Upload } from 'antd5/';
const { Dragger } = Upload;
import type { UploadProps } from 'antd5/';

import UploadIcon from 'assets/images/v2/upload.svg';

import style from './upload.module.css';
import { acceptFileType } from './UploadBatch';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

interface UploadAreaProps extends UploadProps {
  subTitle?: string;
  title?: string;
  className?: string;
}

const UploadArea: React.FC<UploadAreaProps> = (props: UploadAreaProps) => {
  const { subTitle, title, className, ...rest } = props;
  const { isSmallScreen } = useSelector(selectInfo);

  const uploadProps = {
    name: 'File',
    accept: acceptFileType.all,
    showUploadList: false,
    multiple: true,
    maxCount: 99,
    action: '',
  };

  return (
    <div className={` ${style['upload-continue-wrapper']} mt-[32px] ${className} `}>
      <Dragger {...uploadProps} {...rest}>
        {isSmallScreen ? (
          <div className="flex justify-center items-center flex-col	text-left ">
            <div className="flex justify-center items-center">
              <div className="w-[144px] h-[144px] flex justify-center items-center mr-[24px] border-[1px]  border-dashed border-[var(--line-border)] rounded-[15.6px]">
                <UploadIcon />
              </div>
              <p className="flex-1 text-[var(--text-primary)] text-[16px] leading-[24px] font-medium">{title}</p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] !mt-[16px] text-[14px]">{subTitle}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-[144px] h-[144px] flex justify-center items-center mr-[24px] border-[1px]  border-dashed border-[var(--line-border)] rounded-[15.6px]">
              <UploadIcon />
            </div>
            <div className="text-left flex-1">
              <p className="text-[var(--text-primary)] text-[16px] leading-[24px] font-medium">{title}</p>
              <p className="text-[var(--text-secondary)] !mt-[16px] text-[14px]">{subTitle}</p>
            </div>
          </div>
        )}
      </Dragger>
    </div>
  );
};

export default UploadArea;
