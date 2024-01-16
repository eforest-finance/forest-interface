import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import styles from './style.module.css';
import { BigNumber } from 'bignumber.js';
import { divDecimals } from 'utils/calculate';
import { useRouter, useParams } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import Modals from 'components/WhiteList/components/Modals';
import { FormatListingType } from 'store/types/reducer';
import { ColumnsType } from 'antd/lib/table';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import { IPaginationPage } from 'store/types/reducer';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';
import useDefaultActiveKey from 'pagesComponents/Detail/hooks/useDefaultActiveKey';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import { useModal } from '@ebay/nice-modal-react';
import { getListingsInfo } from './utils/getListingsInfo';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import { COLUMN_TITLE } from '../Offers';
import { DEFAULT_CELL_WIDTH, DEFAULT_PAGE_SIZE } from 'constants/index';
import getTextWidth from 'utils/getTextWidth';
import { timeFormat } from 'pagesComponents/Detail/utils/timeFormat';
import TableCell from '../TableCell';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { useListingService } from '../SaleListingModal/hooks/useListingService';
import { INftInfo } from 'types/nftTypes';
import BuyNowModal from '../BuyNowModal';
import useIntervalRequestForListings from 'pagesComponents/Detail/hooks/useIntervalRequestForListings';

function Listings(option: { rate: number }) {
  const { chainId, id } = useParams() as {
    chainId: Chain;
    id: string;
    type: string;
  };
  const { isLogin, login } = useCheckLoginAndToken();

  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const { rate } = option;
  const { detailInfo, modalAction } = useDetailGetState();
  const { nftInfo, listings, nftNumber } = detailInfo;
  const columWidth = useRef<Map<string, number>>();

  const { cancelListingItem } = useListingService(nftInfo as INftInfo, rate, undefined, true);

  // const [page, setPage] = useState<number>(1);
  const [pageState, setPage] = useState<IPaginationPage>({
    pageSize: DEFAULT_PAGE_SIZE,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const nav = useRouter();

  const buyModal = useModal(BuyNowModal);
  const { activeKey, setActiveKey } = useDefaultActiveKey(listings?.items, 'listings');
  const isERC721: boolean = useMemo(() => !(nftInfo && isTokenIdReuse(nftInfo)), [nftInfo]);

  const titles = useMemo(() => {
    const nftType = isERC721 ? 721 : 1155;
    return COLUMN_TITLE[nftType] || COLUMN_TITLE[1155];
  }, [isERC721]);

  const onCancel = (data: FormatListingType) => {
    cancelListingItem(data);
  };

  const onClickBuy = (record: FormatListingType) => {
    buyModal.show({
      elfRate: rate,
      buyItem: record,
    });
  };

  const buyDisabled = useCallback(
    (record: FormatListingType) => {
      if (isLogin) {
        const nftBalanceBig = new BigNumber(nftNumber.nftBalance);
        const nftQuantityBig = new BigNumber(nftNumber.nftQuantity);
        const myBalanceBig = divDecimals(nftNumber.tokenBalance, 8);
        const priceBig = new BigNumber(record.price);

        return nftBalanceBig.comparedTo(nftQuantityBig) === 0 || myBalanceBig.comparedTo(priceBig) === -1;
      } else {
        return false;
      }
    },
    [isLogin, nftNumber.tokenBalance, nftNumber.nftBalance, nftNumber.nftQuantity],
  );

  useEffect(() => {
    const getMaxColumWidth = () => {
      const widthMap = new Map();

      listings?.items?.forEach((target: FormatListingType) => {
        const price = `${formatTokenPrice(target.price)} ${target?.purchaseToken?.symbol}`;
        const usdPrice = target?.price * (target?.purchaseToken?.symbol === 'ELF' ? rate : 1);

        const priceWidth = getTextWidth(String(price)) + 24;
        const usdPriceWidth = getTextWidth(String(usdPrice)) + 24;

        const curPriceValue = widthMap.get('price') || 0;
        const curUsdPriceValue = widthMap.get('usdPrice') || 0;

        widthMap.set('price', Math.max(curPriceValue, priceWidth, DEFAULT_CELL_WIDTH));
        widthMap.set('usdPrice', Math.max(curUsdPriceValue, usdPriceWidth, isERC721 ? DEFAULT_CELL_WIDTH : 170));
        columWidth.current = widthMap;
      });
    };

    if (listings?.items && listings.items.length) {
      getMaxColumWidth();
    }
  }, [isSmallScreen, listings, rate]);

  const columns: ColumnsType<FormatListingType> = useMemo(
    () => [
      {
        title: titles.PRICE,
        key: 'price',
        width: columWidth.current?.get('price') || DEFAULT_CELL_WIDTH,
        dataIndex: 'price',
        render: (text: string, record: FormatListingType) => (
          <TableCell content={`${formatTokenPrice(text)} ${record.purchaseToken.symbol}`} />
        ),
      },
      {
        title: titles.USD_PRICE,
        key: 'usdPrice',
        width: columWidth.current?.get('usdPrice') || (isERC721 ? DEFAULT_CELL_WIDTH : 170),
        dataIndex: 'usdPrice',
        render: (_, record: FormatListingType) => {
          const usdPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? rate : 1);
          return <TableCell content={formatUSDPrice(Number(usdPrice))} />;
        },
      },
      {
        title: 'Quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        width: isSmallScreen ? 120 : 110,
        render: (text: number | string) => <TableCell content={formatNumber(text)} tooltip={formatTokenPrice(text)} />,
      },
      {
        title: 'Expiration',
        key: 'expiration',
        dataIndex: 'expiration',
        width: isSmallScreen ? 120 : 140,
        render: (text: string, record: FormatListingType) => (
          <TableCell content={(text && text) || '-'} tooltip={timeFormat(record.endTime)} />
        ),
      },
      {
        title: 'From',
        key: 'fromName',
        dataIndex: 'fromName',
        width: isSmallScreen ? 240 : 260,
        render: (text: string, record: FormatListingType) => (
          <TableCell
            content={
              record.ownerAddress === walletInfo.address ? 'you' : getOmittedStr(text || '', OmittedType.ADDRESS)
            }
            isLink={true}
            onClick={() => nav.push(`/account/${record.ownerAddress}`)}
            tooltip={addPrefixSuffix(record.ownerAddress)}
          />
        ),
      },
      {
        key: 'action',
        width: 92,
        render: (_text: string, record: FormatListingType) =>
          record.ownerAddress !== walletInfo.address ? (
            <Button
              type="primary"
              size="mini"
              disabled={buyDisabled(record)}
              onClick={() => {
                if (isLogin) {
                  onClickBuy(record);
                } else {
                  login();
                }
              }}>
              Buy
            </Button>
          ) : (
            <Button size="mini" type="default" onClick={() => onCancel(record)}>
              Cancel
            </Button>
          ),
      },
    ],
    [
      isLogin,
      isSmallScreen,
      nav,
      rate,
      titles.PRICE,
      titles.USD_PRICE,
      walletInfo.address,
      nftNumber.tokenBalance,
      nftNumber.nftBalance,
      nftNumber.nftQuantity,
      columWidth.current?.get('price'),
      columWidth.current?.get('usdPrice'),
    ],
  );

  const getListingsData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      await getListingsInfo(chainId, page, pageSize);
    } catch (error) {
      /* empty */
    }

    setLoading(false);
  };

  useIntervalRequestForListings(id, chainId);

  const items = [
    {
      key: 'listings',
      header: (
        <div className="text-textPrimary text-[18px] font-medium leading-[26px] p-[16px] lg:p-[24px]">Listings</div>
      ),
      children: (
        <div className="border-0 border-t !border-solid border-lineBorder rounded-bl-[12px] rounded-br-[12px] overflow-hidden">
          <Table
            loading={loading}
            columns={columns}
            scroll={{ x: 792, y: 326 }}
            pagination={{
              hideOnSinglePage: true,
              pageSize: pageState.pageSize,
              total: listings?.totalCount || 0,
              onChange: (page, pageSize) => {
                setPage({ page, pageSize });
                getListingsData(page, pageSize);
              },
            }}
            adaptation={true}
            emptyText="No listings yet."
            dataSource={listings?.items || []}
          />
        </div>
      ),
    },
  ];

  console.log('================listing render activeKey', activeKey);

  return (
    <div id="listings" className={`${styles.listings} ${isSmallScreen && 'mt-4'}`}>
      <Modals modalAction={modalAction} />
      <CollapseForPC
        activeKey={activeKey}
        onChange={() => {
          console.log('================active key', activeKey);
          setActiveKey((c) => (c === 'listings' ? undefined : 'listings'));
        }}
        items={items}
        wrapClassName={`${styles['price-history']} ${isSmallScreen && styles['mobile-price-history']}`}
      />
    </div>
  );
}

export default memo(Listings);
