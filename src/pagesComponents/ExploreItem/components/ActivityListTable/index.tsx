import Table from 'baseComponents/Table';
import { Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ImageEnhance } from 'components/ImgLoading';
import { useResponsive } from 'hooks/useResponsive';
import clsx from 'clsx';
import { formatTokenPrice, getDateString } from 'utils/format';
import Tooltip from 'baseComponents/Tooltip';
import moment from 'moment';
import Copy from 'components/Copy';
import { IActivitiesItem, IFrom, ITo } from 'api/types';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

import { useRouter, useParams } from 'next/navigation';
import ShareLink from 'assets/images/explore/sharelink.svg';
import useGetState from 'store/state/getState';

import { OmittedType, addPrefixSuffix, getExploreLink, getOmittedStr, getOriginalAddress } from 'utils';
import { AcitvityItemArray } from 'pagesComponents/ExploreItem/constant';
import HonourLabel from 'baseComponents/HonourLabel';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';

const { Text } = Typography;

export const getLogoUrl = (symbol: string) => {
  return symbol && symbol.toUpperCase() === 'ELF' ? ELF : '';
};

interface IActivityListTableProps {
  dataSource: IActivitiesItem[];
  loading: boolean;
  stickeyOffsetHeight: number;
}

const renderPrice = (text?: string | number, tokenSymbol?: string) => {
  const number = Number(text);
  if (number === -1 || isNaN(number) || text === undefined || text === '') return '--';
  return `${formatTokenPrice(text)} ${tokenSymbol ?? ''}`;
};

