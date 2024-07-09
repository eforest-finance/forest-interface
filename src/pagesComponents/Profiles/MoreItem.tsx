import { CollectionItemsSearch } from 'pagesComponents/ExploreItem/components/CollectionItemsSearch';
import { dropDownCollectionsMenu } from 'components/ItemsLayout/assets';
import { Layout, message } from 'antd';
import Button from 'baseComponents/Button';

import clsx from 'clsx';
import { useHMService } from './hooks/useHMService';
import { OffersOrListingTable } from './components/OffersOrListingTable';

import { fetchReceivedOffer, fetchOfferMade, fetchMoreListings } from 'api/fetch';

import styles from './Profile.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { useOfferTable } from './hooks/useOfferTable';
import useGetState from 'store/state/getState';
import { useProfilePageService } from './hooks/useProfilePageService';
import useActionService from './hooks/useActionService';
import { IActivitiesItem } from 'api/types';
import PageLoading from 'components/PageLoading';

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
  const { walletInfo, aelfInfo } = useGetState();
  const { login, isLogin } = useCheckLoginAndToken();
  const { address: walletAddress } = useProfilePageService();
  const activityKeyRef = useRef(activityKey);

  const { cancelAllListings, loading: pageLoading } = useActionService({
    onFinish: () => {
      reset();
    },
  });
  const [dataSource, setDataSource] = useState<IActivitiesItem[]>();
  const [selectedRows, setSelectedRows] = useState<IActivitiesItem[]>();
  const [selectedRowKeys, setSelectedRowsKeys] = useState<React.Key[] | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(false);

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
    console.log('fetchData: key2:', activityKeyRef.current);

    try {
      const params = {
        searchParam: searchInputValue,
        skipCount: 0,
        maxResultCount: 100,
        chainList: [aelfInfo?.curChain],
        address: walletAddress || '',
      };
      let items = [] as any;
      switch (activityKeyRef.current) {
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
      setDataSource(
        items.map((item: any, key: number) => {
          return {
            key,
            ...item,
          };
        }),
      );
    } catch (error: any) {
      message.error(error);
    }
    setLoading(false);
  };

  const handleAction = () => {
    console.log('fetchData: key1:', activityKeyRef.current);
    reset();
  };

  const reset = () => {
    setSelectedRows([]);
    fetchData();
    setSelectedRowsKeys(undefined);
  };

  const { tableColumns } = useOfferTable({
    activityKey,
    walletAddress,
    fetchTableData: fetchData,
    onAction: handleAction,
  });

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
  }, [searchInputValue]);

  useEffect(() => {
    activityKeyRef.current = activityKey;
    if (walletAddress) {
      setSearchInputValue('');
      setSelectedRowsKeys([]);
      fetchData();
    } else {
      login();
    }
  }, [activityKey]);

  const getTitle = () => {
    let title = 'Offers made';
    switch (activityKeyRef.current) {
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IActivitiesItem[]): void => {
      setSelectedRows(selectedRows);
      setSelectedRowsKeys(selectedRowKeys);
    },
  };

  const canShow = isLogin && walletAddress === walletInfo.address && activityKeyRef.current !== moreActiveKey.receive;

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
        <Layout className={clsx('!bg-fillPageBg')}>
          <div className="mb-4 font-medium text-base text-textPrimary rounded-lg px-6 py-4 bg-fillHoverBg">
            Your NFT possessions with quantities less than 1 are hidden.
          </div>
          <div className="flex justify-between">
            <h1 className="text-textPrimary font-medium text-[18px]">{getTitle()}</h1>
            {canShow && (
              <Button
                type="default"
                size="middle"
                className="!rounded-md font-medium text-[14px] leading-[22px]"
                onClick={async () => {
                  if (!selectedRows?.length) {
                    message.info('please select offers');
                    return;
                  }

                  if (selectedRows.length > 30) {
                    message.info('You can choose at most 30 offers');
                    return;
                  }

                  cancelAllListings(
                    activityKeyRef.current === moreActiveKey.made ? 'offer' : 'active',
                    selectedRows!,
                    aelfInfo?.curChain,
                  );
                }}>
                Cancel all
              </Button>
            )}
          </div>
          <OffersOrListingTable
            dataSource={dataSource!}
            columns={tableColumns}
            rowSelection={!isLogin || activityKeyRef.current === moreActiveKey.receive ? undefined : rowSelection}
            loading={loading}
          />
        </Layout>
      </Layout>
      {pageLoading && (
        <div className="relative w-screen h-screen">
          <PageLoading />
        </div>
      )}
    </div>
  );
}
