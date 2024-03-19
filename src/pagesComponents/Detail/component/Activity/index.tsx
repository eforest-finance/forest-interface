import { Checkbox, MenuProps, message, Space } from 'antd';
import ELF from 'assets/images/ELF.png';
import Logo from 'components/Logo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getExploreLink, getOmittedStr, OmittedType } from 'utils';
import { DownOutlined } from '@ant-design/icons';
import Jump from 'assets/images/detail/jump.svg';
import qs from 'query-string';
import CloseOutlined from 'assets/images/explore/tag-close.svg';

import styles from './style.module.css';
import moment from 'moment';
import { useCopyToClipboard } from 'react-use';
import { useRouter } from 'next/navigation';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { IActivitiesItem, IActivities, IFrom, ITo } from 'api/types';
import { fetchActivities } from 'api/fetch';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { MINUTES_PER_HOUR, MONTH_DAYS, TIME_FORMAT_24_HOUR, YEAR_MONTHS } from 'constants/time';
import Loading from 'components/Loading';
import CollapseForPC from 'components/Collapse';
import Table from 'baseComponents/Table';
import Dropdown from 'baseComponents/Dropdown';
import { formatTokenPrice } from 'utils/format';

export default function Activity() {
  const [, setCopied] = useCopyToClipboard();
  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isMobile, isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [activitiesRes, setActivitiesRes] = useState<IActivities>({
    items: [],
    totalCount: 0,
  });
  const nav = useRouter();

  const [visible, setVisible] = useState(false);
  const [filterObj, setFilterObj] = useState<Record<string, boolean>>({
    Sale: true,
    ListWithFixedPrice: true,
  });

  const activities = useMemo(() => {
    return activitiesRes.items;
  }, [activitiesRes.items]);

  const filterList: string[] = [
    'Issue',
    'Burn',
    'Transfer',
    'Sale',
    'ListWithFixedPrice',
    'DeList',
    'MakeOffer',
    'CancelOffer',
  ].concat(/SEED-*/.test(nftInfo?.nftSymbol || '') ? ['PlaceBid'] : []);

  const dropdownMenu: MenuProps | undefined = useMemo(() => {
    return {
      items: filterList.map((item) => {
        return {
          label: (
            <Checkbox
              className={styles['detail-activity-checkbox']}
              checked={filterObj[item]}
              onChange={(e) => onFilterChange(e.target.checked, item)}>
              {item}
            </Checkbox>
          ),
          key: item,
        };
      }),
    };
  }, [filterObj, filterList]);

  const getDateString = useCallback((timestamp: number) => {
    const duration = moment.duration(moment().valueOf() - timestamp);
    if (duration.asMinutes() < MINUTES_PER_HOUR) return `${duration.asMinutes().toFixed(0)} minutes ago`;
    if (duration.asHours() < TIME_FORMAT_24_HOUR) return `${duration.asHours().toFixed(0)} hours ago`;
    if (duration.asDays() < MONTH_DAYS) return `${duration.asDays().toFixed(0)} days ago`;
    if (duration.asMonths() < YEAR_MONTHS) return `${duration.asMonths().toFixed(0)} months ago`;
    return `${duration.asYears().toFixed(0)} years ago`;
  }, []);

  const getLogoUrl = (symbol: string) => {
    return symbol && symbol.toUpperCase() === 'ELF' ? ELF : '';
  };

  const onJump = (record: IActivitiesItem) => {
    setCopied(getExploreLink(record.transactionHash, 'transaction', nftInfo?.chainId) || '');
    message.success('Copied');
  };

  const columns = useMemo(
    () => [
      {
        title: 'Activity',
        width: isSmallScreen ? 120 : 200,
        dataIndex: 'type',
        render: (type: number) => (
          <p className={`font-medium ${isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'}`}>
            {filterList[type]}
          </p>
        ),
      },
      {
        title: 'Price',
        width: 180,
        dataIndex: 'price',
        render: (text: string, record: IActivitiesItem) => (
          <div className="text-[var(--color-secondary)] font-medium text-[16px] flex items-center overflow-x-auto h-full">
            <Logo className="w-[16px] h-[16px] mr-[4px]" src={getLogoUrl(record?.priceToken?.symbol)} />
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
        ),
      },
      {
        title: 'Quantity',
        dataIndex: 'amount',
        width: isSmallScreen ? 120 : 108,
        render: (text: string) => (
          <p
            className={`text-[var(--color-secondary)] font-medium ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {text}
          </p>
        ),
      },
      {
        title: 'From',
        dataIndex: 'from',
        width: isSmallScreen ? 120 : 200,
        render: (from: IFrom | null) => (
          <p
            className={`cursor-pointer text-[var(--brand-base)] font-medium from ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}
            onClick={() => from?.address && nav.push(`/account/${from?.address}`)}>
            {getOmittedStr(from?.name || '--', OmittedType.ADDRESS)}
          </p>
        ),
      },
      {
        title: 'To',
        dataIndex: 'to',
        width: isSmallScreen ? 120 : 192,
        render: (to: ITo | null) => (
          <>
            {to ? (
              <p
                className={`cursor-pointer text-[var(--brand-base)] font-medium from ${
                  isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
                }`}
                onClick={() => to?.address && nav.push(`/account/${to?.address}`)}>
                {getOmittedStr(to?.name || '', OmittedType.ADDRESS)}
              </p>
            ) : (
              '--'
            )}
          </>
        ),
      },
      {
        title: 'Date',
        key: 'date',
        dataIndex: 'timestamp',
        width: isSmallScreen ? 148 : 200,
        render: (timestamp: number, record: IActivitiesItem) => (
          <p
            className={`${styles.jump} text-[var(--color-primary)] font-medium from flex items-center ${
              isSmallScreen ? 'text-[12px] leading-[18px]' : 'text-[16px] leading-[24px]'
            }`}>
            {getDateString(timestamp)}

            <a
              target="_blank"
              href={getExploreLink(record.transactionHash, 'transaction', nftInfo?.chainId)}
              rel="noreferrer">
              <div className="ml-[12px] w-[16px] h-[16px] cursor-pointer">
                <Jump />
              </div>
            </a>
          </p>
        ),
      },
    ],
    [getDateString, isMobile, isSmallScreen, nav, nftInfo?.chainId],
  );

  const handleTableScroll = (target: HTMLDivElement) => {
    if (target.id !== 'activity-table-wrap') return;
    const remainingDistance = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (remainingDistance < target.clientHeight) {
      if (loading || tableLoading) return;
      if (activities && activities?.length < activitiesRes.totalCount)
        if (activitiesRes?.items) {
          setTableLoading(true);
          setPage((v) => ++v);
        }
    }
  };

  const onFilterChange = (checked: boolean, item: string) => {
    setActivitiesRes({ items: [], totalCount: 0 });
    setFilterObj((v) => ({ ...v, [item]: checked }));
    setPage(0);
  };

  const getActivitiesList = async () => {
    if (!activitiesRes.items?.length) setLoading(true);
    try {
      const types = Object.keys(filterObj)
        .filter((key) => filterObj[key])
        .map((key) => filterList.findIndex((item) => item === key));
      const params = qs.stringify({
        nftInfoId: nftInfo!.id,
        types,
        skipCount: page * MAX_RESULT_COUNT_10,
        maxResultCount: MAX_RESULT_COUNT_10,
      });
      const result = await fetchActivities(params);
      setActivitiesRes((v) => ({
        items: (page && v?.items && v.items.concat(result?.items || [])) || result?.items,
        totalCount: result?.totalCount || 0,
      }));
    } catch (error) {
      /* empty */
    }
    setLoading(false);
    setTableLoading(false);
  };

  useEffect(() => {
    if (nftInfo?.id) {
      getActivitiesList();
    }
  }, [nftInfo?.id, filterObj, page]);

  const items = [
    {
      key: 'activity',
      header: (
        <div className="text-textPrimary text-[18px] font-medium leading-[26px] p-[16px] lg:p-[24px]">Activity</div>
      ),
      children: (
        <div className="border-0 border-t !border-solid border-lineBorder">
          <div id="filter" className="px-[24px] pt-[16px]">
            <Dropdown trigger={['click']} overlayClassName={styles['detail-activity-dropdown']} menu={dropdownMenu}>
              <div className={`filter flex justify-between`} onClick={() => setVisible((v) => !v)}>
                <p className="text-textPrimary">Filter</p>
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
          {!!Object.keys(filterObj).filter((key) => filterObj[key]).length && (
            <div className={`${styles['filter-list']} flex px-[24px]`}>
              <Space wrap size={16}>
                {Object.keys(filterObj)
                  .filter((key) => filterObj[key])
                  .map((item) => (
                    <p className={`${styles['filter-item']} flex`} key={item}>
                      <span className={styles['filter-item__label']}> {item}</span>
                      <CloseOutlined onClick={() => onFilterChange(false, item)} />
                    </p>
                  ))}
                <p
                  className="px-[16px] py-[9px] text-sm font-medium text-[var(--text-item)] hover:text-textPrimary cursor-pointer"
                  onClick={() => setFilterObj({})}>
                  Clear All
                </p>
              </Space>
            </div>
          )}
          <div
            id="activity-table-wrap"
            className={`border-0 border-t border-solid border-[var(--line-box)] ${
              isSmallScreen ? 'max-h-[192px]' : 'max-h-[238px]'
            } rounded-bl-[12px] rounded-br-[12px] overflow-y-scroll`}
            onScrollCapture={(e) => handleTableScroll(e.target as HTMLDivElement)}>
            <Table
              rowKey={(record) => record.id}
              sticky={{
                offsetHeader: 0,
              }}
              emptyText={!tableLoading ? 'No activities yet' : ''}
              loading={false}
              columns={columns || []}
              scroll={{ x: 630 }}
              pagination={false}
              dataSource={activities || []}
            />
            {tableLoading && (
              <div className="w-full py-[12px]">
                <Loading imgStyle="!h-[30px] !w-[30px]" />
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div id="activityWrap" className={`${styles.activity} ${isSmallScreen && styles['mobile-activity']}`}>
      <CollapseForPC items={items} wrapClassName={`${styles.activity} ${isSmallScreen && styles['mobile-activity']}`} />
    </div>
  );
}
