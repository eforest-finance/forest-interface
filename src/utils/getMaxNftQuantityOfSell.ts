import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
import { SECOND_PER_MINUTES } from 'constants/time';
import { GetListedNFTInfoList } from 'contract/market';
import { GetBalance } from 'contract/multiToken';
import { IListedNFTInfo } from 'contract/type';
import moment from 'moment';
import { INftInfo } from 'types/nftTypes';
import { divDecimals } from './calculate';

const getMaxNftQuantityOfSell = async (chainId: Chain, nftInfo: INftInfo, address: string) => {
  try {
    if (!nftInfo?.nftSymbol || !address || !chainId) return false;
    const { balance } = await GetBalance({
      symbol: nftInfo?.nftSymbol,
      owner: address,
    });
    const nftDecimals = nftInfo.decimals || 0;

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
        max: Math.floor(
          BigNumber(balance)
            .dividedBy(10 ** Number(nftDecimals))
            .toNumber(),
        ),
        listedNFTInfoList: [],
        listItems: 0,
      };
    }

    const validList = res.value.filter((item: IListedNFTInfo) => {
      const time = Number(item.duration.startTime.seconds) + Number(item.duration.durationMinutes) * SECOND_PER_MINUTES;
      const curTime = moment().unix();
      return curTime < time;
    });

    const q = validList.reduce((o: BigNumber, c: IListedNFTInfo) => {
      const { quantity } = c || {};
      return o.plus(divDecimals(quantity, nftDecimals || '0'));
    }, ZERO);

    const quantity = new BigNumber(balance ?? 0)
      .dividedBy(10 ** Number(nftDecimals))
      ?.minus(q ?? 0)
      .toNumber();

    const maxQuantity = Math.max(quantity, 0);
    return {
      max: Math.floor(maxQuantity),
      listedNFTInfoList: validList,
      listItems: q.toNumber(),
    };
  } catch (error) {
    return {
      max: 0,
      listedNFTInfoList: [],
      listItems: 0,
    };
  }
};

export default getMaxNftQuantityOfSell;
