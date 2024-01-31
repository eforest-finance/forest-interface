'use client';

import ItemsLayout from 'components/ItemsLayout';
import { profileFilterList } from 'components/ItemsLayout/assets';
import { useSelector, dispatch } from 'store/store';
import { setGridType, setFilterList } from 'store/reducer/layoutInfo';
import { useItemsCount } from 'hooks/useItemsList';
import useUserInfo from 'hooks/useUserInfo';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useHash, useLocalStorage } from 'react-use';
import ProfileBanner from './components/ProfileBanner';
import styles from './Profile.module.css';
import CollectedMenu from 'assets/images/CollectedMenu.svg';
import Created from 'assets/images/Created.svg';
import storages from 'storages';
import { useLogoutListener } from 'hooks/useLogoutListener';

export default function Profile() {
  const getUserInfo = useUserInfo();
  const {
    userInfo: { userInfo: currentUserInfo },
    layoutInfo: { itemsSource },
  } = useSelector((store) => store);
  const navigate = useRouter();
  const { address } = useParams() as {
    address: string;
  };
  // const [hash] = useHash();
  const hash = window.location.hash;
  const [userInfo, setUserInfo] = useState<UserInfoType>(currentUserInfo);
  const [walletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);

  const countData = useItemsCount(address || walletInfo?.address || '');

  const accountAddress = address || walletInfo?.address || '';
  const showAddress = userInfo?.fullAddress || '';

  const { tabType, totalCount } = (itemsSource || {}) as { tabType?: string; totalCount?: number };

  const [createdCount, setCreatedCount] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);

  useEffect(() => {
    if (totalCount) {
      if (hash === '#Collected' && tabType === hash) {
        setCollectedCount(totalCount);
      }
      if (hash === '#Created' && tabType === hash) {
        setCreatedCount(totalCount);
      }
    }
  }, [hash, tabType, totalCount]);

  // console.log(tabType, hash, 'itemsSource===');
  useEffect(() => {
    if (!accountAddress) return navigate.push('/collections');
    getUserInfo(accountAddress, true).then((userInfo) => {
      setUserInfo(userInfo as unknown as UserInfoType);
    });
  }, []);
  const tabName = useMemo(
    () => [
      {
        title: 'Collected',
        key: 'Collected',
        icon: <CollectedMenu />,
        tips: Math.max(collectedCount, countData?.collected || 0),
      },
      {
        title: 'Created',
        key: 'Created',
        icon: <Created />,
        tips: Math.max(createdCount, countData?.created || 0),
      },
    ],
    [collectedCount, countData?.collected, countData?.created, createdCount],
  );

  useEffect(() => {
    dispatch(setFilterList(profileFilterList));
    dispatch(setGridType(null));
  }, []);

  return (
    <div className={`${styles['profile']} ${userInfo?.bannerImage ? 'has-banner' : ''}`}>
      <ProfileBanner
        bannerImage={userInfo?.bannerImage}
        profileImage={userInfo?.profileImage}
        name={userInfo?.name}
        address={showAddress}
        email={userInfo?.email}
        twitter={userInfo?.twitter}
        instagram={userInfo?.instagram}
      />
      <ItemsLayout tabNav={tabName} className={`${styles['items-layout-rewrite']} layout`} />
    </div>
  );
}
