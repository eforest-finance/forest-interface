import { ReactNode, memo, useEffect, useMemo, useState } from 'react';
import loadingImage from 'assets/images/loading.png';
import loadingImageL from 'assets/images/loadingL.png';
import nftPreview from 'assets/images/nftPreview.jpg';
import Image, { StaticImageData } from 'next/image';
import { useTheme } from 'hooks/useTheme';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import { isBase64Url, isUrl } from 'utils/reg';

import styles from './ImgLoading.module.css';
interface ImgLoadingProps {
  src: string | StaticImageData;
  loading?: ReactNode;
  nextImageProps?: {
    width?: number;
    height?: number;
  };
  className?: string;
  key?: string;
  notReady?: boolean;
  defaultHeight?: number | string;
  imageSizeType?: 'cover' | 'contain';
}

function ImgLoading({
  src,
  nextImageProps,
  className,
  loading,
  notReady = false,
  defaultHeight = 'auto',
  imageSizeType = 'contain',
}: ImgLoadingProps) {
  const [theme] = useTheme();
  const { isSmallScreen } = useSelector(selectInfo);
  const [loadableStatus, setLoadableStatus] = useState<boolean>(false);
  const defaultLoadingWrapper = useMemo(() => {
    return (
      <Image
        src={theme === 'dark' ? loadingImage : loadingImageL}
        className={'loading-image-default animate-loading w-[80px] h-[80px]'}
        alt="default loading image"
      />
    );
  }, [theme]);

  useEffect(() => {
    if (typeof src === 'string') {
      setLoadableStatus(isUrl(src) || isBase64Url(src));
    } else {
      setLoadableStatus(true);
    }
  }, [src]);

  return (
    <div
      className={`${styles['img-loading-wrapper']} ${isSmallScreen && styles['marketplace-mobile']} ${className} ${
        !notReady ? `!h-[${defaultHeight}]` : '!h-auto'
      }`}>
      {!notReady ? (
        <Image
          className={`${imageSizeType === 'contain' ? 'object-contain' : 'object-cover'} w-full h-full`}
          src={loadableStatus ? src : nftPreview}
          alt="show image"
          loading="lazy"
          width={nextImageProps?.width || 400}
          height={nextImageProps?.height || 400}
          onError={() => setLoadableStatus(false)}
        />
      ) : null}
      {notReady && (
        <div className={`flex items-center justify-center loading-image-default-wrapper`}>
          {loading ? loading : defaultLoadingWrapper}
        </div>
      )}
    </div>
  );
}

export default memo(ImgLoading);
