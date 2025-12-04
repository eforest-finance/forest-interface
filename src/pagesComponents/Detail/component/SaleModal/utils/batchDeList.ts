import { BatchCancelList, BatchCancelOfferList, BatchDeList } from 'contract/market';
import { BatchDeListType, IBatchDeListParams } from 'contract/type';
import { message } from 'antd';

const batchDeList = async (params: IBatchDeListParams, chainId: Chain) => {
  try {
    await BatchDeList(
      {
        ...params,
        batchDelistType:
          params.batchDelistType === BatchDeListType.EQUAL
            ? BatchDeListType.LESS_THAN_OR_EQUALS
            : params.batchDelistType,
      },
      {
        chain: chainId,
      },
    );
    return true;
  } catch (error) {
    message.error(error?.errorMessage?.message);
    return Promise.reject(error);
  }
};

export default batchDeList;
