import clsx from 'clsx';
import loadingImage from 'assets/images/loading.png';
import loadingImageL from 'assets/images/loadingL.png';
import { useTheme } from 'hooks/useTheme';
import Image from 'next/image';
import { useSelector } from 'store/store';
import { memo } from 'react';

function Loading(props: { className?: string; imgStyle?: string }) {
  const [theme] = useTheme();
  const {
    info: { isSmallScreen },
  } = useSelector((store) => store);

  return (
    <div
      className={clsx(
        'w-full flex items-center justify-center pb-[10px] box-border',
        isSmallScreen ? '!h-[100px]' : '!h-[120px]',
        props.className,
      )}>
      <Image
        src={theme === 'dark' ? loadingImage : loadingImageL}
        width={isSmallScreen ? 60 : 80}
        height={isSmallScreen ? 60 : 80}
        className={`animate-loading ${props.imgStyle} ${isSmallScreen ? '60px' : '80px'}}`}
        alt="default loading image"
      />
    </div>
  );
}

export default memo(Loading);
