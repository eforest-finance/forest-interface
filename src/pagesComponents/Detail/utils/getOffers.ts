import { fetchNftOffers } from 'api/fetch';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { MILLISECONDS_PER_DAY } from 'constants/time';
import moment from 'moment';
import { FormatOffersType } from 'store/types/reducer';
import { OfferType } from 'types/nftTypes';

interface IProps {
  page?: number;
  pageSize?: number;
  nftId: string;
  chainId: Chain;
}

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
        expiration: ((item?.expireTime - moment().valueOf()) / MILLISECONDS_PER_DAY).toFixed(0).toString(),
        expireTime: item?.expireTime,
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
