import { useRef } from 'react';
import ItemsCard from 'components/ItemsCard';
import { useSelector } from 'store/store';
import useItemsList from 'hooks/useItemsList';
import useWindowWidth from 'hooks/useWindowWidth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEffectOnce, useHash, useLocation, useLocalStorage } from 'react-use';
import { usePathname } from 'next/navigation';
import { INftInfo } from 'types/nftTypes';
import { ADAPT_MAP } from '../assets';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import styles from './ScrollContent.module.css';
import LoadingMore from 'components/Loading';
import useColumns from 'hooks/useColumns';
import { BoxSizeEnum } from 'pagesComponents/ExploreItems/components/CollectionItemsSearch';
import storages from 'storages';

export default function ScrollContent() {
  const windowWidth = useWindowWidth();
  const [page, setPage] = useState<number>(0);
  const [changePage, setChangePage] = useState(false);
  const { search } = useLocation();
  const { address: nftCollectionIdOrAddress } = useParams() as { address: string };
  //const [hash] = useHash();
  const hash = window.location.hash;
  const pathname = usePathname();
  const pageModule = useMemo(() => pathname?.includes('/account'), [pathname]);
  const { loading } = useItemsList(page, MAX_RESULT_COUNT_10, nftCollectionIdOrAddress);
  const scrollLoading = useRef<boolean>(false);
  const [walletInfo] = useLocalStorage<WalletInfoType>(storages.walletInfo);

  const {
    layoutInfo: { isCollapsed, itemsSource, filterSelect, gridType },
    info: { isSmallScreen },
  } = useSelector((store) => store);
  const grid = useMemo(() => {
    if (gridType) return gridType;
    let column = '2';
    Object.entries(ADAPT_MAP).forEach(([key, v]) => {
      if (windowWidth > v) return (column = key);
      return;
    });
    return Number(column) + (isCollapsed && !isSmallScreen ? 1 : 0);
  }, [gridType, isCollapsed, windowWidth, isSmallScreen]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePage]);

  useEffect(() => {
    setPage(0);
  }, [filterSelect, hash]);

  useEffect(() => {
    scrollLoading.current = loading;
  }, [loading]);

  const navigate = useRouter();

  useEffect(() => {
    let hrefPrefix = '/detail';
    if (pageModule && (!nftCollectionIdOrAddress || walletInfo?.address === nftCollectionIdOrAddress)) {
      hrefPrefix += '/sell';
    } else {
      hrefPrefix += '/buy';
    }
    itemsSource?.items?.forEach((item) => {
      navigate.prefetch(`${hrefPrefix}/${item?.id ?? ''}/${item?.chainId ?? ''}`);
    });
  }, [itemsSource?.items, pageModule]);

  const cardClickHandler = useCallback(
    (item: INftInfo) => {
      navigate.push(`/detail/buy/${item?.id ?? ''}/${item?.chainId ?? ''}`);
      if (pageModule && (!nftCollectionIdOrAddress || walletInfo?.address === nftCollectionIdOrAddress)) {
        navigate.push(`/detail/sell/${item?.id ?? ''}/${item?.chainId ?? ''}`);
      } else {
        navigate.push(`/detail/buy/${item?.id ?? ''}/${item?.chainId ?? ''}`);
      }
    },
    [hash, navigate, pageModule],
  );

  const getData = useCallback(() => {
    if (scrollLoading.current) return;
    scrollLoading.current = true;
    console.log('>>>getData', loading, itemsSource?.items?.length, itemsSource?.totalCount);
    if (loading) return;
    if (itemsSource && !itemsSource.end) {
      setPage((v) => ++v);
    }
  }, [itemsSource, loading]);

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    console.log('>>>>', target.scrollHeight, target.scrollTop, target.clientHeight);
    if (target.scrollHeight - target.scrollTop - target.clientHeight <= 5) {
      setChangePage((v) => !v);
    }
  }, []);

  useEffectOnce(() => {
    document.querySelector('body')?.addEventListener('scroll', handleScroll);

    return () => {
      document.querySelector('body')?.removeEventListener('scroll', handleScroll);
    };
  });

  const cols = useColumns(!isCollapsed, BoxSizeEnum.small);

  return (
    <div className={styles['scroll-content-wrapper']}>
      <div className="m-6 -mb-2 font-medium text-base text-textPrimary rounded-lg px-6 py-4 bg-fillHoverBg">
        Your NFT possessions with quantities less than 1 are hidden.
      </div>
      <div className={`relative pb-[80px] min-h-[160px] ${!search ? 'no-filter-tag' : ''}`} id="scrollableDiv">
        {(!itemsSource || itemsSource?.items?.length < 1) && !loading && (
          <div className={`${styles['scroll-items-empty']} flex justify-center items-center`}>No Items to Display.</div>
        )}
        <div
          className={styles['scroll-content-container']}
          style={{ gridTemplateColumns: `repeat(${cols},minmax(0,1fr))` }}>
          {itemsSource?.items?.map((item: INftInfo) => (
            <ItemsCard
              hiddenActions={pageModule}
              key={item?.id}
              dataSource={item}
              onClick={() => {
                cardClickHandler(item);
              }}
            />
          ))}
        </div>
        {loading ? <LoadingMore className="!h-auto absolute bottom-[20px]" /> : null}
      </div>
    </div>
  );
}
