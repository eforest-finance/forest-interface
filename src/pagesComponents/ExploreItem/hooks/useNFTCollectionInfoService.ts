import { useSelector } from 'store/store';
import { fetchNFTCollectionInfo } from 'api/fetch';
import { useRequest } from 'ahooks';

export interface INftCollectionInfo {
  id: string;
  chainId: string;
  symbol: string;
  tokenName: string;
  totalSupply: number;
  creatorAddress: string;
  proxyOwnerAddress: string;
  proxyIssuerAddress: string;
  creator?: {
    id: string;
    address: string;
    aelfAddress: string;
    caHash: string;
    caAddress: {
      additionalProp1: string;
      additionalProp2: string;
      additionalProp3: string;
    };
    name: string;
    profileImage: string;
    email: string;
    twitter: string;
    instagram: string;
  };
  isBurnable: boolean;
  issueChainId: string;
  metadata: [
    {
      key: string;
      value: string;
    },
  ];
  logoImage: string;
  featuredImage: string;
  baseUrl?: string;
  externalLink?: string;
  description: string;
  isOfficial: boolean;
  itemTotal: number;
  ownerTotal: number;
}

export default function useNFTCollectionInfoService(nftCollectionId: string) {
  const { aelfChainAddress } = useSelector((store) => store.userInfo.walletInfo);

  const { data: nftCollectionInfo } = useRequest(
    () => {
      if (!nftCollectionId) return Promise.resolve(undefined);
      return fetchNFTCollectionInfo({ nftCollectionId });
    },
    {
      refreshDeps: [nftCollectionId],
      cacheKey: `explore-item-${nftCollectionId}`,
      staleTime: 300000,
    },
  );

  const isMinter = !!aelfChainAddress && nftCollectionInfo?.creatorAddress === aelfChainAddress;

  return {
    currentUserIsMinter: !!isMinter,
    nftCollectionInfo,
  };
}
