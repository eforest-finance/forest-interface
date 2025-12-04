import { ImageEnhance } from 'components/ImgLoading';
import { useMemo } from 'react';
import useDetailGetState from 'store/state/detailGetState';
import { INftInfo } from 'types/nftTypes';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { handlePlurality } from 'utils/handlePlurality';

export enum PriceTypeEnum {
  BUY = 1,
  BUY721 = 2,
  MAKEOFFER = 3,
  MAKEOFFER721 = 4,
  DEAL = 5,
}

const typeDescMaps: Record<PriceTypeEnum, string> = {
  [PriceTypeEnum.BUY]: 'Average Item Price',
  [PriceTypeEnum.BUY721]: 'Listing Price',
  [PriceTypeEnum.MAKEOFFER]: 'Total Offer Amount',
  [PriceTypeEnum.MAKEOFFER721]: 'Offer Amount',
  [PriceTypeEnum.DEAL]: 'Offer Amount',
};

export default function PriceInfo(props: {
  nftInfo?: INftInfo;
  quantity: number | string;
  price: string | number;
  convertPrice: string | number;
  type: PriceTypeEnum;
  totalSupply: string | number;
}) {
  const { detailInfo } = useDetailGetState();
  const { nftInfo: stateInfo } = detailInfo;
  const { quantity, price, convertPrice, type, nftInfo: pNftInfo, totalSupply } = props;
  const nftInfo = pNftInfo || stateInfo;

  const priceDesc = useMemo(() => {
    return typeDescMaps[type];
  }, [type]);

  return (
    <div className="flex justify-between">
      <div className="flex flex-col mdTW:flex-row">
        <ImageEnhance
          className="!rounded-[8px] mr-[16px] w-[84px] h-[84px] border border-solid border-lineBorder"
          src={nftInfo?.previewImage || ''}
        />
        <div>
          <p className="text-[16px] mt-[8px] mdTW:mt-0 leading-[24px] font-medium text-[var(--text-secondary)]">
            {nftInfo?.nftCollection?.tokenName}
          </p>
          <p className="mt-[4px] text-[20px] leading-[28px] font-semibold text-[var(--text-primary)]">
            {nftInfo?.tokenName}
          </p>
          {Number(totalSupply) > 1 && (
            <p className="text-[16px] leading-[24px] font-medium text-[var(--text-secondary)] mt-[4px] hidden mdTW:block">
              {handlePlurality(Number(quantity), 'item')}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <div className="text-[16px] leading-[24px] font-medium text-[var(--text-secondary)]">{priceDesc}</div>
          <div className="mt-[4px] text-[20px] leading-[28px] font-semibold text-[var(--text-primary)]">
            {formatTokenPrice(price)} ELF
          </div>
          <div className="text-[16px] leading-[24px] font-medium text-[var(--text-secondary)]">
            {formatUSDPrice(convertPrice)}
          </div>
        </div>
        {Number(totalSupply) > 1 && (
          <div className="text-[16px] leading-[24px] font-medium text-[var(--text-secondary)] mt-[4px] mdTW:hidden">
            {handlePlurality(Number(quantity), 'item')}
          </div>
        )}
      </div>
    </div>
  );
}
