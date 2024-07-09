import { useRequest } from 'ahooks';
import { useState } from 'react';
import { fetchCollectionsByMyCreated, fetchNFTMyHoldSearch, fetchUserInfo, fetchAvatar } from 'api/fetch';
import { useParams } from 'next/navigation';
import { getDefaultFilterForMyItems } from 'pagesComponents/ExploreItem/components/Filters/util';
import { useLocalStorage } from 'react-use';
import storages from 'storages';
import useGetState from 'store/state/getState';
import { getParamsFromFilter } from '../helper';

export function useProfilePageService() {
  const params = useParams();
  const { address } = params as {
    address: string;
  };
  const { aelfInfo } = useGetState();

  const [walletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);

  const walletAddress = address || walletInfo?.address || '';

  const [avatar, setAvatar] = useState('');

  const { data: userInfo } = useRequest(
    async () => {
      // if (!walletAddress) return Promise.resolve(null);
      const res = await fetchUserInfo({ address: walletAddress });
      if (!res?.profileImage) {
        const avatar = await fetchAvatar();
        setAvatar(avatar);
      } else {
        setAvatar('');
      }

      return res;
    },
    {
      refreshDeps: [walletAddress],
    },
  );

  const defaultFilter = getDefaultFilterForMyItems(aelfInfo.curChain);
  const searchParams = getParamsFromFilter('collected', walletAddress, defaultFilter);

  const { data: collectedData } = useRequest(() => {
    if (!walletAddress)
      return Promise.resolve({
        items: [],
      });
    return fetchNFTMyHoldSearch(searchParams);
  });

  const { data: createdData } = useRequest(() => {
    if (!walletAddress) {
      return Promise.resolve({
        items: [],
      });
    }

    return fetchCollectionsByMyCreated(searchParams);
  });

  return {
    address,
    avatar,
    userInfo,
    walletAddress,
    collectedTotalCount: collectedData?.totalCount,
    createdTotalCount: createdData?.totalCount,
  };
}
