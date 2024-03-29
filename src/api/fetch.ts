import { INftInfo, OfferType } from 'types/nftTypes';
import request, { cmsRequest, tokenRequest } from './request';
// import qs from 'query-string';
const qs = require('qs');
import {
  INftOffersParams,
  ITokens,
  ITokensParams,
  INftTypes,
  ITokenData,
  INftPricesParams,
  IPricesList,
  IListingsParams,
  IActivitiesParams,
  IActivities,
  IWhitelistPriceTokensResponse,
  INftInfoParams,
  IWhitelistExtraInfosParams,
  IWhitelistExtraInfosResponse,
  IWhitelistManagersParams,
  IWhiteListTagsParams,
  IWhiteListTagsResponse,
  IWhitelistManagersResponse,
  ISyncChainParams,
  ISyncChainResult,
  ISaveNftInfosParams,
  ICommunityItems,
  IListingsResponse,
  IUserSettingParams,
  INftCollectionParams,
  ITokenParams,
  IOwnedSymbolsResponse,
  IOwnedSymbolsParams,
  ISaveCollectionInfosParams,
  IConfigResponse,
  IRecommendCollectionsRes,
  ISpecialSeedParams,
  ISpecialSeedRes,
  IBidInfosResponse,
  IAuctionInfoResponse,
  IMinMarkupPriceResponse,
  CompositeNftInfosParams,
  INftInfoOwnersParams,
  INftInfoOwnersResponse,
  INftSaleInfoParams,
  INftSaleInfoItem,
  IDropDetailResponse,
  IDropQuotaResponse,
  ICollecionTraitsInfoRes,
  ICollecionGenerationInfoRes,
  INftRankingInfo,
  INftRankingInfoParams,
} from './types';
import { Collections } from '../pagesComponents/Collections/Hooks/useCollections';
import { ItemsSource } from '../components/ItemsLayout/types';
import { IWhitelistInfo } from 'store/reducer/saleInfo/type';
import {
  SearchCollections,
  requestSearchCollectionsParams,
} from 'pagesComponents/Collections/Hooks/useSearchCollections';
import { IRecommendedCollections } from 'pagesComponents/Collections/Hooks/useRecommendedCollections';
import { INftCollectionInfo } from 'hooks/useIsMinter';
import { ITransitionFee } from 'pagesComponents/Detail/hooks/useGetTransitionFee';

export const fetchChainsList = async (): Promise<Chain[]> => {
  return request.get<Chain[]>('app/chains');
};
export const fetchNftTypes = async (): Promise<INftTypes> => {
  return request.get<INftTypes>('app/nft/types');
};
export const fetchTokens = async (params: ITokensParams): Promise<ITokens> => {
  return request.get<ITokens>('app/market/purchase-tokens', { params });
};

export const fetchNftOffers = async (params: INftOffersParams): Promise<{ items: OfferType[]; totalCount: number }> => {
  return request.get<{ items: OfferType[]; totalCount: number }>('app/market/nft-offers', { params });
};

export const fetchUserInfo = async (params: { address: string }): Promise<UserInfoType> => {
  return request.get<UserInfoType>('app/users/by-address', { params });
};

export const fetchNftInfo = async (params: { id: string; address: string }): Promise<INftInfo> => {
  return request.get<INftInfo>('app/nft/nft-info', { params });
};

export const fetchNftTraitsInfo = async (params: { id: string }) => {
  return request.get<IDropQuotaResponse>('app/trait/nft-traits-info', { params });
};

export const fetchGetTokenData = async (params: { symbol: string }): Promise<ITokenData> => {
  return request.get<ITokenData>('app/tokens/market-data', { params });
};

export const fetchGetNftPrices = async (params: INftPricesParams): Promise<IPricesList> => {
  return request.get<IPricesList>('app/market/nft-market-data', { params });
};

export const fetchListings = async (params: IListingsParams): Promise<IListingsResponse> => {
  return request.get<IListingsResponse>('app/market/nft-listings', { params });
};

export const fetchActivities = async (params: string): Promise<IActivities> => {
  return request.get<IActivities>(`app/nft/activities?${params}`);
};

export const checkUserName = async (params: { name: string }): Promise<boolean> => {
  return request.get<boolean>('app/users/check-name', { params });
};

export const saveUserSettings = async (data: IUserSettingParams): Promise<boolean> => {
  return request.put<IUserSettingParams, boolean>('/app/users', data);
};

export const fetchCollections = async (params: {
  skipCount?: number;
  maxResultCount?: number;
}): Promise<Collections> => {
  return request.get<Collections>('/app/nft/nft-collections', { params });
};

export const fetchSearchCollections = async (params: requestSearchCollectionsParams): Promise<SearchCollections> => {
  return request.get<SearchCollections>('/app/nft/search-nft-collections', { params });
};

export const fetchRecommendedCollections = async (): Promise<IRecommendedCollections[]> => {
  return request.get<IRecommendedCollections[]>('/app/nft/recommended-collections');
};

export const editCollectionInfo = async (params: INftCollectionParams) => {
  return request.post<INftCollectionParams, Boolean>('app/nft/nft-collections', params);
};

export const fetchNftInfos = async (params: Partial<INftInfoParams>): Promise<ItemsSource> => {
  return request.get<ItemsSource>('app/nft/nft-infos-user-profile', { params });
};

// like fetchNftInfos, this is new port;
export const fetchCompositeNftInfos = async (params: Partial<CompositeNftInfosParams>) => {
  return request.post<Partial<CompositeNftInfosParams>, ItemsSource>('app/nft/composite-nft-infos', params);
};

