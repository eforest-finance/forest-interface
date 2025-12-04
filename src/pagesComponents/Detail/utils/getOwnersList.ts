import { fetchNftInfoOwners } from 'api/fetch';
import { INftInfoOwnersItems } from 'api/types';
import { DEFAULT_PAGE_SIZE } from 'constants/index';

interface IProps {
  id: string;
  chainId: Chain;
  page?: number;
  pageSize?: number;
}

const getOwnersList = async ({ id, chainId, page = 1, pageSize = DEFAULT_PAGE_SIZE }: IProps) => {
  try {
    console.log('loadMoreData getOwnersList');
    const result = await fetchNftInfoOwners({
      id,
      chainId,
      SkipCount: (page - 1) * pageSize,
      MaxResultCount: pageSize,
    });

    console.log('loadMoreData getOwnersList result', result);

    if (!result) {
      return false;
    }

    const resultItem: INftInfoOwnersItems[] = result?.items;
    const resultTotalCount = result?.totalCount;

    return {
      list: resultItem || [],
      totalCount: resultTotalCount ?? 0,
    };
  } catch (error) {
    console.log('loadMoreData getOwnersList error', error);
    return false;
  }
};

export default getOwnersList;
