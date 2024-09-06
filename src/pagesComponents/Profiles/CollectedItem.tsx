import { CollectionItemsSearch } from 'pagesComponents/ExploreItem/components/CollectionItemsSearch';
import { FilterContainer } from 'pagesComponents/ExploreItem/components/Filters';

import { useMemo } from 'react';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import { Layout } from 'antd';
import { useFilterService } from './hooks/useFilterService';
import FilterTags from 'pagesComponents/ExploreItem/components/FilterTags';
import clsx from 'clsx';
import { NFTList } from 'pagesComponents/ExploreItem/components/NFTList';
import { LoadingMore } from 'baseComponents/LoadingMore';
import { useProfilePageService } from './hooks/useProfilePageService';
import { getParamsFromFilter } from './helper';
import { useDataService } from './hooks/useDataService';
import { useWebLogin } from 'aelf-web-login';
import { useHMService } from './hooks/useHMService';

export function CollectedItem() {
  const { wallet } = useWebLogin();
  const { walletAddress } = useProfilePageService();

  const { isLG, collapsedFilter, setCollapsedFilter } = useHMService();

  const {
    searchInputValue,
    SearchParam,
    setSearchParam,
    setSearchInputValue,
    searchInputValueChange,
    size,
    setSize,
    sort,
    setSort,
    filterList,
    filterSelect,
    clearAll,
    onFilterChange,
    collectionInfos,
    tagList,
  } = useFilterService('collected', walletAddress);

  const requestParams = useMemo(() => {
    const params = getParamsFromFilter('collected', walletAddress, filterSelect);
    return {
      ...params,
      keyword: SearchParam,
      Sorting: sort,
      Size: size,
    };
  }, [filterSelect, walletAddress, SearchParam, sort, size]);

  const { loading, loadingMore, noMore, data } = useDataService({
    params: requestParams,
    loginAddress: walletAddress,
    tabType: 'collected',
  });

  return (
    <>
      <CollectionItemsSearch
        size={size}
        collapsed={collapsedFilter}
        collapsedChange={() => setCollapsedFilter(!collapsedFilter)}
        searchParams={{
          placeholder: 'Search by name or symbol',
          value: searchInputValue,
          onChange: searchInputValueChange,
          onPressEnter: searchInputValueChange,
        }}
        sizeChange={(size) => {
          setSize(size);
        }}
        selectTagCount={tagList.length}
        selectProps={{
          value: sort,
          defaultValue: dropDownCollectionsMenu.data[0].value,
          onChange: setSort,
        }}
      />

      <Layout className="!bg-fillPageBg">
        <FilterContainer
          filterList={filterList}
          filterSelect={filterSelect}
          open={!collapsedFilter}
          collectionInfos={collectionInfos}
          onClose={() => {
            setCollapsedFilter(true);
          }}
          mobileMode={isLG}
          onFilterChange={onFilterChange}
          clearAll={clearAll}
          toggleOpen={() => setCollapsedFilter(!collapsedFilter)}
        />
        <Layout className={clsx('!bg-fillPageBg')}>
          <FilterTags
            isMobile={isLG}
            tagList={tagList}
            SearchParam={SearchParam}
            filterSelect={filterSelect}
            clearAll={() => {
              setSearchParam('');
              setSearchInputValue('');
              clearAll();
            }}
            onchange={onFilterChange}
            clearSearchChange={() => {
              setSearchParam('');
              setSearchInputValue('');
            }}
          />
          <div className="mb-4 font-medium text-base text-textPrimary rounded-lg px-6 py-4 bg-fillHoverBg">
            Your NFT possessions with quantities less than 1 are hidden.
          </div>
          <NFTList
            dataSource={data?.list || []}
            loading={loading}
            collapsed={collapsedFilter}
            sizes={size}
            ELFToDollarRate={0}
            hasSearch={tagList.length > 0}
            clearFilter={() => {
              setSearchParam('');
              clearAll();
            }}
          />
          {loadingMore ? <LoadingMore /> : null}
          {noMore && data?.list.length && !loading ? (
            <div className="text-center w-full text-textDisable font-medium text-base py-5">No more data</div>
          ) : null}
        </Layout>
      </Layout>
    </>
  );
}
