import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
import { SECOND_PER_ONE_HOUR } from 'constants/time';
import { GetListedNFTInfoList } from 'contract/market';
import { GetBalance } from 'contract/multiToken';
import { IListedNFTInfo } from 'contract/type';
import moment from 'moment';
import { INftInfo } from 'types/nftTypes';

const getMaxNftQuantityOfSell = async (chainId: Chain, nftInfo: INftInfo, address: string) => {
  try {
    const { balance } = await GetBalance({
      symbol: nftInfo?.nftSymbol,
      owner: address,
    });

    if (balance === 0) {
      return false;
    }

    const res = await GetListedNFTInfoList(
      {
        symbol: nftInfo.nftSymbol,
        owner: address,
      },
      {
        chain: chainId,
      },
    );

    console.log('GetListedNFTInfoList', res);

    if (res?.error || !res?.value) {
      return {
        max: balance,
        listedNFTInfoList: [],
      };
    }

    const validList = res.value.filter((item: IListedNFTInfo) => {
      const time = Number(item.duration.startTime.seconds) + Number(item.duration.durationHours) * SECOND_PER_ONE_HOUR;
      const curTime = moment().unix();
      return curTime < time;
    });

    const q = validList.reduce((o: BigNumber, c: IListedNFTInfo) => {
      const { quantity } = c || {};
      return o.plus(quantity);
    }, ZERO);

    const quantity = new BigNumber(balance ?? 0)?.minus(q ?? 0).toNumber();

    const maxQuantity = Math.max(quantity, 0);
    return {
      max: maxQuantity,
      listedNFTInfoList: validList,
    };
  } catch (error) {
    return {
      max: 0,
      listedNFTInfoList: [],
    };
  }
};

export default getMaxNftQuantityOfSell;
