import styles from './style.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { FormatOffersType } from 'store/types/reducer';
import { From } from 'types/nftTypes';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import { ColumnsType } from 'antd/lib/table';
import { IPaginationPage } from 'store/types/reducer';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Button from 'baseComponents/Button';
import useDefaultActiveKey from 'pagesComponents/Detail/hooks/useDefaultActiveKey';
import ExchangeModal, { ArtType } from '../ExchangeModal/index';
import AcceptModal from '../AcceptModal';
import ApproveModal from 'components/ApproveModal';

import { useModal } from '@ebay/nice-modal-react';
import { getOffersInfo } from './utils/getOffersInfo';
import useIntervalRequestForOffers from 'pagesComponents/Detail/hooks/useIntervalRequestForOffers';
import { formatNumber, formatTokenPrice, formatUSDPrice } from 'utils/format';
import getTextWidth from 'utils/getTextWidth';
import TableCell from '../TableCell';
import { timeFormat } from 'pagesComponents/Detail/utils/timeFormat';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { useMount } from 'react-use';
import PromptModal from 'components/PromptModal';
import { CancelOfferMessage } from 'constants/promptMessage';
import { handlePlurality } from 'utils/handlePlurality';
import useCancelOffer from 'pagesComponents/Detail/hooks/useCancelOffer';
import BigNumber from 'bignumber.js';
import Copy from 'components/Copy';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export const COLUMN_TITLE = {
  1155: {
    PRICE: 'Unit Price',
    USD_PRICE: 'Unit USD Price',
  },
  721: {
    PRICE: 'Price',
    USD_PRICE: 'USD Price',
  },
};

