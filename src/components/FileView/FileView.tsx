import ZoomIn from 'assets/images/fileView/zoomIn.svg';
import ZoomOut from 'assets/images/fileView/zoomOut.svg';
import Close from 'assets/images/fileView/close.svg';
import { useMemo, useState } from 'react';

import styles from './style.module.css';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import Image from 'next/image';
import { useTheme } from 'hooks/useTheme';

export type FileType = 'image' | 'video' | 'audio';

export default function FileView({
  visible = false,
  type,
  src,
  onClose,
}: {
  visible: boolean;
  type: FileType;
  src: string | undefined;
  onClose: () => void;
}) {
  const { isSmallScreen } = useSelector(selectInfo);
  const [zoom, setZoom] = useState(1);
  const [theme] = useTheme();
  const player = useMemo(() => {
    switch (type) {
      case 'image':
        return (
          <Image
            height={800}
            width={600}
            className={`${styles.file} ${styles.image} ${isSmallScreen && styles['mobile-file']} scale-[${zoom}]`}
            src={src || ''}
            alt=""
          />
        );
      case 'video':
        return (
          <video
            className={`${styles.file} ${styles.video} ${isSmallScreen && styles['mobile-file']}`}
            src={src}
            controls
          />
        );
      case 'audio':
        return (
          <audio
            className={`${styles.file} ${styles.audio} ${isSmallScreen && styles['mobile-file']}`}
            src={src}
            controls
          />
        );
      default:
        return null;
    }
  }, [isSmallScreen, src, type, zoom]);

  const stopEvent = (e: React.TouchEvent) => {
    try {
      e.stopPropagation();
      e.preventDefault();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={`${styles['file-view']} flex flex-col ${visible ? '!flex' : '!hidden'}`}
      onClick={() => isSmallScreen && type === 'image' && onClose()}>
      {!isSmallScreen ? (
        <div className={`${styles['tool-bar']} ${theme === 'dark' && 'bg-black bg-opacity-60'}`}>
          {type === 'image' ? (
            <>
              <div onClick={() => setZoom((v) => v + 0.2)}>
                <ZoomIn />
              </div>
              <div onClick={() => setZoom((v) => v - 0.2)}>
                <ZoomOut />
              </div>
            </>
          ) : null}
          <div onClick={onClose}>
            <Close />
          </div>
        </div>
      ) : (
        <div
          className="absolute right-0 p-[16px] z-50 touch-none"
          onTouchEnd={stopEvent}
          onTouchMove={stopEvent}
          onTouchStart={(e) => {
            console.log(e);
            stopEvent(e);
            onClose();
          }}>
          <Close />
        </div>
      )}
      {visible && player}
    </div>
  );
}
