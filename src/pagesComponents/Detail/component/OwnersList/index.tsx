import { INftInfoOwnersItems } from 'api/types';
import { InfiniteScrollList, ListItem } from 'baseComponents/List';
import { ListItemMeta } from 'baseComponents/List/ListItem';
import Modal from 'baseComponents/Modal';
import useJumpExplorer from 'hooks/useJumpExplorer';
import { useRouter } from 'next/navigation';
import getOwnersList from 'pagesComponents/Detail/utils/getOwnersList';
import React, { useEffect, useState } from 'react';
import { OmittedType, getOmittedStr } from 'utils';
import useGetState from 'store/state/getState';
import AvatarDefault from 'assets/images/avatar-default.png';
import Image from 'next/image';
import { formatTokenPrice } from 'utils/format';
import { DEFAULT_PAGE_SIZE } from 'constants/index';

interface IProps {
  id: string;
  chainId: Chain;
  visible: boolean;
  onCancel: () => void;
}

function OwnersList({ id, chainId, visible, onCancel }: IProps) {
  const [data, setData] = useState<INftInfoOwnersItems[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const jump = useJumpExplorer();
  const nav = useRouter();
  const {
    walletInfo,
    infoState: { isSmallScreen },
  } = useGetState();

  const loadMoreData = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await getOwnersList({ id, chainId, page });
      if (res) {
        setData([...data, ...res.list]);
        if (data.length + res.list.length >= res.totalCount || res.list.length < DEFAULT_PAGE_SIZE) {
          setHasMore(false);
        }
        setPage((page) => ++page);
      }
    } catch (error) {
      /* empty */
    }
    setLoading(false);
  };

  const toPageAccount = (address: string) => {
    if (address && address.endsWith?.('_AELF')) {
      jump('AELF', `/address/${address}`);
      return;
    }
    if (address) {
      nav.push(`/account/${address}`);
    }
  };

  useEffect(() => {
    if (page === 1 && visible) {
      loadMoreData();
    }
  }, [visible, page]);

  const heightOfInfiniteScroll = !isSmallScreen
    ? Math.min((window.innerHeight || document.documentElement.clientHeight) * 0.8 - 96 - 40, 600)
    : Math.floor((window.innerHeight || document.documentElement.clientHeight) - 60 - 40);

  console.log('heightOfInfiniteScroll', heightOfInfiniteScroll);

  return (
    <Modal destroyOnClose={true} title="Owned by" footer={null} open={visible} onCancel={onCancel}>
      <div id="infiniteScrollList" className="h-full -mr-4">
        <InfiniteScrollList
          infiniteScrollProps={{
            next: loadMoreData,
            dataLength: data.length,
            hasMore,
            height: heightOfInfiniteScroll,
          }}
          listProps={{
            dataSource: data,
            renderItem: (item) => (
              <ListItem
                key={item.owner.address}
                extra={`${formatTokenPrice(item.itemsNumber)} ${item.itemsNumber > 1 ? 'items' : 'item'} `}
                className="cursor-pointer pr-4"
                onClick={() => toPageAccount(item.owner.address)}>
                <ListItemMeta
                  // avatar={<Avatar src={item.owner.profileImage} />}
                  avatar={
                    <Image
                      alt="avatar"
                      width={64}
                      height={64}
                      className="!w-[64] !h-[64px] !aspect-square bg-fillCardBg rounded-sm"
                      src={item.owner.profileImage || AvatarDefault}
                    />
                  }
                  title={
                    item.owner.address === walletInfo?.address
                      ? 'you'
                      : getOmittedStr(item.owner.name || '', OmittedType.NAME)
                  }
                  description={getOmittedStr(item.owner.fullAddress, OmittedType.ADDRESS)}
                />
              </ListItem>
            ),
          }}
        />
      </div>
    </Modal>
  );
}

export default React.memo(OwnersList);
