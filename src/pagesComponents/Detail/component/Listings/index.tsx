import ELF from 'assets/images/ELF.png';
import { memo, useCallback, useState } from 'react';
import styles from './style.module.css';
import { BigNumber } from 'bignumber.js';
import { divDecimals } from 'utils/calculate';
import Logo from 'components/Logo';
import { useRouter, useParams } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import Modals from 'components/WhiteList/components/Modals';
import { FormatListingType } from 'store/types/reducer';
import { ColumnsType } from 'antd/lib/table';
import { store } from 'store/store';
import { openModal } from 'store/reducer/errorModalInfo';
import { OmittedType, getOmittedStr } from 'utils';
import { IPaginationPage } from 'store/types/reducer';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';
import useDefaultActiveKey from 'pagesComponents/Detail/hooks/useDefaultActiveKey';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import ExchangeModal, { ArtType } from '../ExchangeModal';
import CancelModal from '../CancelModal';
import { useModal } from '@ebay/nice-modal-react';
import { getListingsInfo } from './utils/getListingsInfo';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import { useListingService } from '../SaleListingModal/hooks/useListingService';
import { INftInfo } from 'types/nftTypes';
import { useMount } from 'react-use';
import BuyNowModal from '../BuyNowModal';

function Listings(option: { nftBalance: number; nftQuantity: number; myBalance: BigNumber | undefined; rate: number }) {
  const exchangeModal = useModal(ExchangeModal);
  const cancelModal = useModal(CancelModal);

  const { chainId, id } = useParams() as {
    chainId: Chain;
    id: string;
    type: string;
  };
  const { isLogin, login } = useCheckLoginAndToken();
  const buyModal = useModal(BuyNowModal);

  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const { nftBalance, nftQuantity, myBalance, rate } = option;
  const { detailInfo, modalAction } = useDetailGetState();
  const { nftInfo, listings } = detailInfo;

  const { cancelListingItem } = useListingService(nftInfo as INftInfo, undefined, true);

  // const [page, setPage] = useState<number>(1);
  const [pageState, setPage] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const nav = useRouter();

  const { activeKey, setActiveKey } = useDefaultActiveKey(listings?.items, 'listings');

  const numberFormat = (value: number) => {
    return value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  };

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
        const nftBalanceBig = new BigNumber(nftBalance);
        const nftQuantityBig = new BigNumber(nftQuantity);
        const myBalanceBig = divDecimals(myBalance, 8);
        const priceBig = new BigNumber(record.price);
        return nftBalanceBig.comparedTo(nftQuantityBig) === 0 || myBalanceBig.comparedTo(priceBig) === -1;
      } else {
        return false;
      }
    },
    [isLogin, myBalance, nftBalance, nftQuantity],
  );

  const columns: ColumnsType<FormatListingType> = [
    {
      title: 'Price',
      key: 'price',
      width: isSmallScreen ? 180 : 220,
      dataIndex: 'price',
      render: (text: string, record: FormatListingType) => (
        <div className={`flex items-center font-medium text-textPrimary ${isSmallScreen ? 'text-sm' : 'text-base'}`}>
          <Logo className={'w-[16px] h-[16px] mr-[4px]'} src={ELF} />
          &nbsp;
          <span className="text-[var(--color-primary)] font-semibold">{formatTokenPrice(text)}</span>
          &nbsp;
          {record.purchaseToken.symbol}
        </div>
      ),
    },
    {
      title: 'USD Unit Price',
      key: 'usdPrice',
      width: isSmallScreen ? 180 : 220,
      dataIndex: 'usdPrice',
      render: (_, record: FormatListingType) => {
        const usdPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? rate : 1);
        return (
          <span className={`font-medium ${isSmallScreen ? 'text-sm' : 'text-base'}`}>
            {formatUSDPrice(Number(usdPrice))}
          </span>
        );
      },
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      width: isSmallScreen ? 120 : 110,
      render: (text: number | string) => (
        <span className={`text-[var(--color-secondary)] font-medium ${isSmallScreen ? 'text-sm' : 'text-base'}`}>
          {formatNumber(text)}
        </span>
      ),
    },
    {
      title: 'Expiration',
      key: 'expiration',
      dataIndex: 'expiration',
      width: isSmallScreen ? 120 : 140,
      render: (text: string) => (
        <span className={`font-medium text-[var(--color-secondary)] ${isSmallScreen ? 'text-sm' : 'text-base'}`}>
          {(text && `in ${text} days`) || '-'}
        </span>
      ),
    },
    {
      title: 'From',
      key: 'fromName',
      dataIndex: 'fromName',
      width: isSmallScreen ? 240 : 260,
      render: (text: string, record: FormatListingType) => (
        <span
          className={`font-medium text-[var(--brand-base)] cursor-pointer ${isSmallScreen ? 'text-sm' : 'text-base'}`}
          onClick={() => nav.push(`/account/${record.ownerAddress}`)}>
          {record.ownerAddress === walletInfo.address ? 'you' : getOmittedStr(text || '', OmittedType.NAME)}
        </span>
      ),
    },
    {
      key: 'action',
      width: 92,
      render: (_text: string, record: FormatListingType) =>
        record.ownerAddress !== walletInfo.address ? (
          <Button
            className="!w-[68px] flex justify-center items-center !h-[28px] !text-[12px] !font-medium !rounded-[6px] !p-0"
            type="primary"
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
          <Button
            className="!w-[68px] flex justify-center items-center !h-[28px] !text-[12px] !font-medium !rounded-[6px] !p-0"
            type="default"
            onClick={() => onCancel(record)}>
            Cancel
          </Button>
        ),
    },
  ];

  const getListingsData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      await getListingsInfo(chainId, page, pageSize);
    } catch (error) {
      /* empty */
    }

    setLoading(false);
  };

  useMount(() => {
    getListingsData(pageState.page, pageState.pageSize);
  });

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
            emptyText="No listings yet"
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
