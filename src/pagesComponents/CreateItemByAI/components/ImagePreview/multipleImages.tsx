import { useCallback, useState, useRef, useEffect } from 'react';
import { message, Image, Flex } from 'antd5/';

import style from './style.module.css';
import Check from 'assets/images/v2/check.svg';

import { ImagePlaceHolder } from 'pagesComponents/CreateItemV2/components/Upload/UploadSingle';
import Reload from 'assets/images/v2/refresh.svg';
import ReSelect from 'assets/images/v2/reselect.svg';

import { INFTForm } from 'store/reducer/create/itemsByAI';

export enum acceptFileType {
  picture = 'jpeg,.jpg,.png,.gif',
  all = 'jpeg,.jpg,.png,.gif',
}

interface Item {
  src: string;
  name?: string;
  tokenId?: string;
}

interface MultipleImagesProps {
  selectedId?: number;
  items: INFTForm[];
  onSelectChange?: (id: number) => void;
  onReSelect?: () => void;
  onRegenerate?: () => void;
}

const MultipleImages = (props: MultipleImagesProps) => {
  const { items, onSelectChange, selectedId, onReSelect, onRegenerate } = props;

  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (id: number) => {
    onSelectChange && onSelectChange(id);
  };

  return (
    <div>
      <div className={`${style['imagePreview-wrapper-batch']}`}>
        {!!items.length && (
          <div className="p-[16px] pr-0  border-[1px] border-solid border-[var(--line-border)] rounded-[12px] relative ">
            <div className={`${style['list-wrapper']} overflow-scroll  h-[400px] mdl:h-[448px]`}>
              <Flex wrap gap={8}>
                {items.map((item, i) => (
                  <div
                    key={`nft-${i}`}
                    onClick={() => handleChange(i)}
                    className="cursor-pointer w-[98px] h-[154px] mdl:w-[144px] mdl:h-[180px] border-[1px] border-solid border-[var(--line-border)]  rounded-[8px] overflow-hidden relative">
                    <Image.PreviewGroup preview>
                      <Image
                        alt=""
                        className="object-contain !w-full !h-full"
                        wrapperClassName={`relative  overflow-hidden flex justify-center w-[98px] h-[98px] mdl:!w-[144px] mdl:!h-[144px]`}
                        preview={false}
                        placeholder={ImagePlaceHolder}
                        src={item.imageUrl}
                      />

                      {selectedId === i && (
                        <div className="absolute top-[12px] right-[12px] cursor-pointer">
                          <Check />
                        </div>
                      )}
                    </Image.PreviewGroup>

                    <div className="cursor-pointer h-[54px] overflow-hidden border-0 border-t-[1px] border-solid border-[var(--line-border)] text-[12px] text-[var(--text-secondary)] break-all p-[8px] leading-[20px]">
                      <span>{item?.tokenName}</span>
                      <span className="pl-[4px] text-[var(--text-primary)]">
                        {item.tokenId ? `#${item.tokenId}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </Flex>
            </div>

            <div className="cursor-pointer flex items-center justify-between mt-[20px]">
              <span className="flex items-center justify-center text-[var(--bg-btn)]" onClick={onReSelect}>
                <ReSelect className=" mr-[10px]" />
                Reselect
              </span>
              <span
                className="cursor-pointer	 flex items-center justify-center pr-[10px] text-[var(--bg-btn)]"
                onClick={onRegenerate}>
                <Reload className=" mr-[10px]" /> Regenerate
              </span>
            </div>
          </div>
        )}

        {contextHolder}
      </div>
    </div>
  );
};

export default MultipleImages;
