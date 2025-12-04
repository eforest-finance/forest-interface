import clsx from 'clsx';
import loadingImage from 'assets/images/loading.png';
import loadingImageL from 'assets/images/loadingL.png';
import { useTheme } from 'hooks/useTheme';
import Image from 'next/image';

function LoadingMore(props: { className?: string }) {
  const [theme] = useTheme();

  return (
    <div className={clsx('w-full flex items-center justify-center h-16 box-border overflow-hidden', props.className)}>
      <Image
        src={theme === 'dark' ? loadingImage : loadingImageL}
        width={48}
        height={48}
        className="animate-loading h-12 w-12"
        alt="default loading image"
      />
    </div>
  );
}

export { LoadingMore };
