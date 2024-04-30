import { useMemo, useState } from 'react';
import { BoxSizeEnum, CollectionItemsSearch } from './components/CollectionItemsSearch';
import useResponsive from 'hooks/useResponsive';
import { thousandsNumber } from 'utils/unitConverter';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';

import { useWebLogin } from 'aelf-web-login';
import { Layout } from 'antd';
import { NFTList } from './components/NFTList';
import { LoadingMore } from 'baseComponents/LoadingMore';
import { FilterContainer } from './components/Filters';
import { useFilterForItemService } from './hooks/useFilterForItemService';
import { getFilter, getTagList } from './components/Filters/util';
import FilterTags from './components/FilterTags';
import { useNFTItemsDataService } from './hooks/useNFTItemsDataService';
import { CompositeNftInfosParams } from 'api/types';
import { useDebounceFn } from 'ahooks';

interface IExploreItemsProps {
  nftCollectionId: string;
  ELFToDollarRate: number;
  totalChange?: (value: number) => void;
}

export function ExploreItem({ nftCollectionId, ELFToDollarRate }: IExploreItemsProps) {
  const nftType = nftCollectionId.endsWith('-SEED-0') ? 'seed' : 'nft';

  const { wallet } = useWebLogin();

  const [size, setSize] = useState<BoxSizeEnum>(BoxSizeEnum.small);
  const { isLG } = useResponsive();
  const [collapsed, setCollapsed] = useState<boolean>(isLG);

  const { filterList, filterSelect, traitsInfo, generationInfos, onFilterChange, clearAll } =
    useFilterForItemService(nftCollectionId);

  const [SearchParam, setSearchParam] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const { run: changeSearchParam } = useDebounceFn(
    (searchKeyWord: string) => {
      setSearchParam(searchKeyWord.trim());
    },
    {
      wait: 500,
    },
  );

  const searchInputValueChange = (e: any) => {
    setSearchInputValue(e.target.value);
    changeSearchParam(e.target.value);
  };

  const [sort, setSort] = useState<string>(dropDownCollectionsMenu.data[0].value as string);

  const requestParams = useMemo(() => {
    const filter = getFilter(filterSelect);
    return {
      CollectionId: nftCollectionId,
      CollectionType: nftType,
      Sorting: sort,
      SearchParam: SearchParam,
      ...filter,
    } as Partial<CompositeNftInfosParams>;
  }, [filterSelect, SearchParam, nftCollectionId, sort, nftType]);

  const sortChange = (sort: string) => {
    setSort(sort);
  };

  const tagList = useMemo(() => {
    return getTagList(filterSelect, SearchParam.trim());
  }, [filterSelect, SearchParam]);

  const { data, loading, loadingMore, noMore } = useNFTItemsDataService({
    params: requestParams,
    userWalletAddress: wallet?.address,
  });

  return (
    <>
      <CollectionItemsSearch
        size={size}
        collapsed={collapsed}
        collapsedChange={() => setCollapsed(!collapsed)}
        searchParams={{
          placeholder: 'Search for names or token symbols',
          value: searchInputValue,
          onChange: searchInputValueChange,
          onPressEnter: searchInputValueChange,
        }}
        sizeChange={setSize}
        selectTagCount={tagList.length}
        selectProps={{
          value: sort,
          defaultValue: dropDownCollectionsMenu.data[0].value,
          onChange: sortChange,
        }}
        extraInfo={`${thousandsNumber(data?.totalCount || 0)} ${(data?.totalCount || 0) < 2 ? 'result' : 'results'}`}
      />
      <Layout className="!bg-fillPageBg">
        <FilterContainer
          filterList={filterList}
          filterSelect={filterSelect}
          traitsInfo={traitsInfo?.items}
          generationInfos={generationInfos?.items}
          open={!collapsed}
          onClose={() => {
            setCollapsed(true);
          }}
          mobileMode={isLG}
          onFilterChange={onFilterChange}
          clearAll={clearAll}
        />
        <Layout className="!bg-fillPageBg">
          <div className=" sticky top-36 z-[1] bg-fillPageBg overflow-hidden h-0 lgTW:h-auto">
            <FilterTags
              isMobile={isLG}
              tagList={tagList}
              SearchParam={SearchParam}
              filterSelect={filterSelect}
              clearAll={() => {
                setSearchParam('');
                clearAll();
              }}
              onchange={onFilterChange}
              clearSearchChange={() => setSearchParam('')}
            />
          </div>
          {isLG && data?.totalCount ? (
            <div className=" text-base font-medium text-textPrimary pb-2">
              {thousandsNumber(data.totalCount)} {data.totalCount < 2 ? 'result' : 'results'}
            </div>
          ) : null}
          <NFTList
            dataSource={data?.list || []}
            collapsed={collapsed}
            sizes={size}
            loading={loading}
            ELFToDollarRate={ELFToDollarRate}
          />
          {loadingMore ? <LoadingMore /> : null}
          {noMore && data?.list?.length && !loading ? (
            <div className="text-center w-full text-textDisable font-medium text-base py-5">No more data</div>
          ) : null}
        </Layout>
      </Layout>
    </>
  );
}
