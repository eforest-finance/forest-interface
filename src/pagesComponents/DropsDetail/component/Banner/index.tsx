import SkeletonImage from 'baseComponents/SkeletonImage';
import clsx from 'clsx';
import { StaticImageData } from 'next/image';
import React from 'react';

interface IProps {
  img?: string | StaticImageData;
  className?: string;
}

function Banner(props: IProps) {
  const { img, className } = props;

  if (!img) return null;

  return (
    <SkeletonImage
      className={clsx(
        'w-full overflow-hidden aspect-square mdTW:aspect-[128/30] rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-lg mdTW:rounded-br-none mdTW:rounded-bl-none',
        className,
      )}
      img={img}
    />
  );
}

export default React.memo(Banner);
