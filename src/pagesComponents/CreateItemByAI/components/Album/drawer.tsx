import { Drawer, Row, Col, Image } from 'antd5/';
import { useEffect, useState } from 'react';
import Close from 'assets/images/icon/clear.svg';
import Button from 'baseComponents/Button';
import Check from 'assets/images/v2/check.svg';
import { IAIImage } from 'api/types';
import { ImagePlaceHolder } from '../ImagePreview';

export interface AlbumProps {
  isModalOpen: boolean;
  items: IAIImage[];
  rows: IAIImage[][];
  selectedImages: IAIImage[];
  handleSelectedAll: () => void;
  handleUnSelected: (items: IAIImage) => void;
  handleConfirm: () => void;
  handleSelected: (items: IAIImage) => void;
  handleCancel: () => void;
}

const AlbumDrawer = (props: AlbumProps) => {
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
      <Drawer
        placement="top"
        open={isModalOpen}
        closeIcon={false}
        destroyOnClose
        className="!h-screen"
        footer={
          <div className="flex justify-center mt-4 w-full">
            <Button
              disabled={!selectedImages.length}
              type="primary"
              size="ultra"
              className={'!w-full'}
              onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        }
        title={
          <div className="flex items-center justify-between font-semibold text-[24px] leading-[32px]">
            Choose Images <Close className="cursor-pointer" onClick={handleCancel} />
          </div>
        }>
        <div className="h-full flex justify-between flex-col">
          <p className="mt-[16px] text-[16px] text-textSecondary font-medium">
            Great job! Choose your favorite images to become NFTs.
          </p>
          <div className="flex-1 overflow-auto overflow-x-hidden	mt-[16px]">
            <div>
              {rows.map((row, keyRow: number) => {
                return (
                  <Row gutter={[16, 16]} className="pb-[16px]" wrap={false} key={`row-${keyRow}`}>
                    {row.map((item: IAIImage, key: number) => (
                      <Col span={12} className="!flex justify-between" key={key.toString()}>
                        <div className="relative w-[164px] h-[164px]">
                          <Image.PreviewGroup preview>
                            <Image
                              className="object-contain"
                              wrapperClassName={`border-[1px] border-solid border-[var(--line-border)] bg-[var(--fill-hover-bg)] !w-full h-full overflow-hidden rounded-[12px] !flex justify-center`}
                              preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                              }}
                              placeholder={ImagePlaceHolder}
                              src={item.url}
                            />
                          </Image.PreviewGroup>

                          <div className="absolute top-[12px] right-[12px] cursor-pointer">
                            {selectedImages.map((selectedItem: IAIImage) => selectedItem.url).includes(item.url) ? (
                              <Check onClick={() => handleUnSelected(item)} />
                            ) : (
                              <div
                                className="w-[28px] h-[28px] rounded-full bg-white"
                                onClick={() => handleSelected(item)}
                              />
                            )}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                );
              })}
            </div>
          </div>
          <div
            className="flex justify-end cursor-pointer text-[18px] text-brandNormal font-medium mt-[16px]"
            onClick={handleSelectedAll}>
            Select All
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AlbumDrawer;
