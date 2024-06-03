import { Modal, Col, Row, Image } from 'antd5/';
import Button from 'baseComponents/Button';

import { useEffect, useState } from 'react';
import { ImagePlaceHolder } from '../ImagePreview';
import Check from 'assets/images/v2/check.svg';
import Close from 'assets/images/icon/clear.svg';
import { AlbumProps } from './drawer';
import { IAIImage } from 'api/types';

export interface AlbumModallProps {
  isModalOpen: boolean;
  items: IAIImage[];
  onConfirm: (items: IAIImage[]) => void;
  onCancel: () => void;
}

const AlbumModal = (props: AlbumProps) => {
  const {
    isModalOpen,
    handleSelectedAll,
    handleUnSelected,
    handleConfirm,
    handleSelected,
    rows,
    handleCancel,
    selectedImages,
  } = props;
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Modal
        centered
        width={800}
        title={
          <div className="flex items-center justify-between font-semibold text-[24px] leading-[32px]">
            Choose Images <Close className="cursor-pointer" onClick={handleCancel} />
          </div>
        }
        open={isModalOpen}
        closeIcon={false}
        destroyOnClose
        footer={null}
        onCancel={handleCancel}>
        <div className="ml-[8px]">
          <p className="text-[16px] text-textSecondary font-medium">
            Great job! Choose your favorite images to become NFTs.
          </p>
          <div className="flex justify-space flex-col	 w-[736px] h-[600px] p-[16px] mt-[16px] border-[1px] border-solid	border-[var(--line-border)] rounded-[12px] ">
            <div className="flex-1">
              {rows.map((row, keyRow: number) => {
                return (
                  <Row className="pb-[16px]" gutter={16} wrap={false} key={`row-${keyRow}`}>
                    {row.map((item: IAIImage, key: number) => (
                      <Col span={6} className="" key={key.toString()}>
                        <Image
                          className="object-contain relative"
                          wrapperClassName={`border-[1px] border-solid border-[var(--line-border)] bg-[var(--fill-hover-bg)] !w-[164px] h-[164px] overflow-hidden rounded-[12px] !flex justify-center`}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                          }}
                          placeholder={ImagePlaceHolder}
                          src={item.url}
                        />

                        <div className="absolute top-[12px] right-[12px] cursor-pointer">
                          {selectedImages.map((selectedItem: IAIImage) => selectedItem.url).includes(item.url) ? (
                            <Check onClick={() => handleUnSelected(item)} />
                          ) : (
                            <div
                              className="w-[28px] h-[28px] rounded-full bg-white border-[2px] border-solid	border-[var(--line-border)] "
                              onClick={() => handleSelected(item)}
                            />
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                );
              })}
            </div>

            <div
              className=" flex justify-end cursor-pointer text-[18px] text-brandNormal font-medium"
              onClick={handleSelectedAll}>
              Select All
            </div>
          </div>
          <div className="flex justify-center mt-4 w-full">
            <Button
              disabled={!selectedImages.length}
              type="primary"
              size="ultra"
              className="!w-[256px]"
              onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AlbumModal;
