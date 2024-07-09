'use client';

import ProfileBanner from './components/ProfileBanner';
import styles from './Profile.module.css';
import { useProfilePageService } from './hooks/useProfilePageService';
import { ExploreTab } from 'pagesComponents/ExploreItem/components/ExploreTab';
import { CollectedItem } from './CollectedItem';
import { CreatedItem } from './CreatedItem';
import { ActivityItem } from './ActivityItem';
import { MoreCard, moreActiveKey } from './MoreItem';
import Dropdown from 'baseComponents/Dropdown';
import { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import Down from 'assets/images/arrow-down.svg';
import clsx from 'clsx';
import useGetState from 'store/state/getState';
import useTokenData from 'hooks/useTokenData';

export default function Profile() {
  const { userInfo, collectedTotalCount, createdTotalCount, avatar } = useProfilePageService();
  console.log(userInfo);

  const [activeKey, setActiveKey] = useState('collected');
  const [selectedKey, setSelectedKey] = useState<moreActiveKey>(moreActiveKey.made);
  const { address } = useProfilePageService();
  const { walletInfo, aelfInfo } = useGetState();
  const elfRate = useTokenData();

  const [bannerImage, setBannerImage] = useState(userInfo?.bannerImage);
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage);

  useEffect(() => {
    setBannerImage(userInfo?.bannerImage);
    setProfileImage(userInfo?.profileImage);
  }, [userInfo?.bannerImage, userInfo?.profileImage]);

  const onMoreMenuClick: MenuProps['onClick'] = ({ key }) => {
    setSelectedKey(key as moreActiveKey);
  };

  const handleProfileChange = (type: string, src: string) => {
    if (type === 'bannerImage') {
      setBannerImage(src);
    } else {
      setProfileImage(src);
    }
  };

  const itemsForMore: MenuProps['items'] = [
    {
      key: moreActiveKey.made,
      label: (
        <span
          onClick={() => {
            setActiveKey('more');
          }}>
          Offers made
        </span>
      ),
    },
    {
      key: moreActiveKey.receive,
      label: <span onClick={() => setActiveKey('more')}>Offers received</span>,
    },
    {
      key: moreActiveKey.list,
      label: <span onClick={() => setActiveKey('more')}>Active listings</span>,
    },
  ];

  return (
    <>
      <div className={`${styles['profile']} ${userInfo?.bannerImage ? 'has-banner' : ''}`}>
        <ProfileBanner
          onChange={handleProfileChange}
          bannerImage={bannerImage || ''}
          profileImage={profileImage || ''}
          name={userInfo?.name || ''}
          address={userInfo?.fullAddress || `ELF_${address}_${aelfInfo.curChain}`}
          email={userInfo?.email || ''}
          twitter={userInfo?.twitter || ''}
          instagram={userInfo?.instagram || ''}
        />
      </div>
      <div className="px-4 mdl:px-10 mt-4">
        <ExploreTab
          destroyInactiveTabPane={true}
          items={[
            {
              key: 'collected',
              label: (
                <span
                  className={clsx(
                    ' text-base font-semibold ',
                    activeKey === 'collected' ? 'text-textPrimary' : 'text-textSecondary',
                  )}>
                  Collected {collectedTotalCount ? <span>({collectedTotalCount})</span> : null}
                </span>
              ),
              children: <CollectedItem />,
            },
            {
              key: 'created',
              label: (
                <span
                  className={clsx(
                    ' text-base font-semibold ',
                    activeKey === 'created' ? 'text-textPrimary' : 'text-textSecondary',
                  )}>
                  Created {createdTotalCount ? <span>({createdTotalCount})</span> : null}
                </span>
              ),
              children: <CreatedItem />,
            },
            {
              key: 'activity',
              label: (
                <span
                  className={clsx(
                    ' text-base font-semibold ',
                    activeKey === 'activity' ? 'text-textPrimary' : 'text-textSecondary',
                  )}>
                  Activity
                </span>
              ),
              children: <ActivityItem />,
            },
            {
              key: 'more',
              label: (
                <Dropdown menu={{ items: itemsForMore, onClick: onMoreMenuClick }}>
                  <div
                    className={clsx(
                      'flex gap-x-2 items-center text-base font-semibold ',
                      activeKey === 'more' ? 'text-textPrimary' : 'text-textSecondary',
                    )}>
                    <span>More</span> <Down className=" text-textSecondary fill-textSecondary" />
                  </div>
                </Dropdown>
              ),
              children: <MoreCard activityKey={selectedKey} />,
            },
          ]}
          activeKey={activeKey}
          onTabClick={(key) => {
            console.log('onTabClick', key);
            if (key === 'more') return;
            setActiveKey(key);
          }}
        />
      </div>
    </>
  );
}
