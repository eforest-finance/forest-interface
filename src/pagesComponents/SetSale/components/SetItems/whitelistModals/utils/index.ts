import { RankType } from '../../SetItems';
import { RepeatAddressType } from '../AddRankModal/AddRankModal';
import { getOriginalAddress } from 'utils';

export const checkRepeat = ({ address, rankName, rank }: { address: string; rankName?: string; rank?: RankType }) => {
  const isRepeat: RepeatAddressType[] = Object.keys(rank || {}).reduce((prev: RepeatAddressType[], curr) => {
    if (rank?.[curr].address?.find((i) => i?.includes(getOriginalAddress(address)))) {
      prev.push({ rank: curr, address });
    }
    return prev;
  }, []);
  return isRepeat;
};
