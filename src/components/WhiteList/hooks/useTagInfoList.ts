import { fetchGetTags } from 'api/fetch';
import { MAX_RESULT_COUNT_100 } from 'constants/common';
import { IWhiteListTagsItem } from 'api/types';

interface FetchTagInfoParam {
  whitelistId?: string;
  projectId?: string | null;
  chainId?: Chain | null;
  time?: number;
}

export const fetchTagInfoListById = async ({ whitelistId, projectId, chainId }: FetchTagInfoParam) => {
  try {
    if (!whitelistId || !projectId || !chainId) return;
    const list = await fetchGetTags({
      whitelistHash: whitelistId,
      projectId: projectId,
      chainId,
      skipCount: 0,
      maxResultCount: MAX_RESULT_COUNT_100,
    });

    if (list && list?.items) {
      const tagList = list.items?.map((item: IWhiteListTagsItem) => ({
        value: item?.tagHash,
        label: item?.name,
      }));
      return tagList;
    }

    return;
  } catch (error) {
    /* empty */
    return;
  }
};
