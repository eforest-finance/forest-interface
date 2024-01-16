import BigNumber from 'bignumber.js';
import { SECOND_PER_MINUTES, SECOND_PER_ONE_HOUR } from 'constants/time';
import { BatchDeListType, IListDuration, IListedNFTInfo } from 'contract/type';
import { divDecimals } from 'utils/calculate';

export enum EditStatusType {
  timeGreater = 0,
  priceGreater = 1,
}

export const inValidListErrorMessage = {
  portkey: {
    [BatchDeListType.LESS_THAN]: [
      'To raise the listing price, please cancel any existing listings at a lower price before initiating a new listing.',
      'Please wait for auto confirmation.',
    ],
    [BatchDeListType.LESS_THAN_OR_EQUALS]: [
      'To raise the listing price and reduce the listing duration, please cancel any existing listings at a lower price and with a longer duration before initiating a new listing.',
      'Please wait for auto confirmation.',
    ],
    [BatchDeListType.EQUAL]: [
      'To reduce the listing duration, please cancel any existing listings with a longer duration before initiating a new listing.',
      'Please wait for auto confirmation.',
    ],
    [BatchDeListType.GREATER_THAN]: [''],
    [BatchDeListType.GREATER_THAN_OR_EQUALS]: [''],
  },
  default: {
    [BatchDeListType.LESS_THAN]: [
      'To raise the listing price, please cancel any existing listings at a lower price before initiating a new listing.',
      'Please confirm the transaction in the wallet.',
    ],
    [BatchDeListType.LESS_THAN_OR_EQUALS]: [
      'To raise the listing price and reduce the listing duration, please cancel any existing listings at a lower price and with a longer duration before initiating a new listing.',
      'Please confirm the transaction in the wallet.',
    ],
    [BatchDeListType.EQUAL]: [
      'To reduce the listing duration, please cancel any existing listings with a longer duration before initiating a new listing.',
      'Please confirm the transaction in the wallet.',
    ],
    [BatchDeListType.GREATER_THAN]: [''],
    [BatchDeListType.GREATER_THAN_OR_EQUALS]: [''],
  },
};

export const editSuccessTipMessage = {
  [EditStatusType.priceGreater]:
    "For listings that reduce the price, Forest won't cancel existing listings to save on transaction fees. However, you can manually cancel them if you prefer.",
  [EditStatusType.timeGreater]:
    "For listings that extend the duration, Forest won't cancel existing listings to save on transaction fees. However, you can manually cancel them if you prefer.",
};

const checkListValidity: (
  price: string,
  listedNFTInfoList: IListedNFTInfo[],
  duration: IListDuration,
) => {
  status: BatchDeListType;
  extendStatus: EditStatusType;
  invalidList: IListedNFTInfo[];
} = (price, listedNFTInfoList, duration) => {
  let status = BatchDeListType.GREATER_THAN;
  const curPriceBig = new BigNumber(price);
  let extendStatus = EditStatusType.priceGreater;

  const invalidList = listedNFTInfoList.filter((item: IListedNFTInfo) => {
    const price = divDecimals(new BigNumber(item.price.amount), 8);

    if (curPriceBig.comparedTo(price) === 1) {
      status =
        status === BatchDeListType.GREATER_THAN
          ? BatchDeListType.LESS_THAN
          : status === BatchDeListType.EQUAL
          ? BatchDeListType.LESS_THAN_OR_EQUALS
          : status;
      return true;
    } else if (curPriceBig.comparedTo(price) === 0) {
      const time =
        Number(item.duration.startTime.seconds) +
        Number(item.duration.durationHours || 0) * SECOND_PER_ONE_HOUR +
        Number(item.duration.durationMinutes || 0) * SECOND_PER_MINUTES;
      const curTime =
        Number(duration.startTime.seconds) +
        Number(duration.durationHours || 0) * SECOND_PER_ONE_HOUR +
        Number(duration.durationMinutes || 0) * SECOND_PER_MINUTES;
      if (curTime < time) {
        status = status === BatchDeListType.LESS_THAN ? BatchDeListType.LESS_THAN_OR_EQUALS : BatchDeListType.EQUAL;
        return true;
      }
      if (curTime > time) {
        extendStatus = EditStatusType.timeGreater;
      }
      return false;
    }
  });
  return {
    status,
    invalidList,
    extendStatus,
  };
};

export default checkListValidity;
