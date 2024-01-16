import { GetAddressFromWhitelist, GetTagInfoFromWhitelist, GetWhitelist, GetWhitelistDetail } from 'contract/whiteList';
import { IGetExtraInfoByTagInput } from 'contract/type';

export const getWhiteList = async ({ chainId, whitelistId }: { chainId?: Chain; whitelistId?: string | null }) => {
  if (!whitelistId) return;
  const res = await GetWhitelist(whitelistId, {
    chain: chainId,
  });
  return res;
};

export const getTagInfoFromWhitelist = (v: IGetExtraInfoByTagInput) => {
  const { whitelistId, projectId, tagInfo } = v;
  return GetTagInfoFromWhitelist({
    whitelistId,
    projectId,
    tagInfo,
  });
};

export const getWhitelistDetail = (whitelistId: string, contract?: Chain) => {
  if (!whitelistId) return;
  return GetWhitelistDetail(
    {
      whitelistId,
    },
    {
      chain: contract,
    },
  );
};

export const getAddressFromWhitelist = (whitelistId?: string, address?: string, contract?: Chain) => {
  if (!whitelistId || !address) return;
  return GetAddressFromWhitelist(
    {
      whitelistId,
      address,
    },
    {
      chain: contract,
    },
  );
};