export function ActivityListTable({ dataSource, loading, stickeyOffsetHeight }: IActivityListTableProps) {
  const { address } = useParams();
  const nftCollectionId = address?.[0] || '';

  const isSchrondinger = nftCollectionId.endsWith('-SGRTEST-0') || nftCollectionId.endsWith('-SGR-0');

  const { isLG: isSmallScreen } = useResponsive();
  const { walletInfo: wallet } = useConnectWallet();

  const {
    infoState: { sideChain },
  } = useGetState();

  const nav = useRouter();

  const renderActivityTitle = (record: IActivitiesItem) => {
    return (
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          nav.push(`/detail/buy/${record?.nftInfoId ?? ''}/${record?.priceToken?.chainId ?? ''}`);
        }}>
        <div className={clsx(isSmallScreen ? 'mr-2' : 'mr-4')}>
          <ImageEnhance
            src={record.previewImage || record.nftUrl || 'error'}
            className={clsx(
              'shrink-0 object-cover ',
              isSmallScreen ? '!w-8 !h-8 !rounded-sm' : '!w-[52px] !h-[52px] !rounded-md ',
            )}
          />
        </div>
        {!isSmallScreen ? (
          <div className="flex flex-col">
            <Text
              className=" font-medium !text-textSecondary text-xs"
              style={{ width: isSmallScreen ? 88 : 142 }}
              ellipsis={{
                tooltip: record.nftCollectionName,
              }}>
              {record.nftCollectionName}
            </Text>
            <Text
              className=" font-semibold !text-textPrimary text-base"
              style={{ width: isSmallScreen ? 88 : 142 }}
              ellipsis={{
                tooltip: record.nftName,
              }}>
              {record.nftName}
            </Text>
          </div>
        ) : null}
      </div>
    );
  };

  const renderAddress = (addrObj: IFrom | ITo | null | undefined, currentUserAddress: string) => {
    if (!addrObj) return '-';
    if (!!currentUserAddress && getOriginalAddress(addrObj.address) === getOriginalAddress(currentUserAddress)) {
      return (
        <span
          onClick={() => nav.push(`/account/${addrObj?.address}#Collected`)}
          className=" text-brandHover cursor-pointer">
          You
        </span>
      );
    }
    if (
      addrObj.name &&
      addPrefixSuffix(addrObj.address) !== addPrefixSuffix(addrObj.name) &&
      getOriginalAddress(addrObj.name) !== addrObj.address
    )
      return (
        <div
          onClick={() => nav.push(`/account/${addrObj?.address}#Collected`)}
          className="flex items-center  cursor-pointer">
          <span className=" text-brandHover">{getOmittedStr(addrObj.name, OmittedType.NAME)}</span>
        </div>
      );
    if (addrObj.address)
      return (
        <div className="flex items-center cursor-pointer">
          <span className=" text-brandHover" onClick={() => nav.push(`/account/${addrObj?.address}#Collected`)}>
            {getOmittedStr(addPrefixSuffix(addrObj.address), OmittedType.ADDRESS)}
          </span>
          <Copy className="w-4 h-4 fill-textSecondary ml-2" toCopy={addrObj.address}></Copy>
        </div>
      );
    return '-';
  };

  const columns: ColumnsType<IActivitiesItem> = [
    {
      title: 'Activity Type',
      dataIndex: 'type',
      key: 'activity',
      width: isSmallScreen ? 80 : 160,
      fixed: 'left',
      ellipsis: true,
      render: (text) => {
        const str = AcitvityItemArray[text] || '--';
        return (
          <Tooltip title={str}>
            <span>{str}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Item',
      dataIndex: 'tokenName',
      key: 'tokenName',
      width: isSmallScreen ? 64 : 240,
      ellipsis: true,
      fixed: 'left',
      render: (_, record) => {
        return renderActivityTitle(record);
      },
    },
    {
      title: 'Rarity',
      dataIndex: 'describe',
      key: 'describe',
      width: 136,
      render: (text) => {
        if (!text) return '--';
        return <HonourLabel text={text} theme="white" />;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      ellipsis: true,
      width: 160,
      render: (text, record) => {
        return (
          <div className="text-[var(--color-secondary)] font-medium text-[16px] flex items-center overflow-x-auto h-full">
            <Logo className="w-[16px] h-[16px] mr-[4px]" src={getLogoUrl(record?.priceToken?.symbol || '')} />
            &nbsp;
            <span
              className={`text-[var(--color-primary)] font-semibold ${
                isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
              }`}>
              {formatTokenPrice(+text)}
            </span>
            &nbsp;
            <span
              className={`text-[var(--color-secondary)] font-medium ${
                isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
              }`}>
              {record?.priceToken?.symbol}
            </span>
          </div>
        );
      },
      // render: (text, record) => renderPrice(text, record.priceToken?.symbol || 'ELF'),
    },
    {
      title: 'Quantity',
      dataIndex: 'amount',
      key: 'quantity',
      width: 144,
      render: (text) => renderPrice(text),
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      ellipsis: true,
      width: 264,
      render: (_, record) => renderAddress(record.from, wallet?.address),
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      ellipsis: true,
      width: 264,
      render: (_, record) => renderAddress(record.to, wallet?.address),
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      ellipsis: true,
      width: 160,
      align: 'right',
      render: (text, record) => {
        const number = Number(text);
        if (number === -1 || isNaN(number) || text === undefined || text === '') return '-';
        return (
          <a
            className=" inline-flex items-center cursor-pointer !text-textPrimary"
            target="_blank"
            rel="noreferrer"
            href={getExploreLink(record.transactionHash, 'transaction', record?.priceToken?.chainId || 'tDVV')}>
            <Tooltip title={moment(number).format('YYYY/MM/DD HH:mm:ss')}>
              <span>{getDateString(number)}</span>
            </Tooltip>
            <ShareLink className="ml-2 fill-textSecondary hover:fill-brandHover" />
          </a>
        );
      },
    },
  ];

  if (!isSchrondinger) {
    columns.splice(2, 1);
  }

  if (isSmallScreen) {
    const itm = columns.shift();
    itm && columns.splice(1, 0, itm);
  }

  return (
    <Table
      size="middle"
      emptyText="No activities yet"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      scroll={{ x: 1280 }}
    />
  );
}
