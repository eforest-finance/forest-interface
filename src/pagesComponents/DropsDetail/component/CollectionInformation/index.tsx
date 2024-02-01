import clsx from 'clsx';
import React from 'react';
import Button from 'baseComponents/Button';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import ImgLoading from 'baseComponents/ImgLoading';
import { useRouter } from 'next/navigation';

export enum ActivityStatus {
  ended = 'Ended',
}

interface IProps {
  className?: string;
}

function CollectionInformation(props: IProps) {
  const { className } = props;
  const { dropDetailInfo } = useDropDetailGetState();

  const nav = useRouter();

  return (
    <div className={clsx(className)}>
      <h1 className="text-xl mdTW:text-2xl text-textPrimary font-semibold">About the NFT Collection</h1>
      <div className="flex items-center mt-[16px] mdTW:mt-[24px]">
        <ImgLoading
          src={dropDetailInfo?.collectionLogo || ''}
          nextImageProps={{
            width: 84,
            height: 84,
          }}
          imageSizeType="cover"
          className="!w-[84px] !h-[84px] rounded-lg"
        />
        <span className="text-xl text-textPrimary font-semibold ml-[24px]">{dropDetailInfo?.collectionName}</span>
      </div>
      <Button
        className="!w-full mt-[24px] mdTW:mt-[32px]"
        size="ultra"
        onClick={() => {
          nav.push(`/explore-items/${dropDetailInfo?.collectionId}`);
        }}>
        View on Forest
      </Button>
    </div>
  );
}

export default React.memo(CollectionInformation);
