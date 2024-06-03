import { useCallback, useState, useRef, useEffect } from 'react';
import { message, Image, Skeleton } from 'antd5/';

import style from './style.module.css';
import Reload from 'assets/images/v2/refresh.svg';
import ReSelect from 'assets/images/v2/reselect.svg';

import Illustrate from 'assets/images/v2/ai_illustrate.svg';
import { ISingleFile } from 'store/reducer/create/item';
import MultipleImages from './multipleImages';
import { INFTForm } from 'store/reducer/create/itemsByAI';

interface ImagePreviewProps {
  selectedId?: number;
  items: INFTForm[];
  wrapperClassName?: string;
  dragWrapperClassName?: string;
  onSelectChange?: (id: number) => void;
  onReSelect?: () => void;
  onRegenerate?: () => void;
  onUploadChange?: (file: ISingleFile) => void;
}

export const ImagePlaceHolder = <Skeleton.Image active={true} className={'!w-full !h-full'}></Skeleton.Image>;

const ImagePreview = (props: ImagePreviewProps) => {
  const { items, onSelectChange, selectedId, wrapperClassName, onReSelect, onRegenerate } = props;

  const [previewImage, setPreviewImage] = useState<string | undefined>('');

  useEffect(() => {
    if (items && items?.length > 1) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [items]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleReload = () => {
    onRegenerate && onRegenerate();
  };

  const handleRechoose = () => {
    onReSelect && onReSelect();
  };

  const PlaceHolderImage = useCallback(() => {
    return (
      <div className="w-full  h-[343px] mdl:h-[480px] flex items-center flex-col justify-center">
        <Illustrate className="mb-[20px]" />
        <span>Generation in Progress</span>
      </div>
    );
  }, []);

  const Preview = useCallback(() => {
    const item = items.find((_, index) => {
      return index === selectedId;
    });

    return (
      <div className={`${style['upload-preview-wrapper']}`}>
        <Image
          className="object-contain"
          wrapperClassName={`!w-[283px] !h-[248px] mdl:!w-[420px] mdl:!h-[420px] overflow-hidden !flex justify-center border-[1px] border-solid	border-[var(--line-border)]`}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          placeholder={ImagePlaceHolder}
          src={item?.imageUrl}
        />

        {showFooter && (
          <div className="cursor-pointer flex items-center justify-between mt-[20px]">
            <span className="flex items-center justify-center text-[var(--bg-btn)]" onClick={handleRechoose}>
              <ReSelect className=" mr-[10px]" /> Reselect
            </span>
            <span
              className="cursor-pointer	 flex items-center justify-center pr-[10px] text-[var(--bg-btn)]"
              onClick={handleReload}>
              <Reload className=" mr-[10px]" /> Regenerate
            </span>
          </div>
        )}
      </div>
    );
  }, [items, previewOpen, showFooter, selectedId]);

  return (
    <>
      <div className={` ${style['imagePreview-wrapper']} ${wrapperClassName} ${previewImage ? 'mdl:!h-auto' : ''}`}>
        {items.length ? <Preview /> : <PlaceHolderImage />}
      </div>

      {items.length > 1 && (
        <MultipleImages
          selectedId={selectedId}
          items={items}
          onSelectChange={onSelectChange}
          onReSelect={handleRechoose}
          onRegenerate={handleReload}
        />
      )}
      {contextHolder}
    </>
  );
};

export default ImagePreview;
