import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'store/store';
import { fetchIsMinter } from 'api/fetch';

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

export default function useIsMinter(nftCollectionId: string) {
  const { aelfChainAddress } = useSelector((store) => store.userInfo.walletInfo);
  const [info, setInfo] = useState<INftCollectionInfo>();
  const [isMinter, setIsMinter] = useState(false);
  const getProtocolInfo = useCallback(async () => {
    const result = await fetchIsMinter({
      nftCollectionId,
    });
    console.log(aelfChainAddress, 'aelfChainAddress');
    setIsMinter(result?.creatorAddress === aelfChainAddress);
    setInfo(result);
  }, [aelfChainAddress, nftCollectionId]);

  useEffect(() => {
    if (!nftCollectionId) return;
    getProtocolInfo();
  }, [nftCollectionId, getProtocolInfo]);
  return useMemo(() => {
    return {
      isMinter,
      collectionsInfo: info,
    };
  }, [isMinter, info]);
}