export default function Offers(options: { rate: number }) {
  const exchangeModal = useModal(ExchangeModal);
  const acceptModal = useModal(AcceptModal);
  const promptModal = useModal(PromptModal);
  const approveModal = useModal(ApproveModal);

  const columWidth = useRef<Map<string, number>>();

  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const { detailInfo } = useDetailGetState();
  const { nftInfo, offers, nftNumber } = detailInfo;

  const cancelOffer = useCancelOffer(nftInfo?.chainId);

  const { chainId, id } = useParams() as {
    chainId: Chain;
    id: string;
  };

  useIntervalRequestForOffers(id, chainId);

  const nav = useRouter();
  const { isLogin, login } = useCheckLoginAndToken();

  const { activeKey, setActiveKey } = useDefaultActiveKey(offers?.items, 'offers');

  const [pageState, setPageState] = useState<IPaginationPage>({
    pageSize: 100,
    page: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { rate } = options;

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
    getOffers(pageState.page, pageState.pageSize);
  });

  const handleCancelOffer = async (data: FormatOffersType) => {
    try {
      await cancelOffer({
        symbol: nftInfo?.nftSymbol || '',
        tokenId: nftInfo?.nftTokenId || 0,
        offerFrom: data?.from?.address || '',
        cancelOfferList: [
          {
            expireTime: {
              nanos: 0,
              seconds: `${(data?.expireTime || 0) / 1000}`,
            },
            offerTo: data?.to?.address,
            price: {
              symbol: 'ELF',
              amount: new BigNumber(data?.price || 0).times(10 ** 8).toNumber(),
            },
          },
        ],
      });
      promptModal.hide();
      approveModal.hide();
    } catch (error) {
      approveModal.hide();
      return Promise.reject(error);
    }
  };

  const onCancel = (data: FormatOffersType) => {
    const totalPrice = data?.price * data.quantity;
    const usdPrice = totalPrice * (rate || 1);
    approveModal.show({
      nftInfo: {
        image: nftInfo?.previewImage || '',
        collectionName: nftInfo?.nftCollection?.tokenName,
        nftName: nftInfo?.tokenName,
        priceTitle: 'Total Offer',
        price: `${formatTokenPrice(totalPrice)} ${data.token.symbol || 'ELF'}`,
        usdPrice: formatUSDPrice(usdPrice),
        number: data.quantity,
      },
      title: 'Cancel Offer',
      initialization: () => handleCancelOffer(data),
      amount: data.quantity,
      showBalance: false,
      onClose: () => {
        approveModal.hide();
      },
    });

    // promptModal.show({
    //   nftInfo: {
    //     image: nftInfo?.previewImage || '',
    //     collectionName: nftInfo?.nftCollection?.tokenName,
    //     nftName: nftInfo?.tokenName,
    //     priceTitle: 'Offer Price',
    //     price: `${formatTokenPrice(data.price)} ${data.token.symbol || 'ELF'}`,
    //     usdPrice: formatUSDPrice(usdPrice),
    //     item: handlePlurality(Number(data.quantity), 'item'),
    //   },
    //   title: CancelOfferMessage.title,
    //   content: {
    //     title: walletInfo.portkeyInfo ? CancelOfferMessage.portkey.title : CancelOfferMessage.default.title,
    //     content: walletInfo.portkeyInfo ? CancelOfferMessage.portkey.message : CancelOfferMessage.default.message,
    //   },
    //   initialization: () => handleCancelOffer(data),
    //   onClose: () => {
    //     promptModal.hide();
    //   },
    // });
  };

  const onDeal = (record: FormatOffersType) => {
    if (nftInfo) {
      const convertPrice = record?.price * (record?.token?.symbol === 'ELF' ? rate : 1);
      const art: ArtType = {
        id: nftInfo?.nftTokenId,
        name: nftInfo?.tokenName || '',
        token: { symbol: record?.token.symbol },
        symbol: nftInfo?.nftSymbol,
        collection: nftInfo.nftCollection?.tokenName,
        nftDecimals: Number(nftInfo?.decimals || 0),
        decimals: record?.decimals,
        price: record?.price,
        quantity: record?.quantity,
        convertPrice,
        address: record?.from?.address || '',
        collectionSymbol: nftInfo.nftCollection?.symbol,
      };
      acceptModal.show({
        art,
        nftInfo,
        rate: rate,
        nftBalance: Number(nftNumber.nftBalance),
        onClose: () => acceptModal.hide(),
      });
    }
  };
  const getDealDisabled = (toAddress: string | undefined) => {
    if (!nftNumber.nftBalance) {
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

  const isERC721: boolean = useMemo(() => !(nftInfo && isTokenIdReuse(nftInfo)), [nftInfo]);

  const titles = useMemo(() => {
    const nftType = isERC721 ? 721 : 1155;
    return COLUMN_TITLE[nftType] || COLUMN_TITLE[1155];
  }, [isERC721]);

  useEffect(() => {
    const getMaxColumWidth = () => {
      const widthMap = new Map();

      offers?.items?.forEach((target: FormatOffersType) => {
        const price = `${formatTokenPrice(target?.price)} ${target.token.symbol}`;
        const usdPrice = `${formatUSDPrice(target?.price * (target?.token?.symbol === 'ELF' ? rate : 1))}`;

        const priceWidth = getTextWidth(price) + 24;
        const usdPriceWidth = getTextWidth(formatUSDPrice(Number(usdPrice))) + 24;

        const curPriceValue = widthMap.get('price') || 0;
        const curUsdPriceValue = widthMap.get('usdPrice') || 0;

        widthMap.set('price', Math.max(curPriceValue, priceWidth, 150));
        widthMap.set('usdPrice', Math.max(curUsdPriceValue, usdPriceWidth, 150));
        columWidth.current = widthMap;
      });
    };

    if (offers?.items && offers.items.length) {
      getMaxColumWidth();
    }
  }, [isSmallScreen, offers, rate]);

  const showAction = useMemo(() => {
    const canCancelList = offers?.items?.filter((item) => item?.from?.address === walletInfo.address);
    if (canCancelList?.length) {
      return true;
    } else {
      return nftNumber.nftBalance ? true : false;
    }
  }, [nftNumber.nftBalance, offers?.items, walletInfo.address]);

  const columns: ColumnsType<FormatOffersType> = useMemo(
    () => [
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        width: 172,
        render: (text: string, record: FormatOffersType) => {
          const usdPrice = record?.price * (record?.token?.symbol === 'ELF' ? rate : 1);
          return (
            <TableCell
              content={
                <span className="flex flex-col">
                  <span className="text-textPrimary text-[14px] font-medium">{`${formatTokenPrice(text)} ${
                    record.token.symbol
                  }`}</span>
                  <span className="text-textSecondary text-[12px]">({formatUSDPrice(Number(usdPrice))})</span>
                </span>
              }
            />
          );
        },
      },
      {
        title: 'Quantity',
        key: 'quantity',
        dataIndex: 'quantity',
        width: isSmallScreen ? 120 : 84,
        render: (text: number | string) => <TableCell content={formatNumber(text)} tooltip={formatTokenPrice(text)} />,
      },
      {
        title: 'Floor Difference',
        key: 'floorPricePercentage',
        dataIndex: 'floorPricePercentage',
        width: isSmallScreen ? 160 : 125,
        render: (text: string, record: FormatOffersType) => (
          <TableCell
            content={text}
            tooltip={
              record.floorPrice !== -1
                ? `Collection floor price ${formatTokenPrice(record.floorPrice)} ${record.floorPriceSymbol}`
                : ''
            }
          />
        ),
      },
      {
        title: 'Expiration',
        key: 'expiration',
        width: isSmallScreen ? 120 : 96,
        dataIndex: 'expiration',
        render: (text: string, record: FormatOffersType) => (
          <TableCell content={(text && text) || '-'} tooltip={timeFormat(record.expireTime)} />
        ),
      },
      {
        title: 'From',
        key: 'from',
        dataIndex: 'from',
        width: isSmallScreen ? 240 : 186,
        render: (from: From | null) => {
          return (
            <div className="flex items-center">
              <TableCell
                content={
                  <span className="text-brandNormal">
                    {walletInfo.address === from?.address
                      ? 'you'
                      : getOmittedStr(from?.name || '', OmittedType.ADDRESS)}
                  </span>
                }
                isLink={true}
                onClick={() => from?.address && nav.push(`/account/${from.address}#Collected`)}
                tooltip={from?.address && addPrefixSuffix(from.address)}
              />
              <Copy className="copy-svg ml-2 cursor-pointer" toCopy={addPrefixSuffix(from?.address || '')} />
            </div>
          );
        },
      },
      {
        title: 'Operation',
        key: 'Operation',
        fixed: showAction ? 'right' : false,
        width: 110,
        render: (_text: string, record: FormatOffersType) =>
          record?.from?.address !== walletInfo.address ? (
            nftNumber.nftBalance ? (
              <Button
                className="!w-[64px]"
                size="mini"
                disabled={getDealDisabled(record.to?.address)}
                type="primary"
                onClick={() => onDeal(record)}>
                Accept
              </Button>
            ) : null
          ) : (
            <Button
              size="mini"
              type="default"
              className="!rounded-[12px] !border-0 !bg-fillHoverBg !w-[72px] h-[28px]"
              onClick={() => onCancel(record)}>
              Cancel
            </Button>
          ),
      },
    ],
    [
      isSmallScreen,
      nav,
      nftNumber.nftBalance,
      rate,
      titles.PRICE,
      titles.USD_PRICE,
      walletInfo.address,
      columWidth.current?.get('price'),
      columWidth.current?.get('usdPrice'),
      nftNumber.tokenBalance,
      nftNumber.nftBalance,
      nftNumber.nftQuantity,
    ],
  );

  // const getColumns = useMemo(() => {
  //   if (isLogin) {
  //     return columns;
  //   } else {
  //     const newColumns = [...columns];
  //     newColumns.pop();
  //     return newColumns;
  //   }
  // }, [isLogin]);

  const getColumns = () => {
    const newColumns = [...columns];
    if (!isLogin) {
      newColumns.pop();
    }

    if (isERC721) {
      return newColumns.filter((item) => item.key !== 'quantity');
    }
    return newColumns;
  };

  return (
    <div className="border-0  rounded-bl-[12px] rounded-br-[12px] overflow-hidden">
      <Table
        className={styles['offers-table-custom']}
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
        adaptation={false}
        emptyText="No offers yet."
        columns={getColumns()}
        dataSource={offers?.items || []}
        scroll={{ x: 625, y: 320 }}
      />
    </div>
  );
}
