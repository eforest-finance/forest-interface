import ELF from 'assets/images/ELF.png';

import styles from './style.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Logo from 'components/Logo';
import { useParams, useRouter } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { FormatOffersType } from 'store/types/reducer';
import { From, OfferType } from 'types/nftTypes';
import { fetchNftOffers } from 'api/fetch';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { store } from 'store/store';
import { openModal } from 'store/reducer/errorModalInfo';
import moment from 'moment';
import { MILLISECONDS_PER_DAY } from 'constants/time';
import { setOffers as setStoreOffers } from 'store/reducer/detail/detailInfo';
import { OmittedType, getOmittedStr } from 'utils';
import { ColumnsType } from 'antd/lib/table';
import { IPaginationPage } from 'store/types/reducer';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';
import useDefaultActiveKey from 'pagesComponents/Detail/hooks/useDefaultActiveKey';

export default function Offers(options: { rate: number; nftBalance: number; onDeal: Function; onCancel: Function }) {
  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const { detailInfo } = useDetailGetState();
  const { nftInfo, offers, pageRefreshCount } = detailInfo;
  const { chainId } = useParams() as {
    chainId: Chain;
  };

  const nav = useRouter();

  const { activeKey, setActiveKey } = useDefaultActiveKey(offers, 'offers');

  const [pageState, setPageState] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { rate, nftBalance, onDeal, onCancel } = options;

  const getOffers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      if (nftInfo?.id) {
        const result = await fetchNftOffers({
          chainId,
          nftInfoId: nftInfo?.id,
          skipCount: (page - 1) * pageSize,
          maxResultCount: pageSize,
        });

        if (!result) store.dispatch(openModal());

        const resultItem = result?.items;
        const resultTotalCount = result?.totalCount;

        setTotal(resultTotalCount);

        const showList = resultItem?.reduce((prev: FormatOffersType[], item: OfferType, index: number) => {
          prev.push({
            key: index.toString(),
            token: { symbol: item.purchaseToken.symbol.toLocaleUpperCase(), id: 0 },
            decimals: item?.purchaseToken?.decimals,
            price: item?.price,
            quantity: item?.quantity,
            expiration: ((item?.expireTime - moment().valueOf()) / MILLISECONDS_PER_DAY).toFixed(0).toString(),
            expireTime: item?.expireTime,
            from: item?.from
              ? {
                  ...item?.from,
                  address: item.fromAddress || '',
                }
              : null,
            to: item?.to
              ? {
                  ...item?.to,
                  address: item.toAddress || '',
                }
              : null,
            nftInfo: item?.nftInfo,
          });
          return prev;
        }, []);
        store.dispatch(setStoreOffers(showList));
      } else {
        store.dispatch(setStoreOffers([]));
      }
    } catch (error) {
      /* empty */
    }
    setLoading(false);
  };

  const numberFormat = useCallback(
    (value: number) => value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,'),
    [],
  );

  const getDealDisabled = (toAddress: string | undefined) => {
    if (!nftBalance) {
      return true;
    }

    if (
      toAddress === walletInfo.address ||
      toAddress === nftInfo?.issuer ||
      toAddress === nftInfo?.proxyIssuerAddress
    ) {
      return false;
    }
    return true;
  };

  const columns: ColumnsType<FormatOffersType> = useMemo(
    () => [
      {
        title: 'Price',
        key: 'price',
        width: isSmallScreen ? 120 : 140,
        dataIndex: 'price',
        render: (text: string, record: FormatOffersType) => (
          <div
            className={`text-[var(--color-secondary)] font-medium flex items-center ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            <Logo className={'w-[16px] h-[16px] mr-[4px]'} src={ELF} />
            &nbsp;
            <span className="text-[var(--color-primary)] font-semibold">{numberFormat(Number(text))}</span>
            &nbsp;
            {record.token.symbol}
          </div>
        ),
      },
      {
        title: 'USD Price',
        key: 'usdPrice',
        width: isSmallScreen ? 120 : 170,
        dataIndex: 'usdPrice',
        render: (_, record: FormatOffersType) => {
          const usdPrice = record?.price * (record?.token?.symbol === 'ELF' ? rate : 1);
          return (
            <span
              className={`font-medium whitespace-nowrap ${
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
        width: isSmallScreen ? 120 : 108,
        render: (text: number | string) => (
          <span
            className={`text-[var(--color-secondary)] ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {text}
          </span>
        ),
      },
      {
        title: 'Expiration',
        key: 'expiration',
        width: isSmallScreen ? 120 : 140,
        dataIndex: 'expiration',
        render: (text: string) => (
          <span
            className={`font-medium text-[var(--color-secondary)] ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {(text && `in ${text} days`) || '--'}
          </span>
        ),
      },
      {
        title: 'From',
        key: 'from',
        dataIndex: 'from',
        width: isSmallScreen ? 240 : 260,
        render: (from: From | null) => {
          // console.log(walletInfo.address, from?.name, from?.name === walletInfo.address, 'xxx');
          return (
            <span
              className={`${styles.from} cursor-pointer text-[var(--brand-base)] font-medium ${
                isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
              }`}
              onClick={() => from?.address && nav.push(`/account/${from.address}`)}>
              {walletInfo.address === from?.address ? 'you' : getOmittedStr(from?.name || '', OmittedType.ADDRESS)}
            </span>
          );
        },
      },
      {
        key: 'action',
        width: 92,
        render: (_text: string, record: FormatOffersType) =>
          record?.from?.address !== walletInfo.address ? (
            nftBalance ? (
              <Button
                className="!w-[68px] flex justify-center items-center !h-[28px] !text-[12px] !font-medium !rounded-[6px] !p-0"
                disabled={getDealDisabled(record.to?.address)}
                type="primary"
                onClick={() => {
                  onDeal({
                    ...record,
                    quantity: nftBalance < record.quantity ? nftBalance : record.quantity,
                  });
                }}>
                Deal
              </Button>
            ) : null
          ) : (
            <Button
              className="!w-[68px] flex justify-center items-center !h-[28px] !text-[12px] !font-medium !rounded-[6px] !p-0"
              type="default"
              onClick={() => onCancel(record)}>
              Cancel
            </Button>
          ),
      },
    ],
    [isSmallScreen, numberFormat, rate, nav, walletInfo.address, nftBalance, onDeal, onCancel],
  );

  useEffect(() => {
    console.log('offer');
    getOffers(1, pageState.pageSize);
  }, [nftInfo?.id, pageRefreshCount]);

  const items = [
    {
      key: 'offers',
      header: <div className="text-textPrimary text-[18px] font-medium leading-[26px]">Offers</div>,
      children: (
        <div className="border-0 border-t !border-solid border-lineBorder rounded-bl-[12px] rounded-br-[12px] overflow-hidden">
          <Table
            loading={loading}
            rowKey={(record) => record.from + record.key}
            pagination={{
              hideOnSinglePage: true,
              pageSize: pageState.pageSize,
              total,
              onChange: (page, pageSize) => {
                setPageState({ page, pageSize });
                getOffers(page, pageSize);
              },
            }}
            emptyText="No offers yet"
            columns={columns}
            dataSource={offers || []}
            scroll={{ x: 630, y: 326 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={`${styles.offers} ${isSmallScreen && styles['mobile-offers']}`}>
      <CollapseForPC
        activeKey={activeKey}
        onChange={() => {
          setActiveKey((c) => (c === 'offers' ? undefined : 'offers'));
        }}
        items={items}
        wrapClassName={`${styles.offers} ${isSmallScreen && styles['mobile-offers']}`}
      />
    </div>
  );
}
