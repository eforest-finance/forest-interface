import { ImageEnhance } from 'components/ImgLoading';

import { StaticImageData } from 'next/image';
import React from 'react';

export interface INftInfoCard {
  logoImage?: string | StaticImageData | undefined;
  subTitle?: string;
  title?: string;
  extra?: string;
}

interface IProps {
  previewImage?: string | StaticImageData | undefined;
  info?: INftInfoCard;
}

const NftInfoCard = (props: IProps) => {
  const { previewImage, info } = props;
  return (
    <div className="flex flex-col items-center justify-between">
      {previewImage && (
        <ImageEnhance
          src={previewImage}
          className="rounded-lg !w-[128px] h-[128px] border border-solid border-lineBorder"
        />
      )}
      {info && (
        <>
          <div className="flex items-center justify-center mb-1 mt-[16px]">
            {info?.logoImage && (
              <ImageEnhance
                src={info?.logoImage}
                className="!w-[24px] h-[24px] border border-solid border-lineBorder !rounded-[4px] mr-[4px]"
              />
            )}
            {info.subTitle && <span className="text-textSecondary text-base">{info.subTitle}</span>}
          </div>
          {info?.title && <span className="font-semibold text-xl text-textPrimary ">{info.title}</span>}

          {info?.extra && <span className="text-textSecondary text-base font-medium">{info.extra}</span>}
        </>
      )}
    </div>
  );
};

export default React.memo(NftInfoCard);
