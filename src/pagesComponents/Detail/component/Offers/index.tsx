import ELF from 'assets/images/ELF.png';

import styles from './style.module.css';
import { useCallback, useMemo, useState } from 'react';
import Logo from 'components/Logo';
import { useParams, useRouter } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { FormatOffersType } from 'store/types/reducer';
import { From } from 'types/nftTypes';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { OmittedType, getOmittedStr } from 'utils';
import { ColumnsType } from 'antd/lib/table';
import { IPaginationPage } from 'store/types/reducer';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';
import useDefaultActiveKey from 'pagesComponents/Detail/hooks/useDefaultActiveKey';
import ExchangeModal from '../ExchangeModal';
import { useModal } from '@ebay/nice-modal-react';
import CancelModal from '../CancelModal';
import { getOffersInfo } from './utils/getOffersInfo';
import useIntervalRequestForOffers from 'pagesComponents/Detail/hooks/useIntervalRequestForOffers';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import { useMount } from 'react-use';
import { useWalletSyncCompleted } from 'hooks/useWalletSync';

export default function Offers(options: { rate: number; nftBalance: number }) {
  const exchangeModal = useModal(ExchangeModal);
  const cancelModal = useModal(CancelModal);

  const { infoState, walletInfo, aelfInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const { detailInfo } = useDetailGetState();
  const { nftInfo, offers } = detailInfo;
  const { chainId, id } = useParams() as {
    chainId: Chain;
    id: string;
  };

  useIntervalRequestForOffers(id, chainId);

  const { getAccountInfoSync } = useWalletSyncCompleted(aelfInfo.curChain);

  const nav = useRouter();

  const { activeKey, setActiveKey } = useDefaultActiveKey(offers?.items, 'offers');

  const [pageState, setPageState] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { rate, nftBalance } = options;

  const getOffers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      await getOffersInfo(id, chainId, page, pageSize);
    } catch (error) {
      /* empty */
    }
    setLoading(false);
  };

  useMount(() => {
    getOffers(1, MAX_RESULT_COUNT_10);
  });

  const numberFormat = useCallback(
    (value: number) => value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,'),
    [],
  );

  const onCancel = async (data: FormatOffersType) => {
    const mainAddress = await getAccountInfoSync();
    if (!mainAddress) {
      return;
    }
    cancelModal.show({
      type: 'offer',
      data,
    });
  };

  const onDeal = (record: FormatOffersType) => {
    if (nftInfo) {
      const convertPrice = record?.price * (record?.token?.symbol === 'ELF' ? rate : 1);
      const art = {
        id: nftInfo?.nftTokenId,
        name: nftInfo?.tokenName || '',
        token: { symbol: record?.token.symbol },
        symbol: nftInfo!.nftSymbol,
        collection: nftInfo.nftCollection?.tokenName,
        decimals: record?.decimals,
        price: record?.price,
        quantity: record?.quantity,
        convertPrice,
        address: record?.from?.address || '',
      };

      exchangeModal.show({
        art,
        nftBalance,
        exchangeType: 'sell',
        onClose: () => {
          exchangeModal.hide();
        },
      });
    }
  };
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

  const columns: ColumnsType<FormatOffersType> = [
    {
      title: 'Price',
      key: 'price',
      width: isSmallScreen ? 180 : 220,
      dataIndex: 'price',
      render: (text: string, record: FormatOffersType) => (
        <div
          className={`text-[var(--color-secondary)] font-medium flex items-center ${
            isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
          }`}>
          <Logo className={'w-[16px] h-[16px] mr-[4px]'} src={ELF} />
          &nbsp;
          <span className="text-[var(--color-primary)] font-semibold">{formatTokenPrice(text)}</span>
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
            {formatUSDPrice(usdPrice)}
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
          {formatNumber(text)}
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
  ];

  const items = [
    {
      key: 'offers',
      header: (
        <div className="text-textPrimary text-[18px] font-medium leading-[26px] p-[16px] lg:p-[24px]">Offers</div>
      ),
      children: (
        <div className="border-0 border-t !border-solid border-lineBorder rounded-bl-[12px] rounded-br-[12px] overflow-hidden">
          <Table
            loading={loading}
            rowKey={(record) => record.from + record.key}
            pagination={{
              hideOnSinglePage: true,
              pageSize: pageState.pageSize,
              total: offers?.totalCount || 0,
              onChange: (page, pageSize) => {
                setPageState({ page, pageSize });
                getOffers(page, pageSize);
              },
            }}
            emptyText="No offers yet"
            columns={columns}
            dataSource={offers?.items || []}
            scroll={{ x: 630, y: 326 }}
          />
        </div>
      ),
    },
  ];

  console.log('offers rerender activeKey', activeKey);

  useMount(() => {
    console.log('offers rerender activeKey mounted', activeKey);
  });

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
