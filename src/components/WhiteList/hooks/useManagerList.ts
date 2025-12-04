import { useCallback, useEffect, useState } from 'react';
import { IManagerItem } from 'store/reducer/saleInfo/type';
import { fetchWhitelistManagers } from 'api/fetch';
import { MAX_RESULT_COUNT_100 } from 'constants/common';
import useGetState from 'store/state/getState';

export const useManagerList = ({
  chainId,
  whitelistHash,
  projectId,
}: {
  chainId?: Chain | null;
  whitelistHash?: string;
  projectId?: string;
}) => {
  const [list, setList] = useState<IManagerItem[]>();
  const { walletInfo } = useGetState();
  const fetch = useCallback(async () => {
    if (!chainId || !projectId || !whitelistHash) return;
    const res = await fetchWhitelistManagers({
      chainId,
      projectId,
      whitelistHash,
      skipCount: 0,
      maxResultCount: MAX_RESULT_COUNT_100,
      address: walletInfo.address,
    });
    if (res?.error) return;
    if (res?.items) {
      setList(res?.items ?? []);
    }
  }, [chainId, projectId, walletInfo.address, whitelistHash]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return list;
};
