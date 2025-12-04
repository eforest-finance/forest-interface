import { INftSaleInfoItem } from 'api/types';
import { ImageEnhance } from 'components/ImgLoading';
import { formatUSDPrice, formatTokenPrice } from 'utils/format';
import useGetState from 'store/state/getState';

interface IInfoItemProps {
  top?: string;
  middle?: string;
  bottom?: string;
  textAlgnClassName?: string;
  size?: 'ultra';
}
interface INftSaleInfoCardProps {
  nftSaleInfo?: INftSaleInfoItem;
  listItems?: number;
  listingPrice?: number | string;
  listingUSDPrice?: number | string;
  size?: 'ultra' | '';
  isERC1155?: boolean;
}
interface INftSaleInfoCardForDelProps extends INftSaleInfoCardProps {
  listings?: number | string;
}

const InfoItem = ({ top = '-', middle = '-', bottom = '-', textAlgnClassName = 'text-left' }: IInfoItemProps) => {
  return (
    <div className="flex flex-col ml-4">
      <span className={`text-textSecondary text-base h-6 font-medium ${textAlgnClassName}`}>{top}</span>
      <span className={`text-textPrimary h-6 text-xl font-semibold my-1 ${textAlgnClassName}`}>{middle}</span>
      <span className={`text-textSecondary h-6 text-base font-medium ${textAlgnClassName}`}>{bottom}</span>
    </div>
  );
};
const BaseInfoItemMobile = ({ top = '-', middle = '-', bottom = '-' }: IInfoItemProps) => {
  return (
    <div className="flex flex-col mt-2">
      <span className="text-textSecondary text-base font-medium">{top}</span>
      <div className="flex justify-between my-1">
        <span className="text-textPrimary text-xl font-semibold">{middle}</span>
        <span className="text-textSecondary text-base font-medium">{bottom}</span>
      </div>
    </div>
  );
};

export function NFTSaleInfoCard({
  nftSaleInfo,
  listItems = 0,
  listingPrice,
  listingUSDPrice,
  size,
  isERC1155,
}: INftSaleInfoCardProps) {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  const middle = `${listingPrice ? formatTokenPrice(listingPrice) : '--'} ELF`;
  const bottom = listingUSDPrice ? formatUSDPrice(listingUSDPrice) : '$ --';
  const listItem = listItems < 0 ? '' : `${listItems} ${listItems > 1 ? 'items' : 'item'}`;

  const topItemStr = isERC1155 ? 'Listing Price Per Item' : 'Listing Price';

  if (size === 'ultra') {
    return (
      <div className="flex flex-col">
        <div className="flex rounded-md bg-fillHoverBg w-full aspect-square overflow-hidden justify-center items-center">
          <ImageEnhance
            src={nftSaleInfo?.logoImage || ''}
            className="object-contain rounded-md bg-fillHoverBg w-full h-full "
            alt="nft logo"
          />
        </div>
        <div className="flex justify-between mt-2">
          <InfoItem top={nftSaleInfo?.collectionName} middle={nftSaleInfo?.tokenName} bottom={listItem} />
          <InfoItem top={topItemStr} middle={middle} bottom={bottom} textAlgnClassName="text-right" />
        </div>
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between">
          <ImageEnhance
            src={nftSaleInfo?.logoImage || ''}
            className="object-contain rounded-md bg-fillHoverBg w-[84px] h-[84px]"
            alt="nft logo"
          />
          <InfoItem top={topItemStr} middle={middle} bottom={bottom} textAlgnClassName="text-right" />
        </div>
        <BaseInfoItemMobile top={nftSaleInfo?.collectionName} middle={nftSaleInfo?.tokenName} bottom={listItem} />
      </div>
    );
  }
  return (
    <div className="flex">
      <div className="flex flex-1">
        <ImageEnhance
          src={nftSaleInfo?.logoImage || ''}
          className="object-contain rounded-md bg-fillHoverBg w-[84px] h-[84px]"
        />
        <InfoItem top={nftSaleInfo?.collectionName} middle={nftSaleInfo?.tokenName} bottom={listItem} />
      </div>
      <InfoItem top={topItemStr} middle={middle} bottom={bottom} textAlgnClassName="text-right" />
    </div>
  );
}

export function NFTSaleInfoCardForDelListing({
  nftSaleInfo,
  listItems = 0,
  listings,
  size,
}: INftSaleInfoCardForDelProps) {
  const bottom = `${listings} ${Number(listings) > 1 ? 'Listings' : 'Listing'}`;
  const listItem = listItems < 0 ? '' : `${listItems} ${listItems > 1 ? 'items' : 'item'}`;

  if (size === 'ultra') {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-center rounded-md bg-fillHoverBg w-full aspect-square">
          <ImageEnhance
            src={nftSaleInfo?.logoImage || ''}
            className="object-contain rounded-md bg-fillHoverBg w-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          <InfoItem top={nftSaleInfo?.collectionName} middle={nftSaleInfo?.tokenName} bottom={listItem} />
          <InfoItem top=" " middle={' '} bottom={bottom} textAlgnClassName="text-right" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex flex-1">
        <ImageEnhance
          src={nftSaleInfo?.logoImage || ''}
          className="object-contain rounded-md bg-fillHoverBg w-[84px] h-[84px]"
          alt="nft logo"
        />
        <InfoItem top={nftSaleInfo?.collectionName} middle={nftSaleInfo?.tokenName} bottom={listItem} />
      </div>
      <InfoItem top=" " middle={' '} bottom={bottom} textAlgnClassName="text-right" />
    </div>
  );
}
