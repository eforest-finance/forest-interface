import { openModal } from 'store/reducer/errorModalInfo';
import { store } from 'store/store';
import { fetchCollections } from 'api/fetch';
import { useCallback } from 'react';
import useGetState from 'store/state/getState';

export interface Creator {
  email: string;
  instagram: string;
  twitter: string;
  id: string;
  name: string;
  address: string;
  profileImage: string;
}

export interface Item {
  logoImage: string | undefined;
  featuredImage: string | undefined;
  id: string;
  chainId: Chain;
  symbol: string;
  nftType: string;
  supply?: number;
  totalSupply: number;
  description: string;
  creator: Creator;
  isBurnable: boolean;
  issueChainId: Chain;
  isOfficial: Boolean;
  baseUrl: string;
  tokenName?: string;
  proxyIssuerAddress?: string;
  proxyOwnerAddress?: string;
  metadata?: Array<{ key: string; value: string }>;
  isMainChainCreateNFT?: boolean;
}

export interface Collections {
  items: Item[];
}

export const useCollections = (requestType?: 'creator' | 'address', allChain?: boolean) => {
  const { walletInfo: walletInfoStore } = useGetState();

  const { aelfChainAddress: account, address } = (walletInfoStore || {}) as WalletInfoType;
  const getList = useCallback(
    async (type: string, page: number, maxResultCount: number, callback: any) => {
      console.log('execute getList');
      if (!type) return;
      if (!account && requestType) return;

      let params: {
        skipCount?: number;
        maxResultCount?: number;
        addressList?: string[];
        address?: string;
        creator?: string;
      } = {
        skipCount: page * maxResultCount,
        maxResultCount,
      };

      if (requestType === 'creator') {
        params.creator = account;
      }

      if (requestType === 'address') {
        if (allChain) {
          params.addressList = [account || '', address];
        } else {
          params.address = account;
        }
      }

      const result = await fetchCollections(params);
      if (!result) store.dispatch(openModal());
      callback?.(result?.items);
    },
    [account, requestType],
  );

  return getList;
};
