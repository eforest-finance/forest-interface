import { Typography, Popover } from 'antd';
import Table from 'baseComponents/Table';
import type { ColumnsType } from 'antd/es/table';
import Tooltip from 'baseComponents/Tooltip';
import clsx from 'clsx';
import { ImageEnhance } from 'components/ImgLoading';
import moment from 'moment';
import React, { useState } from 'react';
import { ICreator, INftInfo } from 'types/nftTypes';
import { formatTokenPrice, formatUSDPrice, getDateString } from 'utils/format';
import Copy from 'components/Copy';
import { NFTTraitInfoCard } from './NFTTraitInfoCard';
import useResponsive from 'hooks/useResponsive';
import OwnersList from 'pagesComponents/Detail/component/OwnersList';
import useGetState from 'store/state/getState';
import { useWebLogin } from 'aelf-web-login';
import { OmittedType, addPrefixSuffix, getOmittedStr, getOriginalAddress } from 'utils';
import { useRouter } from 'next/navigation';
import BigNumber from 'bignumber.js';
import styles from './style.module.css';

const { Text } = Typography;

interface INFTListTableProps {
  dataSource: INftInfo[];
  ELFToDollarRate: number;
  loading?: boolean;
}

export function NFTListTable({ dataSource, ELFToDollarRate, loading }: INFTListTableProps) {
  const { isLG: isSmallScreen } = useResponsive();
  const { infoState } = useGetState();
  const { wallet } = useWebLogin();
  const nav = useRouter();
  const [nftOwnerListModalParams, setNftOwnerListModalParams] = useState<{
    id: string;
    chainId: Chain;
    visible: boolean;
  }>({
    id: '',
    chainId: infoState.sideChain,
    visible: false,
  });

  const showNftOwnerList = (data: INftInfo) => {
    setNftOwnerListModalParams({
      id: data.id,
      chainId: data.chainIdStr as Chain,
      visible: true,
    });
  };

  const onCloseNftOwnerListModal = () => {
    setNftOwnerListModalParams((pre) => ({
      ...pre,
      visible: false,
    }));
  };

  const renderNftTitle = (record: INftInfo) => {
    return (
      <div className="flex items-center cursor-pointer">
        <div className={clsx(isSmallScreen ? 'mr-2' : 'mr-4')}>
          <ImageEnhance
            src={record.previewImage || 'error'}
            className={clsx(
              'shrink-0 object-cover ',
              isSmallScreen ? '!w-8 !h-8 !rounded-sm' : '!w-[52px] !h-[52px] !rounded-md ',
            )}
          />
        </div>
        <Text
          className=" font-semibold !text-textPrimary"
          style={{ width: isSmallScreen ? 88 : 142 }}
          ellipsis={{
            tooltip: record.tokenName,
          }}>
          {record.tokenName}
        </Text>
      </div>
    );
  };

  const renderAddress = (addrObj: ICreator | null | undefined) => {
    if (!addrObj) return '-';
    if (!!wallet?.address && getOriginalAddress(addrObj.address) === getOriginalAddress(wallet?.address)) {
      return (
        <Tooltip title={addPrefixSuffix(wallet.address)}>
          <span
            className=" text-base text-brandNormal font-medium cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              nav.push('/account');
            }}>
            You
          </span>
        </Tooltip>
      );
    }

    if (
      addrObj.name &&
      addPrefixSuffix(addrObj.address) !== addPrefixSuffix(addrObj.name) &&
      getOriginalAddress(addrObj.name) !== addrObj.address
    ) {
      return (
        <Tooltip title={addPrefixSuffix(addrObj.address)}>
          <span
            className=" text-base text-brandNormal font-medium cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              nav.push(`/account/${addrObj.address}`);
            }}>
            {getOmittedStr(addrObj.name, OmittedType.NAME)}
          </span>
        </Tooltip>
      );
    }
    if (addrObj.address) {
      return (
        <div
          className="flex items-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            nav.push(`/account/${addrObj.address}`);
          }}>
          <Tooltip title={addPrefixSuffix(addrObj.address)}>
            <span className=" text-base text-brandHover font-medium cursor-pointer">
              {getOmittedStr(addPrefixSuffix(addrObj.address), OmittedType.ADDRESS)}
            </span>
          </Tooltip>
          <Copy className="copy-svg ml-2" toCopy={addrObj.address}></Copy>
        </div>
      );
    }
    return '-';
  };

  const renderPrice = (text?: string | number) => {
    const number = Number(text);
    if (number === -1 || isNaN(number) || text === undefined || text === '') return '--';
    return (
      <Tooltip title={formatUSDPrice(BigNumber(ELFToDollarRate).multipliedBy(BigNumber(text)))}>
        <span className=" cursor-pointer">{formatTokenPrice(text)} ELF</span>
      </Tooltip>
    );
  };

  const columns: ColumnsType<INftInfo> = [
    {
      title: 'Item',
      dataIndex: 'tokenName',
      key: 'tokenName',
      fixed: 'left',
      width: isSmallScreen ? 144 : 240,
      ellipsis: true,
      render: (_, record) => {
        if (isSmallScreen) return renderNftTitle(record);
        return (
          <Popover
            placement="bottom"
            trigger={'hover'}
            overlayClassName={styles['custom-popover']}
            destroyTooltipOnHide={true}
            content={<NFTTraitInfoCard nftInfo={record} />}>
            {renderNftTitle(record)}
          </Popover>
        );
      },
    },
    {
      title: 'Current Price',
      dataIndex: 'listingPrice',
      key: 'listingPrice',
      ellipsis: true,
      width: isSmallScreen ? 144 : 240,
      render: renderPrice,
    },
    {
      title: 'Best Offer',
      dataIndex: 'offerPrice',
      key: 'offerPrice',
      ellipsis: true,
      width: isSmallScreen ? 144 : 220,
      render: renderPrice,
    },
    {
      title: 'Last Sale',
      dataIndex: 'latestDealPrice',
      key: 'latestDealPrice',
      ellipsis: true,
      width: isSmallScreen ? 144 : 220,
      render: renderPrice,
    },
    {
      title: 'Owner',
      dataIndex: 'allOwnerCount',
      key: 'ownerCount',
      ellipsis: true,
      width: 260,
      render: (text, record) => {
        const number = Number(text);
        if (number === -1 || isNaN(number) || text === undefined || text === '') return '-';
        if (number === 1) {
          return renderAddress(record.realOwner);
        }
        return (
          <span
            className=" text-base text-brandNormal font-medium cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              showNftOwnerList(record);
            }}>
            {number} Owners
          </span>
        );
      },
    },
    {
      title: 'Time Listed',
      dataIndex: 'listingPriceCreateTime',
      key: 'listingPriceCreateTime',
      ellipsis: true,
      width: isSmallScreen ? 140 : 220,
      align: 'right',
      render: (text, record) => {
        const listPirce = Number(record.listingPrice);
        if (listPirce === -1 || isNaN(listPirce) || text === '') return '-';

        if (!text) return '-';

        return (
          <span>
            <Tooltip title={moment(text).format('YYYY/MM/DD HH:mm:ss')}>
              <span>{getDateString(moment(text).valueOf())}</span>
            </Tooltip>
          </span>
        );
      },
    },
  ];
  return (
    <>
      <Table
        size="middle"
        pagination={false}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => nav.push(`/detail/buy/${record?.id ?? ''}/${record?.chainIdStr ?? ''}`),
          };
        }}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: isSmallScreen ? 1080 : 1280 }}
        sticky={{
          offsetHeader: isSmallScreen ? 198 : 224,
        }}
      />
      {nftOwnerListModalParams?.visible && (
        <OwnersList
          visible={!!nftOwnerListModalParams?.visible}
          id={nftOwnerListModalParams?.id || ''}
          chainId={nftOwnerListModalParams?.chainId as unknown as Chain}
          onCancel={onCloseNftOwnerListModal}
        />
      )}
    </>
  );
}
