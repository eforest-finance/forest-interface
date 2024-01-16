import { fetchListings } from 'api/fetch';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { MILLISECONDS_PER_DAY } from 'constants/time';
import { FormatListingType } from 'store/types/reducer';
import { IListingType } from 'types/nftTypes';
import { OmittedType, getOmittedStr } from 'utils';

interface IProps {
  page?: number;
  pageSize?: number;
  symbol: string;
  address: string;
  chainId: Chain;
}

const getListings = async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE, symbol, address, chainId }: IProps) => {
  try {
    const result = await fetchListings({
      chainId,
      symbol,
      skipCount: (page - 1) * pageSize,
      maxResultCount: pageSize,
      address,
    });

    if (!result) {
      return false;
    }

    const resultItem = result?.items;
    const resultTotalCount = result?.totalCount;
    const showList = resultItem.map((item: IListingType): FormatListingType => {
      const price = item.whitelistPrices !== null ? item.whitelistPrices : item.prices;
      return {
        key: item.publicTime.toString(),
        purchaseToken: { symbol: item.purchaseToken.symbol.toLocaleUpperCase() },
        decimals: item.purchaseToken.decimals ?? 8,
        price,
        quantity: item.quantity,
        ownerAddress: item?.ownerAddress || '',
        expiration: ((item.endTime - new Date().getTime()) / MILLISECONDS_PER_DAY).toFixed(0).toString(),
        fromName: address === item?.ownerAddress ? 'you' : getOmittedStr(item?.owner?.name || '', OmittedType.ADDRESS),
        whitelistHash: item.whitelistId,
        startTime: item.startTime,
        endTime: item.endTime,
      };
    });

    return {
      list: showList || [],
      totalCount: resultTotalCount ?? 0,
    };
  } catch (error) {
    return false;
  }
};

export default getListings;
