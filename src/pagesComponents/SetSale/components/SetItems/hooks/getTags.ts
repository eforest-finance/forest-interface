import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { decodeProtoBase64ToMap } from 'utils/aelfUtils';
import { divDecimals } from 'utils/calculate';
import { RankType } from '../SetItems';
import useGetState from 'store/state/getState';
import { GetTagInfoListByWhitelist, GetWhitelist } from 'contract/whiteList';
import { ITagInfo } from 'contract/type';

const protoJson = {
  nested: {
    PriceTag: {
      fields: {
        symbol: {
          type: 'string',
          id: 1,
        },
        amount: {
          type: 'int64',
          id: 2,
        },
      },
    },
  },
};

export default function useGetTags({
  chainId,
  symbol,
  whitelistId,
}: {
  chainId?: Chain;
  symbol?: string;
  whitelistId?: string | null;
}) {
  const [tags, setTags] = useState<RankType>();
  const { walletInfo } = useGetState();

  const getTags = useCallback(async () => {
    if (!chainId || !symbol || !walletInfo.address || !whitelistId) return;
    const res = await GetWhitelist(whitelistId, {
      chain: chainId,
    });

    if (res?.projectId) {
      const tagInfo = await GetTagInfoListByWhitelist(
        {
          whitelistId: res.whitelistId,
          projectId: res.projectId,
        },
        {
          chain: chainId,
        },
      );

      if (tagInfo.error) return;

      const rank: RankType = Object.fromEntries(
        new Map(
          tagInfo?.value?.map((item: ITagInfo) => {
            try {
              const price = decodeProtoBase64ToMap(item?.info || '', protoJson, 'PriceTag');
              return [
                item.tagName,
                { price: { ...price, amount: divDecimals(new BigNumber(price?.amount), 8).valueOf() } },
              ];
            } catch (e) {
              return [item.tagName, { price: { symbol: '', amount: undefined } }];
            }
          }),
        ),
      );
      setTags(rank as RankType);
    }
  }, [chainId, symbol, walletInfo.address, whitelistId]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  return { tagInfo: tags, whitelistId };
}
