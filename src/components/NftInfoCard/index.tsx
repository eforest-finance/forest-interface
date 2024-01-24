import ImgLoading from 'baseComponents/ImgLoading/ImgLoading';
import { StaticImageData } from 'next/image';
import React from 'react';

export interface INftInfoCard {
  logoImage?: string | StaticImageData;
  subTitle?: string;
  title?: string;
  extra?: string;
}

interface IProps {
  previewImage?: string | StaticImageData;
  info?: INftInfoCard;
}

const NftInfoCard = (props: IProps) => {
  const { previewImage, info } = props;
  return (
    <div className="flex flex-col items-center justify-between">
      {previewImage && (
        <ImgLoading
          src={previewImage}
          nextImageProps={{
            width: 128,
            height: 128,
          }}
          className="w-[128px] h-[128px] border border-solid border-lineBorder"
          imageSizeType="contain"
        />
      )}
      {info && (
        <>
          <div className="flex items-center justify-center mb-1 mt-[16px]">
            {info?.logoImage && (
              <ImgLoading
                src={info?.logoImage}
                nextImageProps={{
                  width: 24,
                  height: 24,
                }}
                className="w-[24px] h-[24px] border border-solid border-lineBorder !rounded-[4px] mr-[4px]"
                imageSizeType="cover"
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
