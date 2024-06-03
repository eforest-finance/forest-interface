import { Modal, Col, Row, Image } from 'antd5/';
import Button from 'baseComponents/Button';

import { useEffect, useState } from 'react';
import Close from 'assets/images/icon/clear.svg';
import useGetState from 'store/state/getState';

import AlbumDrawer from './drawer';
import AlbumModal from './modal';
import { IAIImage } from 'api/types';

export interface AlbumModalProps {
  isModalOpen: boolean;
  items: IAIImage[];
  onConfirm: (items: IAIImage[]) => void;
  onCancel: () => void;
}

const COLUMN_COUNT = 4;
const SMALL_SCREEN_COLUMN_COUNT = 2;

const Album = (props: AlbumModalProps) => {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { isModalOpen, items, onConfirm, onCancel } = props;

  const [rows, setRows] = useState<IAIImage[][]>([]);
  const [selectedImages, setSelectedImages] = useState<IAIImage[]>([]);
  const [tipOpen, setTipOpen] = useState(false);

  const handleCancel = () => {
    setTipOpen(true);
  };

  useEffect(() => {
    const columnGroup = [] as IAIImage[][];
    if (items.length) {
      items.forEach((img, index) => {
        const count = isSmallScreen ? SMALL_SCREEN_COLUMN_COUNT : COLUMN_COUNT;
        const y = Math.floor(index / count);
        if (!columnGroup[y]) {
          columnGroup[y] = [];
        }
        columnGroup[y].push(img);
      }, []);

      setRows(columnGroup);
    }
  }, [items]);

  const handleSelected = (item: IAIImage) => {
    setSelectedImages([...selectedImages, item]);
  };

  const handleUnSelected = (item: IAIImage) => {
    setSelectedImages(selectedImages.filter((images) => images.url !== item.url));
  };

  const handleSelectedAll = () => {
    setSelectedImages(items);
  };

  const handleConfirm = () => {
    onConfirm(selectedImages);
    reset();
  };

  const reset = () => {
    setRows([]);
    setSelectedImages([]);
  };

  const albumProps = {
    isModalOpen,
    items,
    handleSelectedAll,
    handleUnSelected,
    handleConfirm,
    handleSelected,
    selectedImages,
    rows,
    handleCancel,
  };

  return (
    <>
      {isSmallScreen ? <AlbumDrawer {...albumProps} /> : <AlbumModal {...albumProps} />}

      <Modal
        centered
        width={800}
        title={
          <div className="flex items-center justify-between font-semibold text-[24px] leading-[32px]">
            Note
            <Close
              className="cursor-pointer"
              onClick={() => {
                setTipOpen(false);
              }}
            />
          </div>
        }
        open={tipOpen}
        onOk={() => {
          setTipOpen(false);
        }}
        closeIcon={false}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setTipOpen(false);
        }}>
        <div>
          After closing the pop-up window, you will not be able to retrieve generated images and the fees used to
          generate the images will not be refunded.
        </div>

        <div className="flex justify-center mt-4 w-full">
          <Button
            type="primary"
            size="ultra"
            className={`${!isSmallScreen ? '!w-[256px]' : '!w-full'}`}
            onClick={() => {
              setTipOpen(false);
              onCancel();
              reset();
            }}>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Album;
