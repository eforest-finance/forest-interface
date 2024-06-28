import { IActivitiesItem } from 'api/types';
import clsx from 'clsx';
import { Typography } from 'antd';
import Button from 'baseComponents/Button';
import { ImageEnhance } from 'components/ImgLoading';
import { useResponsive } from 'hooks/useResponsive';
import { useRouter } from 'next/navigation';
import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import { useCallback, useEffect, useState } from 'react';
import { FormatListingType, FormatOffersType } from 'store/types/reducer';
import TableCell from 'pagesComponents/Detail/component/TableCell';
import getExpiryTime from 'utils/getExpiryTime';
import { moreActiveKey } from '../MoreItem';
import { useInitializationDetail } from 'pagesComponents/Detail/hooks/useInitializationDetail';
import useGetState from 'store/state/getState';
import { getFloorPricePercentage } from 'pagesComponents/Detail/utils/getOffers';
import { useCancelListing } from './useCancelListing';
import useTokenData from 'hooks/useTokenData';

const { Text } = Typography;

interface IUseOfferTableProps {
  activityKey: moreActiveKey;
  walletAddress: string;
}

export function useOfferTable(props: IUseOfferTableProps) {
  const { activityKey, walletAddress } = props;
  const { isLG: isSmallScreen } = useResponsive();
  const { cancelListingByRecord } = useCancelListing();
  const navigate = useRouter();
  const [tableColumns, setTableColumns] = useState<any>();
  const elfRate = useTokenData();

  const { walletInfo } = useGetState();

  const renderActivityTitle = useCallback((record: IActivitiesItem) => {
    return (
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          navigate.push(`/detail/buy/${record?.nftInfoId ?? ''}/${record?.purchaseToken?.chainId ?? ''}`);
        }}>
        <div className={clsx(isSmallScreen ? 'mr-2' : 'mr-4')}>
          <ImageEnhance
            src={record.previewImage || 'error'}
            className={clsx(
              'shrink-0 object-cover ',
              isSmallScreen ? '!w-8 !h-8 !rounded-sm' : '!w-[52px] !h-[52px] !rounded-md ',
            )}
          />
        </div>
        <div className="flex flex-col">
          <Text
            className=" font-medium !text-textSecondary text-xs"
            style={{ width: isSmallScreen ? 88 : 142 }}
            ellipsis={{
              tooltip: record.collectionName,
            }}>
            {record.collectionName}
          </Text>
          <Text
            className="font-semibold !text-textPrimary text-base"
            style={{ width: isSmallScreen ? 88 : 142 }}
            ellipsis={{
              tooltip: record.nftName,
            }}>
            {record.nftName}
          </Text>
        </div>
      </div>
    );
  }, []);

  const renderPrice = useCallback((text?: string | number, tokenSymbol?: string) => {
    const number = Number(text);
    if (number === -1 || isNaN(number) || text === undefined || text === '') return '--';
    return `${formatTokenPrice(text)} ${tokenSymbol ?? ''}`;
  }, []);

  const columns = {
    offer: {
      title: 'Offer',
      dataIndex: 'offer',
      key: 'offer',
      ellipsis: true,
      width: isSmallScreen ? 240 : 300,
      render: (_, record: any) => {
        return renderActivityTitle(record);
      },
    },
    price: {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      ellipsis: true,
      width: isSmallScreen ? 180 : undefined,
      render: (text: string, record: FormatListingType) => {
        return <TableCell content={`${formatTokenPrice(text)} ${record.purchaseToken.symbol}`} />;
      },
    },
    usdPrice: {
      title: 'USD Unit Price',
      dataIndex: 'price',
      key: 'usdPrice',
      width: isSmallScreen ? 180 : undefined,
      ellipsis: true,
      render: (_, record: FormatListingType) => {
        const usdPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? elfRate : 1);
        return <TableCell content={formatUSDPrice(Number(usdPrice))} />;
      },
    },
    floorPrice: {
      title: 'Floor Difference',
      key: 'floorPrice',
      dataIndex: 'floorPrice',
      width: isSmallScreen ? 120 : 170,
      render: (text: string, record: FormatOffersType) => (
        <TableCell
          content={getFloorPricePercentage(record.floorPrice || -1, record?.price)}
          tooltip={
            record.floorPrice !== -1
              ? `Collection floor price ${formatTokenPrice(record.floorPrice)} ${record.floorPriceSymbol}`
              : ''
          }
        />
      ),
    },
    timestamp: {
      title: 'Expiration',
      dataIndex: 'expireTime',
      key: 'expireTime',
      render: (text: string) => {
        return <div>{getExpiryTime(Number(text))}</div>;
      },
    },
    expirationDate: {
      title: 'Expiration Date',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => {
        return <div>{getExpiryTime(Number(text))}</div>;
      },
    },
    received: {
      title: 'Received',
      dataIndex: 'received',
      key: 'received',
    },
    quantity: {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 144,
    },
  };

  const cancelAction = {
    title: 'Action',
    align: 'right',
    fixed: 'right',
    render: (_, record: any) => {
      return (
        <Button
          type="default"
          className=" !rounded-md"
          size="middle"
          onClick={() => {
            cancelListingByRecord(record, 1);
          }}>
          Cancel
        </Button>
      );
    },
  };

  const acceptAction = {
    title: 'Action',
    align: 'right',
    fixed: 'right',
    render: (_, record: any) => {
      return (
        <Button
          type="default"
          className=" !rounded-md"
          size="middle"
          onClick={() => {
            navigate.push(`/detail/buy/${record?.id}/${record.chainId}`);
          }}>
          Accept
        </Button>
      );
    },
  };

  const shiftColumns = () => {
    const tColumns = getColumns();
    setTableColumns(tColumns);
  };

  const getColumns = () => {
    let tColumns = [] as any;

    switch (activityKey) {
      case moreActiveKey.made: {
        tColumns = [
          columns.offer,
          columns.price,
          columns.usdPrice,
          columns.floorPrice,
          columns.quantity,
          columns.timestamp,
        ];
        if (walletAddress === walletInfo.address) {
          tColumns.push(cancelAction);
        }
        break;
      }
      case moreActiveKey.receive:
        {
          tColumns = [
            columns.offer,
            columns.price,
            columns.usdPrice,
            columns.floorPrice,
            columns.quantity,
            columns.timestamp,
          ];
        }
        break;
      case moreActiveKey.list:
        {
          tColumns = [columns.offer, columns.price, columns.floorPrice, columns.expirationDate];
          if (walletAddress === walletInfo.address) {
            tColumns.push(cancelAction);
          }
        }
        break;

      default:
        break;
    }
    return tColumns;
  };

  useEffect(() => {
    shiftColumns();
  }, [activityKey, elfRate]);

  // useEffect(() => {
  //   if (walletAddress === walletInfo.address) {
  //     const action = activityKey === moreActiveKey.receive ? acceptAction : cancelAction;
  //     const tColumns = getColumns();
  //     setTableColumns([...tColumns, action]);
  //   }
  // }, [walletInfo.address]);

  return {
    actions: [cancelAction, acceptAction],
    shiftColumns,
    tableColumns,
    columns,
    renderActivityTitle,
    renderPrice,
    isSmallScreen,
  };
}
