import { useRequest } from 'ahooks';
import {
  FilterKeyEnum,
  ICompProps,
  IFilterSelect,
  ItemsSelectSourceType,
  getComponentByType,
  getDefaultFilter,
  getFilter,
  getFilterList,
} from '../type';
import { useParams } from 'next/navigation';
import useGetState from 'store/state/getState';
import { fetchCollectionAllTraitsInfos, fetchCollectionGenerationInfos } from 'api/fetch';
import { useMemo, useState } from 'react';
import SearchCheckBoxGroups from '../components/SearchCheckBoxGroups';
import { ICollectionTraitInfo } from 'api/types';

export function useFilterService() {
  const { address } = useParams();
  const nftCollectionId = String(address);
  const { aelfInfo } = useGetState();
  const nftType = String(nftCollectionId).endsWith('-SEED-0') ? 'seed' : 'nft';

  const filterList = getFilterList(nftType, aelfInfo.curChain);
  const defaultFilter = getDefaultFilter(aelfInfo.curChain);

  const [filterSelect, setFilterSelect] = useState<IFilterSelect>(defaultFilter);

  const { data: generationInfos } = useRequest(() => fetchCollectionGenerationInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
  });
  const { data: traitsInfo } = useRequest(() => fetchCollectionAllTraitsInfos(nftCollectionId), {
    refreshDeps: [nftCollectionId],
  });

  const filterChange = (val: ItemsSelectSourceType) => {
    setFilterSelect({ ...filterSelect, ...val });
    const filter = getFilter({ ...filterSelect, ...val });
    console.log('filterChange', filterSelect, filter);
  };

  return {
    filterList,
    generationInfos,
    traitsInfo,
    filterSelect,
    filterChange,
    filterSelect,
  };
}
