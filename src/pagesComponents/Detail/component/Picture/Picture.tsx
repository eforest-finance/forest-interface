import FileView from 'components/FileView/FileView';
import ImgLoading, { ImageEnhance } from 'components/ImgLoading';

import { useMemo, useState } from 'react';
import Preview from 'assets/images/icons/preview.svg';

import styles from './style.module.css';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import useDetailGetState from 'store/state/detailGetState';

export default function Picture() {
  const { isSmallScreen } = useSelector(selectInfo);
  const [visible, setVisible] = useState(false);
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const convertType = useMemo(() => {
    if (nftInfo?.fileExtension === 'mp3') return 'audio';
    if (nftInfo?.fileExtension === 'mp4') return 'video';
    return 'image';
  }, [nftInfo?.fileExtension]);

  return (
    <>
      <div
        className={`${styles['detail-cover']} ${isSmallScreen && styles['mobile-detail-cover']}`}
        onClick={() => isSmallScreen && setVisible(true)}>
        <ImageEnhance
          width={'100%'}
          height={'100%'}
          className=" w-full h-full aspect-square rounded-lg"
          src={nftInfo?.previewImage || ''}
        />
        {nftInfo?.file &&
          (!isSmallScreen ? (
            <div className={`${styles.mask} flex items-center justify-center`} onClick={() => setVisible(true)}>
              <Preview />
            </div>
          ) : null)}
      </div>
      <FileView
        visible={visible}
        type={convertType}
        src={nftInfo?.file || nftInfo?.previewImage || ''}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
