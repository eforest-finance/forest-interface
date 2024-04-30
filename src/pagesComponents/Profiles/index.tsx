'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileBanner from './components/ProfileBanner';
import styles from './Profile.module.css';
import CollectedMenu from 'assets/images/CollectedMenu.svg';
import Created from 'assets/images/Created.svg';
import { useProfilePageService } from './hooks/useProfilePageService';
import TabsHeader from 'components/TabsHeader/TabsHeader';
import { useHash } from 'react-use';
import { Layout } from 'antd';
import { FilterContainer } from 'pagesComponents/ExploreItem/components/Filters';
import useResponsive from 'hooks/useResponsive';
import { useFilterService } from './hooks/useFilterService';
import { useDataService } from './hooks/useDataService';
import { LoadingMore } from 'baseComponents/LoadingMore';
import { NFTList } from './components/NFTList';
import { INftInfoParams } from 'api/types';
import { getParamsFromFilter } from './helper';
import FilterTags from 'pagesComponents/ExploreItem/components/FilterTags';
import { getTagList } from 'pagesComponents/ExploreItem/components/Filters/util';
import Button from 'baseComponents/Button';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';
import { useWebLogin } from 'aelf-web-login';
import clsx from 'clsx';

export default function Profile() {
  const navigate = useRouter();

  const [hash, setHash] = useHash();
  const [activeKey, setActiveKey] = useState<string>(hash?.slice(1) ?? '');

  const { isLG } = useResponsive();
  const [collapsed, setCollapsed] = useState<boolean>(isLG);

  const { wallet } = useWebLogin();

  const { createdTotalCount, collectedTotalCount, userInfo, walletAddress } = useProfilePageService();
  const { filterList, filterSelect, clearAll, onFilterChange } = useFilterService();

  const requestParams = useMemo(() => {
    const params = getParamsFromFilter(activeKey, walletAddress, filterSelect);
    return params as Partial<INftInfoParams>;
  }, [activeKey, filterSelect, walletAddress]);

  const { loading, loadingMore, noMore, data } = useDataService({
    params: requestParams,
    loginAddress: wallet?.address,
  });

  const tagList = useMemo(() => {
    return getTagList(filterSelect, '');
  }, [filterSelect]);

  useEffect(() => {
    if (!walletAddress) return navigate.push('/collections');
  }, []);
  const tabsArr = [
    {
      title: 'Collected',
      key: 'Collected',
      icon: <CollectedMenu />,
      tips: collectedTotalCount || 0,
    },
    {
      title: 'Created',
      key: 'Created',
      icon: <Created />,
      tips: createdTotalCount || 0,
    },
  ];

  return (
    <>
      <div className={`${styles['profile']} ${userInfo?.bannerImage ? 'has-banner' : ''}`}>
        <ProfileBanner
          bannerImage={userInfo?.bannerImage || ''}
          profileImage={userInfo?.profileImage || ''}
          name={userInfo?.name || ''}
          address={userInfo?.fullAddress || ''}
          email={userInfo?.email || ''}
          twitter={userInfo?.twitter || ''}
          instagram={userInfo?.instagram || ''}
        />
      </div>
      <TabsHeader
        tabNav={tabsArr}
        activeKey={activeKey}
        onChange={(activeKey: string) => {
          setActiveKey(activeKey);
          setHash(activeKey);
          clearAll();
        }}
      />

      <Layout className="!bg-fillPageBg">
        <FilterContainer
          filterList={filterList}
          filterSelect={filterSelect}
          open={!collapsed}
          onClose={() => {
            setCollapsed(true);
          }}
          mobileMode={isLG}
          onFilterChange={onFilterChange}
          clearAll={clearAll}
          pcRenderMode="left"
          toggleOpen={() => setCollapsed(!collapsed)}
        />
        <Layout className={clsx('!bg-fillPageBg', isLG ? '!p-4' : '!p-6')}>
          <FilterTags
            isMobile={isLG}
            tagList={tagList}
            SearchParam={''}
            filterSelect={filterSelect}
            clearAll={() => {
              clearAll();
            }}
            onchange={onFilterChange}
          />
          <div className="mb-4 font-medium text-base text-textPrimary rounded-lg px-6 py-4 bg-fillHoverBg">
            Your NFT possessions with quantities less than 1 are hidden.
          </div>
          <NFTList dataSource={data?.list || []} loading={loading} collapsed={collapsed} sizes={BoxSizeEnum.small} />
          {loadingMore ? <LoadingMore /> : null}
          {noMore && data?.list.length && !loading ? (
            <div className="text-center w-full text-textDisable font-medium text-base py-5">No more data</div>
          ) : null}
        </Layout>
      </Layout>
      {isLG ? (
        <Button
          type={'primary'}
          className="!fixed flex justify-center items-center text-base h-auto font-semibold p-4 backdrop-blur-[6px]  bottom-4 right-4 leading-normal !rounded-full"
          onClick={() => setCollapsed(false)}>
          Filter
        </Button>
      ) : null}
    </>
  );
}
