import { fetchWhitelistExtraInfos } from 'api/fetch';
import { IWhitelistExtraInfosParams, IWhitelistExtraInfosResponse } from 'api/types';
import { store } from 'store/store';
import { setWhiteListInfo } from 'store/reducer/saleInfo/whiteListInfo';

export const fetchListFilter = async (
  type: 'whitelistInfoList' | 'projectWhiteList',
  data: IWhitelistExtraInfosParams,
  callback?: () => void,
) => {
  try {
    const list: IWhitelistExtraInfosResponse = await fetchWhitelistExtraInfos(data);
    store.dispatch(
      setWhiteListInfo({
        [type]: {
          items: list?.items || [],
          totalCount: data.skipCount === 0 && !list?.items?.length ? 0 : list?.totalCount,
        },
        [type === 'projectWhiteList' ? 'initRemoveTool' : 'initViewTool']: {
          tag: data?.tagHash ?? 'ALL',
          search: data?.searchAddress,
        },
      }),
    );
  } catch (error) {
    console.debug(error, '====error');
  }
  callback && callback();
};
