import { Skeleton } from 'antd';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { useState } from 'react';

interface ISkeletonImage {
  img?: string | StaticImageData;
  className?: string;
  imageSizeType?: 'cover' | 'contain';
}

function SkeletonImage(props: ISkeletonImage) {
  const { img, className, imageSizeType = 'cover' } = props;

  const [skeletonActive, setSkeletonActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const imageType = {
    cover: 'object-cover',
    contain: 'object-contain',
  };

  return (
    <div className={clsx('relative', className)}>
      {(loading || !img) && (
        <Skeleton.Image className="absolute top-0 left-0 !w-full !h-full" active={img ? skeletonActive : false} />
      )}
      {img && (
        <Image
          width={2560}
          height={2560}
          src={img}
          alt="image"
          className={clsx('w-full h-full', imageType[imageSizeType])}
          onLoad={() => {
            setLoading(false);
            setSkeletonActive(false);
          }}
          onError={() => {
            setSkeletonActive(false);
          }}
        />
      )}
    </div>
  );
}

export default React.memo(SkeletonImage);