export const fetchGetTags = async (params: IWhiteListTagsParams) => {
  return request.get<IWhiteListTagsResponse>('app/whitelist/tagInfos', { params });
};

export const fetchWhitelistByHash = async (params: { chainId: Chain; whitelistHash: string }) => {
  return request.get<IWhitelistInfo>('app/whitelist/hash', { params });
};
export const fetchWhitelistExtraInfos = async (params: IWhitelistExtraInfosParams) => {
  return request.get<IWhitelistExtraInfosResponse>('app/whitelist/extraInfoList', { params });
};
export const fetchWhitelistManagers = async (params: IWhitelistManagersParams) => {
  return request.get<IWhitelistManagersResponse>('app/whitelist/whitelistManagers', { params });
};

export const fetchWhiteListPriceTokens = async (params: { chainId: Chain; whitelistHash: string }) => {
  return request.get<IWhitelistPriceTokensResponse>('app/whitelist/priceTokenList', { params });
};

export const fetchSyncCollection = async (data: ISyncChainParams): Promise<null> => {
  return request.post<ISyncChainParams, null>('app/nft/sync', data);
};

export const fetchSyncResult = async (params: ISyncChainParams): Promise<ISyncChainResult> => {
  return request.get<ISyncChainResult>('app/nft/syncResult', { params });
};

export const fetchSyncResults = async (data: {
  skipCount?: string;
  maxResultCount?: string;
}): Promise<ISyncChainResult[]> => {
  return request.get<ISyncChainResult[]>('app/nft/syncResults', { data });
};

export const fetchSaveNftItemInfos = async (data: ISaveNftInfosParams): Promise<null> => {
  return request.post<ISaveNftInfosParams, null>('app/nft/nft-infos', data);
};

export const fetchSaveCollectionInfos = async (data: ISaveCollectionInfosParams): Promise<null> => {
  return request.post<ISaveCollectionInfosParams, null>('app/nft/nft-collections', data);
};

export const fetchIsMinter = async (params: { nftCollectionId: string }): Promise<INftCollectionInfo> => {
  return request.get<INftCollectionInfo>(`app/nft/nft-collection/${params.nftCollectionId}`, {});
};

export const fetchFooterNavItems = async (): Promise<ICommunityItems[]> => {
  return cmsRequest.get<ICommunityItems[]>('items/community', { baseURL: '/cms' });
};

export const fetchConfigItems = async (): Promise<IConfigResponse> => {
  return cmsRequest.get<IConfigResponse>('items/config', { baseURL: '/cms' });
};

export const fetchToken = async (data: ITokenParams) => {
  return tokenRequest.post<
    ITokenParams,
    {
      access_token: string;
      expires_in: number;
    }
  >('/token', qs.stringify(data));
};

export const fetchSymbolList = async (params: IOwnedSymbolsParams): Promise<IOwnedSymbolsResponse> => {
  return request.get<IOwnedSymbolsResponse>('app/nft/seed-owned-symbols', { params });
};

export const fetchSymbolHasExisted = async (params: { symbol: string }): Promise<{ exist: boolean }> => {
  return request.get<{ exist: boolean }>('app/market/symbol-info', { params });
};

export const fetchRecommendCollections = async (): Promise<IRecommendCollectionsRes> => {
  return request.get<IRecommendCollectionsRes>('app/nft/recommended-collections');
};

export const fetchSpecialSeeds = async (params: ISpecialSeedParams): Promise<ISpecialSeedRes> => {
  return request.get<ISpecialSeedRes>('app/seed/special-seeds', {
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
};
export const fetchAuctionInfo = async (params: { SeedSymbol: string }) => {
  return request.get<IAuctionInfoResponse>('app/bid/auction-info', { params });
};

export const fetchBidInfos = async (params: { SeedSymbol: string; SkipCount?: number; MaxResultCount?: number }) => {
  return request.get<IBidInfosResponse>('app/bid/bid-infos', { params });
};

export const fetchMinMarkupPrice = async (params: { Symbol: string }) => {
  return request.get<IMinMarkupPriceResponse>('app/seed/bid-price', { params });
};

export const fetchTransactionFee = async () => {
  return request.get<ITransitionFee>('app/seed/transaction-fee');
};

export const fetchNftInfoOwners = async (params: INftInfoOwnersParams) => {
  return request.get<INftInfoOwnersResponse>('app/nft/nft-info-owners', { params });
};

export const fetchNftSalesInfo = async (params: INftSaleInfoParams) => {
  return request.get<INftSaleInfoItem>('app/nft/nft-for-sale', { params });
};

export const fetchDropDetail = async (params: { dropId: string; address?: string }) => {
  return request.get<IDropDetailResponse>('app/drop/detail', { params });
};

export const fetchDropQuota = async (params: { dropId: string; address: string }) => {
  return request.get<IDropQuotaResponse>('app/drop/quota', { params });
};

export const fetchCollectionAllTraitsInfos = async (nftCollectionId: string) => {
  return request.post<
    {
      id: string;
      skipCount: number;
      maxResultCount: number;
    },
    ICollecionTraitsInfoRes
  >('app/trait/nft-collection-traits-info', {
    id: nftCollectionId,
    skipCount: 0,
    maxResultCount: 32,
  });
};

export const fetchCollectionGenerationInfos = async (nftCollectionId: string) => {
  return request.get<ICollecionGenerationInfoRes>('app/trait/nft-collection-generation-info', {
    params: { id: nftCollectionId },
  });
};

export const fetchNftRankingInfoApi = async (params: INftRankingInfoParams) => {
  return request.post<INftRankingInfoParams, INftRankingInfo[]>('probability/catsRank', params, {
    baseURL: '/scrodinger/api',
  });
};
