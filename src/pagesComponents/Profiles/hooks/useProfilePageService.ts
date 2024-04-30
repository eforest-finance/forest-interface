import { useRequest } from 'ahooks';
import { fetchNftInfos, fetchUserInfo } from 'api/fetch';
import { useParams } from 'next/navigation';
import { useLocalStorage } from 'react-use';
import storages from 'storages';

export function useProfilePageService() {
  const params = useParams();
  const { address } = params as {
    address: string;
  };

  const [walletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);

  const walletAddress = address || walletInfo?.address || '';

  const { data: userInfo } = useRequest(
    () => {
      if (!walletAddress) return Promise.resolve(null);
      return fetchUserInfo({ address: walletAddress });
    },
    {
      refreshDeps: [walletAddress],
    },
  );

  const { data: collectedData } = useRequest(() =>
    fetchNftInfos({
      SkipCount: 0,
      MaxResultCount: 1,
      Status: 2,
      Address: walletAddress ?? '',
      Sorting: 'ListingTime DESC',
    }),
  );

  const { data: createdData } = useRequest(() =>
    fetchNftInfos({
      IssueAddress: walletAddress ?? undefined,
      Address: walletAddress ?? '',
      SkipCount: 0,
      MaxResultCount: 1,
      Sorting: 'ListingTime DESC',
    }),
  );

  return {
    userInfo,
    walletAddress,
    collectedTotalCount: collectedData?.totalCount,
    createdTotalCount: createdData?.totalCount,
  };
}
