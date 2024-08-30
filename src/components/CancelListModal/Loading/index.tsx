import clsx from 'clsx';
import LoadingImage from 'assets/images/v2/loading.png';
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
        src={LoadingImage}
        width={24}
        height={24}
        className={`animate-loading ${props.imgStyle}}`}
        alt="default loading image"
      />
    </div>
  );
}

export default memo(Loading);
