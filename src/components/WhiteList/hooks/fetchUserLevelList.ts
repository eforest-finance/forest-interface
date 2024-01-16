import { formatObjEmpty } from '../utils';
import { fetchGetTags } from 'api/fetch';
import { store } from 'store/store';
import { setWhiteListInfo } from 'store/reducer/saleInfo/whiteListInfo';
import { IWhiteListTagsResponse } from 'api/types';

export const fetchUserLevelList = async (
  data: {
    chainId?: Chain;
    projectId?: string | null;
    whitelistHash?: string | null;
    priceMin?: string;
    priceMax?: string;
  },
  skipCount: number,
  maxResultCount: number,
  callback?: () => void,
) => {
  try {
    if (!data.chainId || !data.projectId || !data.whitelistHash) return;
    const params = formatObjEmpty({
      ...data,
      skipCount,
      maxResultCount,
    });
    const list: IWhiteListTagsResponse = await fetchGetTags(params);
    if (list && list?.items) {
      store.dispatch(
        setWhiteListInfo({
          userLevelList: list,
        }),
      );
    }
  } catch (error) {
    console.debug(error, '====error');
  }

  callback && callback();
};
