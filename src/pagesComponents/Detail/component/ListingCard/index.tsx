import useGetState from 'store/state/getState';

import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import React, { useEffect, useMemo, useState } from 'react';
import ListingCardTitle from './ListingCardTitle';
import ListingCardBody from './ListingCardBody';
import { NftInfoPriceType } from 'types/nftTypes';
import { SegmentedValue } from 'antd/lib/segmented';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { useGetOwnerInfo } from 'pagesComponents/Detail/hooks/useGetOwnerInfo';

function ListingCard(options: { rate: number }) {
  const { rate } = options;
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const [currentRole, setCurrentRole] = useState<SegmentedValue>('buy');
  const { isOnlyOwner, isOwner } = useGetOwnerInfo();

  const isListing: boolean = useMemo(
    () =>
      nftInfo?.showPriceType === NftInfoPriceType.otherMinListing ||
      nftInfo?.showPriceType === NftInfoPriceType.myMinListing,
    [nftInfo],
  );

  const isERC721: boolean = useMemo(() => !(nftInfo && isTokenIdReuse(nftInfo)), [nftInfo]);

  const hasChange: boolean = useMemo(
    () => !!(nftInfo && !isERC721 && isOwner),
    [nftInfo, isERC721, isOwner, isOnlyOwner],
  );

  const isHiddenTitle = useMemo(
    () => !nftInfo || (isERC721 && !isListing) || (!hasChange && !isListing),
    [hasChange, isERC721, isListing, nftInfo],
  );

  useEffect(() => {
    !isOwner && setCurrentRole('buy');
    isOnlyOwner && setCurrentRole('sell');
  }, [isOnlyOwner, isOwner]);

  if (!nftInfo) return null;

  return (
    <div
      className={`${styles['listing-card']} mdTW:mt-[40px] mb-[16px] ${
        isSmallScreen && styles['mobile-listing-card']
      }`}>
      <ListingCardBody isERC721={isERC721} rate={rate} currentRole={currentRole} />
      {!isHiddenTitle && (
        <ListingCardTitle
          showTime={!!(isListing && nftInfo?.listingEndTime)}
          endTime={nftInfo?.listingEndTime}
          hasChange={hasChange}
          currentRole={currentRole}
          onChangeCurrentRole={setCurrentRole}
          isERC721={isERC721}
        />
      )}
    </div>
  );
}

export default React.memo(ListingCard);
