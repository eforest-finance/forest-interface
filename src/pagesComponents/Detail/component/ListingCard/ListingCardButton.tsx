import { forwardRef, useMemo } from 'react';

import useDetailGetState from 'store/state/detailGetState';
import React from 'react';
import { SegmentedValue } from 'antd/lib/segmented';
import SellButton from './SellButton';
import { useGetOwnerInfo } from 'pagesComponents/Detail/hooks/useGetOwnerInfo';
import BuyButton from './BuyButton';

interface IProps {
  rate: number;
  isERC721: boolean;
  currentRole: SegmentedValue;
}

function ListingCardButton(props: IProps) {
  const { currentRole, rate, isERC721 } = props;
  const { isOnlyOwner } = useGetOwnerInfo();

  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;

  const isSell = useMemo(() => {
    return isOnlyOwner || currentRole === 'sell';
  }, [isOnlyOwner, currentRole]);

  if (!nftInfo) return null;

  if (!isERC721 && isOnlyOwner && currentRole !== 'sell') return null;

  return <div>{isSell ? <SellButton rate={rate} /> : <BuyButton rate={rate} />}</div>;
}

export default React.memo(forwardRef(ListingCardButton));
