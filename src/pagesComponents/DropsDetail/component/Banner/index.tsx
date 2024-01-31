import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import useGetState from 'store/state/getState';

interface IProps {
  img?: string | StaticImageData;
  className?: string;
}

function Banner(props: IProps) {
  const { img, className } = props;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  if (!img) return null;

  return (
    <div
      className={clsx(
        'w-full overflow-hidden aspect-square mdTW:aspect-[128/30] rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-lg mdTW:rounded-br-none mdTW:rounded-bl-none',
        className,
      )}>
      <Image
        width={isSmallScreen ? 343 : 1280}
        height={isSmallScreen ? 343 : 300}
        src={img}
        alt="banner"
        className="w-full aspect-square mdTW:aspect-[128/30] object-cover"
      />
    </div>
  );
}

export default React.memo(Banner);
