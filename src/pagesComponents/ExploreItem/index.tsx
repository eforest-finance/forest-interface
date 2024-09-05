import { useParams, useRouter } from 'next/navigation';
import useNFTCollectionInfoService from './hooks/useNFTCollectionInfoService';
import { CollectionsInfoCard } from './components/CollectionInfoCard';
import { ExploreTab } from './components/ExploreTab';
import { useGetELFToDollarRate } from './hooks/useGetELFRateService';

import clsx from 'clsx';
import { ExploreItem } from './ExploreItem';
import { ActivityItem } from './ActivityItem';

export default function ExploreItemPage() {
  const { address } = useParams();
  const nftCollectionId = address[0];
  const activeTab = address[1];

  const { ELFToDollarRate } = useGetELFToDollarRate();
  const { nftCollectionInfo, currentUserIsMinter } = useNFTCollectionInfoService(nftCollectionId);

  return (
    <div className="px-4 smTW:px-10">
      <CollectionsInfoCard collectionsInfo={nftCollectionInfo} showAddNftBtn={currentUserIsMinter} />
      <ExploreTab
        items={[
          {
            label: (
              <span
                className={clsx(
                  'text-base font-semibold text-textSecondary',
                  activeTab !== 'activity' && '!text-textPrimary',
                )}>
                Items
              </span>
            ),
            key: 'items',
            children: <ExploreItem nftCollectionId={nftCollectionId} ELFToDollarRate={ELFToDollarRate} />,
          },
          {
            label: (
              <span
                className={clsx(
                  'text-base font-semibold text-textSecondary',
                  activeTab === 'activity' && '!text-textPrimary',
                )}>
                Activity
              </span>
            ),
            key: 'activity',
            children: <ActivityItem nftCollectionId={nftCollectionId} />,
          },
        ]}
        defaultActiveKey={activeTab || 'items'}
        onChange={(key) => {
          history.pushState(null, '', `/explore-items/${nftCollectionId}/${key}`);
        }}
      />
    </div>
  );
}
