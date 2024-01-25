import ELF from 'assets/images/ELF.png';
import { useEffect, useState } from 'react';
import styles from './style.module.css';
import { setListings as setStoreListings } from 'store/reducer/detail/detailInfo';
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
import getListings from 'pagesComponents/Detail/utils/getListings';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function Listings(option: {
  nftBalance: number;
  nftQuantity: number;
  myBalance: BigNumber | undefined;
  rate: number;
  onClickBuy: Function;
  onClickCancel: Function;
}) {
  const { type, chainId } = useParams() as {
    chainId: Chain;
    type: string;
  };
  const { isLogin, login } = useCheckLoginAndToken();

  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const { nftBalance, nftQuantity, myBalance, rate, onClickBuy, onClickCancel } = option;
  const { detailInfo, modalAction } = useDetailGetState();
  const { nftInfo, listings, pageRefreshCount } = detailInfo;
  console.log('///listings', listings);

  // const [page, setPage] = useState<number>(1);
  const [pageState, setPage] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const nav = useRouter();

  const { activeKey, setActiveKey } = useDefaultActiveKey(listings, 'listings');

  const numberFormat = (value: number) => {
    return value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  };

  const columns: ColumnsType<FormatListingType> = [
    {
      title: 'Price',
      key: 'price',
      width: isSmallScreen ? 120 : 140,
      dataIndex: 'price',
      render: (text: string, record: FormatListingType) => (
        <div
          className={`flex items-center font-medium text-[var(--color-secondary)] ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
          <Logo className={'w-[16px] h-[16px] mr-[4px]'} src={ELF} />
          &nbsp;
          <span className="text-[var(--color-primary)] font-semibold">{text}</span>
          &nbsp;
          {record.purchaseToken.symbol}
        </div>
      ),
    },
    {
      title: 'USD Unit Price',
      key: 'usdPrice',
      width: isSmallScreen ? 120 : 170,
      dataIndex: 'usdPrice',
      render: (_, record: FormatListingType) => {
        const usdPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? rate : 1);
        return (
          <span
            className={`font-medium text-[16px] ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            $ {numberFormat(Number(usdPrice))}
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
        <span
          className={`text-[var(--color-secondary)] font-medium ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
          {text}
        </span>
      ),
    },
    {
      title: 'Expiration',
      key: 'expiration',
      dataIndex: 'expiration',
      width: isSmallScreen ? 120 : 140,
      render: (text: string) => (
        <span
          className={`font-medium text-[var(--color-secondary)] ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
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
          className={`font-medium text-[var(--brand-base)] cursor-pointer ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}
          onClick={() => nav.push(`/account/${record.ownerAddress}`)}>
          {getOmittedStr(text || '', OmittedType.NAME)}
        </span>
      ),
    },
    {
      key: 'action',
      width: 92,
      render: (_text: string, record: FormatListingType) =>
        record.fromName !== 'you' ? (
          <Button
            className="!w-[68px] flex justify-center items-center !h-[28px] !text-[12px] !font-medium !rounded-[6px] !p-0"
            type="primary"
            disabled={
              isLogin ? nftBalance >= nftQuantity || divDecimals(myBalance, 8)?.toNumber() < record.price : false
            }
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
            onClick={() => onClickCancel(record)}>
            Cancel
          </Button>
        ),
    },
  ];

  const getListingsData = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      if (!nftInfo?.nftSymbol) {
        store.dispatch(setStoreListings([]));
        return;
      }
      const result = await getListings({
        page,
        pageSize,
        symbol: nftInfo?.nftSymbol,
        address: walletInfo.address,
        chainId,
      });
      if (!result) {
        setLoading(false);
        store.dispatch(openModal());
        return;
      }

      setTotal(result.totalCount);
      store.dispatch(setStoreListings(result.list));
    } catch (error) {
      /* empty */
    }

    setLoading(false);
  };

  useEffect(() => {
    getListingsData(1, pageState.pageSize);
  }, [nftInfo?.id, pageRefreshCount]);

  const items = [
    {
      key: 'listings',
      header: <div className="text-textPrimary text-[18px] font-medium leading-[26px]">Listings</div>,
      children: (
        <div className="border-0 border-t !border-solid border-lineBorder rounded-bl-[12px] rounded-br-[12px] overflow-hidden">
          <Table
            loading={loading}
            columns={columns}
            scroll={{ x: 792, y: 326 }}
            pagination={{
              hideOnSinglePage: true,
              pageSize: pageState.pageSize,
              total,
              onChange: (page, pageSize) => {
                setPage({ page, pageSize });
                getListingsData(page, pageSize);
              },
            }}
            emptyText="No listings yet"
            dataSource={listings || []}
          />
        </div>
      ),
    },
  ];

  return (
    <div id="listings" className={`${styles.listings} ${isSmallScreen && 'mt-4'}`}>
      <Modals modalAction={modalAction} />
      <CollapseForPC
        activeKey={activeKey}
        onChange={() => {
          setActiveKey((c) => (c === 'listings' ? undefined : 'listings'));
        }}
        items={items}
        wrapClassName={`${styles['price-history']} ${isSmallScreen && styles['mobile-price-history']}`}
      />
    </div>
  );
}
