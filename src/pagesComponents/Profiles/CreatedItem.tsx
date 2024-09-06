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
import { useHMService } from './hooks/useHMService';
import { CollectionListSwiper } from './components/CollectionList';
import AuthNavLink from 'components/AuthNavLink/AuthNavLink';
import useGetState from 'store/state/getState';

export function CreatedItem() {
  const { walletAddress } = useProfilePageService();

  const {
    isLG,
    collapsedFilter,
    setCollapsedFilter,
    // sort,
    // setSort,
    // setSearchParam,
    // SearchParam,
    // searchInputValue,
    // searchInputValueChange,
  } = useHMService();

  // const { filterList, filterSelect, clearAll, onFilterChange, collectionInfos, totalCount, tagList } = useFilterService(
  //   'created',
  //   walletAddress,
  // );

  const {
    searchInputValue,
    searchInputValueChange,
    SearchParam,
    size,
    setSize,
    sort,
    setSort,
    setSearchParam,
    setSearchInputValue,
    filterList,
    filterSelect,
    clearAll,
    onFilterChange,
    collectionInfos,
    totalCount,
    tagList,
  } = useFilterService('created', walletAddress);

  const { walletInfo } = useGetState();

  const requestParams = useMemo(() => {
    const params = getParamsFromFilter('created', walletAddress, filterSelect);
    return {
      ...params,
      keyword: SearchParam,
      sorting: sort,
      Size: size,
    };
  }, [filterSelect, walletAddress, SearchParam, sort, size]);

  const { loading, loadingMore, noMore, data } = useDataService({
    params: requestParams,
    loginAddress: walletAddress,
    tabType: 'created',
  });

  return (
    <>
      <div className=" py-6 mdl:py-8 flex justify-between">
        <span className=" font-semibold text-xl mdl:text-2xl text-textPrimary">Collections ({totalCount})</span>

        {walletAddress === walletInfo.address && (
          <AuthNavLink to={'/my-collections'}>
            <div className="cursor-pointer flex justify-center items-center bg-fillCardBg rounded-[8px] text-textPrimary text-[14px] font-medium w-[95px] h-[40px]">
              View All
            </div>
          </AuthNavLink>
        )}
      </div>
      {!!collectionInfos.length && <CollectionListSwiper swiperData={collectionInfos} />}
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
              setSearchInputValue('');
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
