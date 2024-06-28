import { CollectionItemsSearch } from 'pagesComponents/ExploreItem/components/CollectionItemsSearch';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import { Layout, message } from 'antd';
import clsx from 'clsx';
import { useHMService } from './hooks/useHMService';
import { OffersOrListingTable } from './components/OffersOrListingTable';

import { fetchReceivedOffer, fetchOfferMade, fetchMoreListings } from 'api/fetch';

import styles from './Profile.module.css';
import { useEffect, useState } from 'react';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { useOfferTable } from './hooks/useOfferTable';
import useGetState from 'store/state/getState';
import { useProfilePageService } from './hooks/useProfilePageService';

export enum moreActiveKey {
  made = 'made',
  receive = 'receive',
  list = 'list',
}

export interface IMoreCard {
  activityKey: moreActiveKey;
}

export function MoreCard(props: IMoreCard) {
  const { activityKey } = props;
  const { login, isLogin } = useCheckLoginAndToken();
  const { address: walletAddress } = useProfilePageService();
  console.log(walletAddress);
  const [dataSource, setDataSource] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const { tableColumns } = useOfferTable({ activityKey, walletAddress });
  const { aelfInfo } = useGetState();

  const {
    isLG,
    collapsedFilter,
    setCollapsedFilter,
    size,
    setSize,
    sort,
    setSort,
    searchInputValue,
    searchInputValueChange,
    setSearchInputValue,
  } = useHMService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        searchParam: searchInputValue,
        skipCount: 0,
        maxResultCount: 100,
        chainList: [aelfInfo?.curChain],
        address: walletAddress || '',
      };
      let items = [] as any;
      switch (activityKey) {
        case moreActiveKey.made:
          {
            items = (await fetchOfferMade(params)).items;
          }

          break;
        case moreActiveKey.receive:
          {
            const params = {
              searchParam: searchInputValue,
              skipCount: 0,
              maxResultCount: 100,
              address: walletAddress || '',
            };
            items = (await fetchReceivedOffer(params)).items;
          }

          break;
        case moreActiveKey.list:
          {
            items = (await fetchMoreListings(params)).items;
          }
          break;

        default:
          break;
      }
      setDataSource(items);
    } catch (error: any) {
      message.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (walletAddress) {
      fetchData();
      setSearchInputValue('');
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchData();
    } else {
      login();
    }
  }, [searchInputValue, activityKey]);

  console.log('tableColumns:', tableColumns);

  useEffect(() => {
    if (walletAddress) {
      setSearchInputValue('');
      fetchData();
    } else {
      login();
    }
  }, [activityKey]);

  const getTitle = () => {
    let title = 'Offers made';
    switch (activityKey) {
      case moreActiveKey.made:
        title = 'Offers made';
        break;
      case moreActiveKey.receive:
        title = 'Offers received';
        break;
      case moreActiveKey.list:
        title = 'Active listings';
        break;

      default:
        break;
    }
    return title;
  };

  return (
    <div className={styles.moreWrapper}>
      <CollectionItemsSearch
        hiddenFilter={true}
        hiddenSize={true}
        size={size}
        collapsed={collapsedFilter}
        collapsedChange={() => setCollapsedFilter(!collapsedFilter)}
        searchParams={{
          placeholder: 'Search by name',
          value: searchInputValue,
          onChange: searchInputValueChange,
          onPressEnter: searchInputValueChange,
        }}
        sizeChange={(size) => {
          setSize(size);
        }}
        selectTagCount={1}
        selectProps={{
          value: sort,
          defaultValue: dropDownCollectionsMenu.data[0].value,
          onChange: setSort,
        }}
      />

      <Layout className="!bg-fillPageBg">
        <Layout className={clsx('!bg-fillPageBg', isLG ? '!p-4' : '!p-6')}>
          <div className="mb-4 font-medium text-base text-textPrimary rounded-lg px-6 py-4 bg-fillHoverBg">
            Your NFT possessions with quantities less than 1 are hidden.
          </div>
          <h1 className="text-textPrimary font-medium text-[18px]">{getTitle()}</h1>
          <OffersOrListingTable dataSource={dataSource} columns={tableColumns} loading={loading} />
        </Layout>
      </Layout>
    </div>
  );
}
