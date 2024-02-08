import { fetchNftOffers } from 'api/fetch';
import BigNumber from 'bignumber.js';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { FormatOffersType } from 'store/types/reducer';
import { OfferType } from 'types/nftTypes';
import { formatTokenPrice } from 'utils/format';
import getExpiryTime from 'utils/getExpiryTime';

interface IProps {
  page?: number;
  pageSize?: number;
  nftId: string;
  chainId: Chain;
}

const getFloorPricePercentage = (floorPrice: number, currentOffer: number) => {
  const floorPriceBig = new BigNumber(floorPrice);
  const currentOfferBig = new BigNumber(currentOffer);
  if (floorPriceBig.lt(0)) {
    return '-';
  }

  const res = currentOfferBig.minus(floorPriceBig).div(floorPriceBig).multipliedBy(100);
  if (res.gt(0)) {
    return `${formatTokenPrice(res, { decimalPlaces: 0 })}% above`;
  } else {
    return `${formatTokenPrice(res.abs(), { decimalPlaces: 0 })}% below`;
  }
};

const getOffers = async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE, nftId, chainId }: IProps) => {
  try {
    const result = await fetchNftOffers({
      chainId,
      nftInfoId: nftId,
      skipCount: (page - 1) * pageSize,
      maxResultCount: pageSize,
    });

    if (!result) {
      return false;
    }

    const resultItem = result?.items;
    const resultTotalCount = result?.totalCount;
    const showList = resultItem?.reduce((prev: FormatOffersType[], item: OfferType, index: number) => {
      prev.push({
        key: index.toString(),
        token: { symbol: item.purchaseToken.symbol.toLocaleUpperCase(), id: 0 },
        decimals: item?.purchaseToken?.decimals,
        price: item?.price,
        quantity: item?.quantity,
        expiration: getExpiryTime(item.expireTime),
        expireTime: item?.expireTime,
        floorPricePercentage: getFloorPricePercentage(item.floorPrice || -1, item?.price),
        floorPrice: item.floorPrice || -1,
        floorPriceSymbol: item.floorPriceSymbol || 'ELF',
        from: item?.from
          ? {
              ...item?.from,
              address: item.fromAddress || '',
            }
          : null,
        to: item?.to
          ? {
              ...item?.to,
              address: item.toAddress || '',
            }
          : null,
        nftInfo: item?.nftInfo,
      });
      return prev;
    }, []);

    return {
      list: showList || [],
      totalCount: resultTotalCount ?? 0,
    };
  } catch (error) {
    return false;
  }
};

export default getOffers;
